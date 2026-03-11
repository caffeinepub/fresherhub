import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-secondary/50 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <BookOpen className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">FresherHub</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {year} Sathya. Built with{" "}
            <Heart className="inline h-3 w-3 text-destructive fill-current" />{" "}
            using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
