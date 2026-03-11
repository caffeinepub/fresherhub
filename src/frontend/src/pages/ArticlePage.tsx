import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle, useIsAdmin, usePinArticle } from "@/hooks/useQueries";
import { getCategoryColor } from "@/lib/categoryColors";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  Pin,
  PinOff,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderContent(content: string) {
  return content.split("\n").map((para) => {
    if (para.startsWith("## ")) {
      return { type: "h2" as const, text: para.slice(3), key: para };
    }
    if (para.startsWith("### ")) {
      return { type: "h3" as const, text: para.slice(4), key: para };
    }
    if (para.startsWith("- ")) {
      return { type: "li" as const, text: para.slice(2), key: para };
    }
    if (!para.trim()) {
      return { type: "br" as const, text: "", key: `br-${para}` };
    }
    return { type: "p" as const, text: para, key: para };
  });
}

export default function ArticlePage() {
  const { id } = useParams({ from: "/article/$id" });
  const navigate = useNavigate();
  const articleId = BigInt(id);

  const { data: article, isLoading, isError } = useArticle(articleId);
  const { data: isAdmin } = useIsAdmin();
  const pinMutation = usePinArticle();

  const handlePin = async () => {
    if (!article) return;
    try {
      await pinMutation.mutateAsync({
        id: article.id,
        isPinned: !article.isPinned,
      });
      toast.success(
        article.isPinned ? "Article unpinned" : "Article pinned as featured",
      );
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  if (isLoading) {
    return (
      <main className="container max-w-3xl py-10">
        <div data-ocid="article.loading_state" className="space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-10 w-3/5" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="container max-w-3xl py-10">
        <div data-ocid="article.error_state" className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-destructive/50 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">
            Article not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This article may have been removed or doesn't exist.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const color = getCategoryColor(article.category);
  const contentBlocks = renderContent(article.content);

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <Button
        data-ocid="article.back_button"
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/" })}
        className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full",
                color.bg,
                color.text,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", color.dot)} />
              {article.category}
            </span>
            {article.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Pin className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
            {isAdmin && (
              <Button
                data-ocid="article.pin_button"
                variant="outline"
                size="sm"
                onClick={handlePin}
                disabled={pinMutation.isPending}
                className="ml-auto gap-1.5"
              >
                {pinMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : article.isPinned ? (
                  <PinOff className="h-3.5 w-3.5" />
                ) : (
                  <Pin className="h-3.5 w-3.5" />
                )}
                {article.isPinned ? "Unpin" : "Pin as Featured"}
              </Button>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {article.authorName || "Anonymous"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(article.createdAt)}
            </span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="border-t border-border mb-8" />

        <div className="article-prose text-base leading-relaxed">
          {contentBlocks.map((block) => {
            if (block.type === "h2")
              return <h2 key={block.key}>{block.text}</h2>;
            if (block.type === "h3")
              return <h3 key={block.key}>{block.text}</h3>;
            if (block.type === "li")
              return <li key={block.key}>{block.text}</li>;
            if (block.type === "br") return <br key={block.key} />;
            return <p key={block.key}>{block.text}</p>;
          })}
        </div>
      </article>
    </main>
  );
}
