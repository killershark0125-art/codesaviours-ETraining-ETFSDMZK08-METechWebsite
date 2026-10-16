import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider, useRouter } from "./router";
import SiteLayout from "./components/SiteLayout";
import {
  AboutPage,
  BlogDetailPage,
  BlogPage,
  CourseDetailPage,
  EVChargingPage,
  HomePage,
  LeadFormPage,
  NotFoundPage,
  ProjectDetailPage,
  ProjectsPage,
  ServiceDetailPage,
  ServicesPage,
  TrainingPage,
} from "./pages/PublicPages";
import {
  AdminContentPage,
  AdminDashboardPage,
  AdminInboxPage,
  AdminLoginPage,
  ProtectedAdmin,
} from "./pages/AdminPages";

function AppRoutes() {
  const { path } = useRouter();
  const pathname = path.split("?")[0].replace(/\/$/, "") || "/";
  useEffect(() => {
    const titles = {
      "/": "Engineering for a Better Tomorrow",
      "/about": "About",
      "/services": "Services",
      "/ev-charging": "EV Charging",
      "/training": "Training",
      "/projects": "Projects & Case Studies",
      "/blog": "Journal",
      "/contact": "Contact",
      "/quote": "Get a Quote",
      "/admin/login": "Admin Login",
    };
    const section = pathname.split("/").filter(Boolean)[0];
    const title =
      titles[pathname] ||
      (section === "training"
        ? "Training Program"
        : section === "projects"
          ? "Project Details"
          : section === "blog"
            ? "Journal Article"
            : section === "services"
              ? "Service Details"
              : "Page");
    document.title = `${title} | ME Technologies`;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content =
      "ME Technologies provides engineering consultancy, renewable energy, EV charging, building design, and technical training in Pakistan.";
  }, [pathname]);
  let page;
  let isAdmin =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin";

  if (pathname === "/admin/login") page = <AdminLoginPage />;
  else if (pathname === "/admin")
    page = (
      <ProtectedAdmin>
        <AdminDashboardPage />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/leads")
    page = (
      <ProtectedAdmin>
        <AdminInboxPage kind="leads" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/enrollments")
    page = (
      <ProtectedAdmin>
        <AdminInboxPage kind="enrollments" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/services")
    page = (
      <ProtectedAdmin>
        <AdminContentPage kind="services" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/courses")
    page = (
      <ProtectedAdmin>
        <AdminContentPage kind="courses" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/batches")
    page = (
      <ProtectedAdmin>
        <AdminContentPage kind="batches" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/projects")
    page = (
      <ProtectedAdmin>
        <AdminContentPage kind="projects" />
      </ProtectedAdmin>
    );
  else if (pathname === "/admin/posts")
    page = (
      <ProtectedAdmin>
        <AdminContentPage kind="posts" />
      </ProtectedAdmin>
    );
  else if (pathname === "/") page = <HomePage />;
  else if (pathname === "/about") page = <AboutPage />;
  else if (pathname === "/services") page = <ServicesPage />;
  else if (pathname.startsWith("/services/"))
    page = <ServiceDetailPage slug={pathname.slice("/services/".length)} />;
  else if (pathname === "/ev-charging") page = <EVChargingPage />;
  else if (pathname === "/training") page = <TrainingPage />;
  else if (pathname.startsWith("/training/"))
    page = <CourseDetailPage slug={pathname.slice("/training/".length)} />;
  else if (pathname === "/projects") page = <ProjectsPage />;
  else if (pathname.startsWith("/projects/"))
    page = <ProjectDetailPage slug={pathname.slice("/projects/".length)} />;
  else if (pathname === "/blog") page = <BlogPage />;
  else if (pathname.startsWith("/blog/"))
    page = <BlogDetailPage slug={pathname.slice("/blog/".length)} />;
  else if (pathname === "/contact") page = <LeadFormPage source="contact" />;
  else if (pathname === "/quote") page = <LeadFormPage source="quote" />;
  else page = <NotFoundPage />;

  if (isAdmin)
    return (
      <div key={pathname} className="route-enter">
        {page}
      </div>
    );
  return (
    <SiteLayout>
      <div key={pathname} className="route-enter">
        {page}
      </div>
    </SiteLayout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </RouterProvider>
  );
}
