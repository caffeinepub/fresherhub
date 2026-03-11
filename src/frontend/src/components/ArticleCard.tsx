import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "@/lib/categoryColors";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Clock, Pin } from "lucide-react";
import type { Article } from "../backend";

interface ArticleCardProps {
  article: Article;
  index?: number;
  featured?: boolean;
}

function timeAgo(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({
  article,
  index = 1,
  featured = false,
}: ArticleCardProps) {
  const color = getCategoryColor(article.category);

  return (
    <Link
      to="/article/$id"
      params={{ id: article.id.toString() }}
      data-ocid={`home.article.item.${index}`}
      className={cn(
        "group block rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden hover:-translate-y-0.5",
        featured && "md:col-span-2",
      )}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
              color.bg,
              color.text,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
            {article.category || "General"}
          </span>
          {article.isPinned && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Pin className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-display font-bold text-card-foreground group-hover:text-primary transition-colors mb-2 leading-snug",
            featured ? "text-xl" : "text-base",
          )}
        >
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
          {article.content.replace(/[#*`]/g, "").slice(0, 180)}
          {article.content.length > 180 ? "…" : ""}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo(article.createdAt)}</span>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-1">
              {article.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
