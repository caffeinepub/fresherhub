import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Article {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    tags: Array<string>;
    authorName: string;
    updatedAt: bigint;
    category: string;
    isPinned: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(title: string, content: string, category: string, tags: Array<string>, authorName: string): Promise<void>;
    deleteArticle(id: bigint): Promise<void>;
    getArticle(id: bigint): Promise<Article>;
    getArticles(category: string | null): Promise<Array<Article>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<[string, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    pinArticle(id: bigint, isPinned: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchArticles(keyword: string): Promise<Array<Article>>;
    updateArticle(id: bigint, title: string, content: string, category: string, tags: Array<string>, authorName: string): Promise<void>;
}
