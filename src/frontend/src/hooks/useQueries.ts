import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../backend";
import { useActor } from "./useActor";

export function useArticles(category?: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles", category ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles(category ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticle(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Article>({
    queryKey: ["article", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchArticles(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchArticles(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      category: string;
      tags: string[];
      authorName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.createArticle(
        data.title,
        data.content,
        data.category,
        data.tags,
        data.authorName,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
      category: string;
      tags: string[];
      authorName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateArticle(
        data.id,
        data.title,
        data.content,
        data.category,
        data.tags,
        data.authorName,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({
        queryKey: ["article", vars.id.toString()],
      });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function usePinArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: bigint; isPinned: boolean }) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.pinArticle(id, isPinned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
