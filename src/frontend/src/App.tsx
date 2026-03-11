import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import { CreateArticlePage, EditArticlePage } from "@/pages/ArticleFormPage";
import ArticlePage from "@/pages/ArticlePage";
import HomePage from "@/pages/HomePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$id",
  component: ArticlePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/new",
  component: CreateArticlePage,
});

const adminEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/edit/$id",
  component: EditArticlePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  articleRoute,
  adminRoute,
  adminNewRoute,
  adminEditRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
