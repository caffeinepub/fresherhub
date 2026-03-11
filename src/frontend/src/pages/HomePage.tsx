import { ArticleCard } from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArticles,
  useCategories,
  useSearchArticles,
} from "@/hooks/useQueries";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const SAMPLE_ARTICLES = [
  {
    id: 1n,
    title: "How to Ace Your First Technical Interview",
    content:
      "Landing your first tech job can feel daunting. In this guide, we'll walk you through exactly how to prepare for technical interviews — from data structures and algorithms to system design basics. Start with the fundamentals: arrays, linked lists, trees, and graphs. Practice on LeetCode easy problems first before advancing.",
    category: "Interview",
    tags: ["interview", "coding"],
    isPinned: true,
    authorName: "Senior Engineer",
    createdAt: BigInt(Date.now() - 2 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 2 * 86400 * 1000) * 1_000_000n,
  },
  {
    id: 2n,
    title: "Git Workflow Every Developer Should Know",
    content:
      "Version control is the backbone of modern software development. Understanding git branching strategies — like Git Flow and trunk-based development — will make you a much more effective team member from day one. Learn branching, merging, rebasing, and pull request best practices.",
    category: "Engineering",
    tags: ["git", "workflow"],
    isPinned: true,
    authorName: "DevOps Lead",
    createdAt: BigInt(Date.now() - 5 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 5 * 86400 * 1000) * 1_000_000n,
  },
  {
    id: 3n,
    title: "Building a Strong LinkedIn Profile as a Fresher",
    content:
      "Your LinkedIn profile is often the first impression recruiters get of you. We'll cover how to write a compelling headline, craft your about section, showcase projects from college, and reach out to professionals for informational interviews. Optimize your profile for searchability and recruiters.",
    category: "Career",
    tags: ["linkedin", "networking"],
    isPinned: false,
    authorName: "HR Manager",
    createdAt: BigInt(Date.now() - 7 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 7 * 86400 * 1000) * 1_000_000n,
  },
  {
    id: 4n,
    title: "VS Code Extensions That 10x Your Productivity",
    content:
      "The right tools can dramatically speed up your development workflow. From Prettier for auto-formatting to GitLens for blame annotations to REST Client for API testing — these VS Code extensions are must-haves for any developer starting their career in software engineering.",
    category: "Tools",
    tags: ["vscode", "productivity"],
    isPinned: false,
    authorName: "Frontend Engineer",
    createdAt: BigInt(Date.now() - 10 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 10 * 86400 * 1000) * 1_000_000n,
  },
  {
    id: 5n,
    title: "How to Give and Receive Feedback Professionally",
    content:
      "Soft skills are just as critical as technical ones in a professional environment. Giving constructive feedback without sounding critical, and receiving feedback with an open mind are skills that set great engineers apart. Learn frameworks like SBI (Situation-Behavior-Impact) for effective communication.",
    category: "Soft Skills",
    tags: ["communication", "feedback"],
    isPinned: false,
    authorName: "Engineering Manager",
    createdAt: BigInt(Date.now() - 14 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 14 * 86400 * 1000) * 1_000_000n,
  },
  {
    id: 6n,
    title: "Understanding REST APIs: A Practical Guide",
    content:
      "REST APIs are the backbone of modern web applications. This guide covers HTTP methods (GET, POST, PUT, DELETE), status codes, authentication with JWT tokens, and how to test APIs with tools like Postman. After reading this, you'll confidently build and consume REST services.",
    category: "Engineering",
    tags: ["api", "rest", "backend"],
    isPinned: false,
    authorName: "Backend Engineer",
    createdAt: BigInt(Date.now() - 18 * 86400 * 1000) * 1_000_000n,
    updatedAt: BigInt(Date.now() - 18 * 86400 * 1000) * 1_000_000n,
  },
];

const ALL_CATEGORIES = [
  "All",
  "Engineering",
  "Interview",
  "Career",
  "Tools",
  "Soft Skills",
  "Design",
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: articlesData, isLoading } = useArticles(
    activeCategory !== "All" ? activeCategory : undefined,
  );
  const { data: searchData, isLoading: isSearching } =
    useSearchArticles(debouncedSearch);
  const { data: categoriesData } = useCategories();

  const articles = debouncedSearch
    ? (searchData ?? [])
    : (articlesData ?? SAMPLE_ARTICLES);

  const pinnedArticles = articles.filter((a) => a.isPinned);
  const regularArticles = articles.filter((a) => !a.isPinned);

  const categoryList = [
    "All",
    ...(categoriesData?.map(([cat]) => cat) ?? ALL_CATEGORIES.slice(1)),
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/assets/generated/fresherhub-hero.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        </div>
        <div className="container relative py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Knowledge Base for Freshers
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Everything you need to{" "}
              <span className="text-primary">kickstart your career</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Curated guides, tips, and resources to help freshers navigate
              their first steps in the tech industry.
            </p>
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="home.search_input"
                type="search"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 text-base bg-card border-border"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container py-10">
        {/* Category tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none"
          data-ocid="home.category.tab"
        >
          {categoryList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinned / Featured */}
        {!debouncedSearch && pinnedArticles.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Featured Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedArticles.map((article, i) => (
                <ArticleCard
                  key={article.id.toString()}
                  article={article}
                  index={i + 1}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {/* All articles */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">
              {debouncedSearch
                ? `Search results for "${debouncedSearch}"`
                : "All Articles"}
            </h2>
            {articles.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {articles.length} article{articles.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading || isSearching ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="home.articles.list"
            >
              {SKELETON_KEYS.map((key) => (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div
              data-ocid="home.articles.empty_state"
              className="text-center py-16"
            >
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                No articles found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {debouncedSearch
                  ? "Try a different search term"
                  : "Check back soon for new content"}
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="home.articles.list"
            >
              {(debouncedSearch ? articles : regularArticles).map(
                (article, i) => (
                  <motion.div
                    key={article.id.toString()}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <ArticleCard article={article} index={i + 1} />
                  </motion.div>
                ),
              )}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
