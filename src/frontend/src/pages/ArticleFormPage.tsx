import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useArticle,
  useCreateArticle,
  usePinArticle,
  useUpdateArticle,
} from "@/hooks/useQueries";
import { CATEGORY_OPTIONS } from "@/lib/categoryColors";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormState {
  title: string;
  content: string;
  category: string;
  tags: string;
  isPinned: boolean;
}

function ArticleFormInner({ editId }: { editId?: bigint }) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const pinMutation = usePinArticle();

  const { data: existingArticle, isLoading } = useArticle(editId ?? 0n);

  const [form, setForm] = useState<FormState>({
    title: "",
    content: "",
    category: "General",
    tags: "",
    isPinned: false,
  });

  useEffect(() => {
    if (existingArticle && editId) {
      setForm({
        title: existingArticle.title,
        content: existingArticle.content,
        category: existingArticle.category || "General",
        tags: existingArticle.tags.join(", "),
        isPinned: existingArticle.isPinned,
      });
    }
  }, [existingArticle, editId]);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    pinMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const authorName =
      identity?.getPrincipal().toString().slice(0, 8) ?? "Admin";

    try {
      if (editId && existingArticle) {
        await updateMutation.mutateAsync({
          id: editId,
          title: form.title,
          content: form.content,
          category: form.category,
          tags,
          authorName,
        });
        if (form.isPinned !== existingArticle.isPinned) {
          await pinMutation.mutateAsync({
            id: editId,
            isPinned: form.isPinned,
          });
        }
        toast.success("Article updated!");
      } else {
        await createMutation.mutateAsync({
          title: form.title,
          content: form.content,
          category: form.category,
          tags,
          authorName,
        });
        toast.success("Article published!");
      }
      navigate({ to: "/admin" });
    } catch {
      toast.error("Failed to save article");
    }
  };

  if (editId && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">
          Title *
        </Label>
        <Input
          id="title"
          data-ocid="article_form.title_input"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="e.g. How to Ace Your First Technical Interview"
          className="text-base h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-semibold">
          Category *
        </Label>
        <Select
          value={form.category}
          onValueChange={(val) =>
            setForm((prev) => ({ ...prev, category: val }))
          }
        >
          <SelectTrigger
            data-ocid="article_form.category_select"
            className="h-11"
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-semibold">
          Content *
        </Label>
        <p className="text-xs text-muted-foreground">
          Supports basic markdown: ## for headings, - for lists, **bold**
        </p>
        <Textarea
          id="content"
          data-ocid="article_form.content_textarea"
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Write your article content here…"
          className="min-h-[320px] text-sm font-mono leading-relaxed resize-y"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-semibold">
          Tags
        </Label>
        <Input
          id="tags"
          data-ocid="article_form.tags_input"
          value={form.tags}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="e.g. interview, coding, tips (comma separated)"
          className="h-11"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
        <div>
          <Label htmlFor="pinned" className="text-sm font-semibold">
            Feature this article
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pinned articles appear at the top of the homepage
          </p>
        </div>
        <Switch
          id="pinned"
          data-ocid="article_form.pinned_toggle"
          checked={form.isPinned}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, isPinned: checked }))
          }
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          data-ocid="article_form.submit_button"
          disabled={isSubmitting}
          className="gap-2 flex-1 sm:flex-none"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSubmitting
            ? "Saving…"
            : editId
              ? "Update Article"
              : "Publish Article"}
        </Button>
        <Button
          type="button"
          data-ocid="article_form.cancel_button"
          variant="outline"
          onClick={() => navigate({ to: "/admin" })}
          className="gap-2"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function CreateArticlePage() {
  const navigate = useNavigate();
  return (
    <main className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/admin" })}
        className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Button>
      <h1 className="font-display text-3xl font-extrabold mb-8">
        Create New Article
      </h1>
      <ArticleFormInner />
    </main>
  );
}

export function EditArticlePage() {
  const { id } = useParams({ from: "/admin/edit/$id" });
  const navigate = useNavigate();
  const editId = BigInt(id);

  return (
    <main className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/admin" })}
        className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Button>
      <h1 className="font-display text-3xl font-extrabold mb-8">
        Edit Article
      </h1>
      <ArticleFormInner editId={editId} />
    </main>
  );
}
