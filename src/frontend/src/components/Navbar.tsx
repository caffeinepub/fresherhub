import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LogIn, LogOut, Settings, User } from "lucide-react";

export function Navbar() {
  const { login, clear, identity, isLoggingIn, loginStatus } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          data-ocid="nav.home_link"
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Fresher<span className="text-primary">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {isAdmin && (
            <Link to="/admin" data-ocid="nav.admin_link">
              <Button
                variant={currentPath.startsWith("/admin") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">
                  {identity.getPrincipal().toString().slice(0, 8)}…
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login_button"
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoggingIn ? "Signing in…" : "Sign in"}</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
