import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArticles,
  useDeleteArticle,
  useIsAdmin,
  usePinArticle,
} from "@/hooks/useQueries";
import { getCategoryColor } from "@/lib/categoryColors";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Edit,
  Loader2,
  Pin,
  PinOff,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const { data: articles, isLoading } = useArticles();
  const deleteMutation = useDeleteArticle();
  const pinMutation = usePinArticle();

  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  if (isCheckingAdmin) {
    return (
      <main className="container py-10">
        <div data-ocid="admin.loading_state" className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container py-10">
        <div data-ocid="admin.error_state" className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-destructive/50 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => navigate({ to: "/" })} variant="outline">
            Back to Home
          </Button>
        </div>
      </main>
    );
  }

  const handleDelete = async () => {
    if (deleteTarget == null) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast.success("Article deleted");
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePin = async (id: bigint, isPinned: boolean) => {
    try {
      await pinMutation.mutateAsync({ id, isPinned: !isPinned });
      toast.success(
        isPinned ? "Article unpinned" : "Article pinned as featured",
      );
    } catch {
      toast.error("Failed to update pin");
    }
  };

  return (
    <main className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage articles and content for FresherHub
          </p>
        </div>
        <Link to="/admin/new">
          <Button data-ocid="admin.create_button" className="gap-2">
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !articles || articles.length === 0 ? (
        <div
          data-ocid="admin.articles.empty_state"
          className="text-center py-16 border border-dashed border-border rounded-xl"
        >
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No articles yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first article to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article, idx) => {
            const color = getCategoryColor(article.category);
            const ocidIdx = idx + 1;
            return (
              <div
                key={article.id.toString()}
                data-ocid={`admin.article.row.${ocidIdx}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <span
                  className={cn(
                    "hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                    color.bg,
                    color.text,
                  )}
                >
                  {article.category || "General"}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {article.authorName} ·{" "}
                    {new Date(
                      Number(article.createdAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>

                {article.isPinned && (
                  <Badge
                    variant="outline"
                    className="hidden md:flex text-amber-700 border-amber-300 bg-amber-50 gap-1"
                  >
                    <Pin className="h-3 w-3" /> Featured
                  </Badge>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePin(article.id, article.isPinned)}
                    disabled={pinMutation.isPending}
                    title={article.isPinned ? "Unpin" : "Pin as Featured"}
                  >
                    {article.isPinned ? (
                      <PinOff className="h-4 w-4" />
                    ) : (
                      <Pin className="h-4 w-4" />
                    )}
                  </Button>
                  <Link
                    to="/admin/edit/$id"
                    params={{ id: article.id.toString() }}
                  >
                    <Button
                      data-ocid={`admin.article.edit_button.${ocidIdx}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    data-ocid={`admin.article.delete_button.${ocidIdx}`}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="admin.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
