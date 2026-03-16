// packages/cli/src/templates/pages.ts

export const rootLayoutTemplate = (
  projectName: string,
) => `import React                               from "react";
import { AdminLayout, type NavItemConfig } from "@ronjs/ui";
import { useRonLocation, useRonNavigate,
         useRonBack }                      from "@ronjs/router";
import { LayoutDashboard, ChevronLeft }    from "lucide-react";

const navItems: NavItemConfig[] = [
  {
    label: "Dashboard",
    icon:  <LayoutDashboard className="h-4 w-4" />,
    path:  "/admin/dashboard",
  },
  // Add more nav items as you add resources
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { path }      = useRonLocation();
  const { push }      = useRonNavigate();
  const { back,
          canGoBack } = useRonBack();

  return (
    <AdminLayout
      navItems={navItems}
      currentPath={path}
      onNavigate={push}
      branding={{ name: "${projectName}" }}
      topBarActions={
        canGoBack ? (
          <button onClick={back} className="ron-btn ron-btn-ghost ron-btn-sm">
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        ) : undefined
      }
    >
      {children}
    </AdminLayout>
  );
}
`;

export const dashboardPageTemplate = (
  projectName: string,
) => `export default function DashboardPage() {
  return (
    <div>
      <h1 style={{
        color:        "var(--ron-text)",
        fontSize:     "1.5rem",
        fontWeight:   700,
        marginBottom: "0.5rem",
      }}>
        Dashboard
      </h1>
      <p style={{ color: "var(--ron-text-secondary)" }}>
        Welcome to ${projectName}. Edit this page at{" "}
        <code>src/admin/pages/dashboard/index.tsx</code>
      </p>
    </div>
  );
}
`;

export const notFoundPageTemplate =
  () => `export default function ForbiddenPage() {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "60vh",
      gap:            "0.75rem",
    }}>
      <h1 style={{
        fontSize:   "4rem",
        fontWeight: 700,
        color:      "var(--ron-text-muted)",
        lineHeight: 1,
      }}>
        403
      </h1>
      <p style={{ color: "var(--ron-text-secondary)", fontSize: "1rem" }}>
        You don't have permission to access this page.
      </p>
    </div>
  );
}
`;

// Full template — includes sample pages
export const sampleUsersPageTemplate =
  () => `import { DataTable, Can, type RonColumnDef } from "@ronjs/ui";

export const permission = "users:view";

interface User {
  id:     number;
  name:   string;
  email:  string;
  role:   string;
  status: string;
}

const data: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@acme.com", role: "Admin",  status: "active"   },
  { id: 2, name: "Bob Smith",     email: "bob@acme.com",   role: "Editor", status: "inactive" },
  { id: 3, name: "Carol White",   email: "carol@acme.com", role: "Viewer", status: "active"   },
];

const columns: RonColumnDef<User>[] = [
  { accessorKey: "name",   header: "Name"   },
  { accessorKey: "email",  header: "Email"  },
  { accessorKey: "role",   header: "Role",   type: "badge" },
  { accessorKey: "status", header: "Status", type: "badge",
    badgeColors: {
      active:   "bg-green-100 text-green-700",
      inactive: "bg-red-100 text-red-600",
    }
  },
];

export default function UsersPage() {
  return (
    <div>
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        marginBottom:   "1.5rem",
      }}>
        <h1 style={{
          color:      "var(--ron-text)",
          fontSize:   "1.5rem",
          fontWeight: 700,
        }}>
          Users
        </h1>
        <Can permission="users:create">
          <button className="ron-btn ron-btn-primary">
            + Invite User
          </button>
        </Can>
      </div>
      <DataTable data={data} columns={columns} searchable />
    </div>
  );
}
`;
