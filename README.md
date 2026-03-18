<div align="center">

<img src="https://img.shields.io/badge/version-0.1.1-blue?style=flat-square" alt="version" />
<img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license" />
<img src="https://img.shields.io/badge/react-18%2B-61DAFB?style=flat-square&logo=react" alt="react" />
<img src="https://img.shields.io/badge/typescript-5.4%2B-3178C6?style=flat-square&logo=typescript" alt="typescript" />
<img src="https://img.shields.io/badge/tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="tailwind" />

<br />
<br />

```
  ██████╗  ██████╗ ███╗   ██╗
  ██╔══██╗██╔═══██╗████╗  ██║
  ██████╔╝██║   ██║██╔██╗ ██║
  ██╔══██╗██║   ██║██║╚██╗██║
  ██║  ██║╚██████╔╝██║ ╚████║
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
```

# Ron

**The Modern Headless Admin Framework**

Config in. Admin out. Code you own.

[Getting Started](#getting-started) · [Packages](#packages) · [CLI](#cli) · [Config](#adminconfigts) · [UI](#ronjs-ui) · [Roadmap](#roadmap)

</div>

---

## What is Ron?

Ron is a full-stack ecosystem for building internal tools and admin panels in React + TypeScript. It is designed around a single philosophy:

> **You write a config file. Ron generates a working admin panel. You own every file.**

Unlike runtime libraries that lock you in forever, Ron's CLI compiles your `admin.config.ts` into real, readable TypeScript files that live in your project. If Ron disappeared tomorrow, your project would still work.

```bash
npx @ronjs/cli init
```

```
✔ React + TypeScript detected
✔ Tailwind CSS detected
✔ Router detected: react-router

? Project name › Acme Admin
? Roles › super_admin, admin, editor, viewer
? Auth provider › Clerk

✔ admin.config.ts created
✔ src/admin/_generated/permission-matrix.ts
✔ src/admin/hooks/usePermission.ts
✔ src/admin/components/guards/ProtectedRoute.tsx
✔ src/admin/components/guards/Can.tsx
✔ src/admin/pages/DashboardPage.tsx
✔ @import "@ronjs/ui/css" added to index.css

  Ron is ready. 🎉
```

---

## Why Ron?

| | Ron | Refine | React Admin | Build yourself |
|---|---|---|---|---|
| **Generated code you own** | ✅ | ❌ | ❌ | ✅ |
| **TypeScript config** | ✅ | ❌ | ❌ | — |
| **No runtime lock-in** | ✅ | ❌ | ❌ | ✅ |
| **Permission system built-in** | ✅ | Partial | Partial | Manual |
| **Eject system** | ✅ | ❌ | ❌ | — |
| **Own design system** | ✅ | ❌ | ❌ | Manual |
| **Zero config styling** | ✅ | ❌ | ❌ | Manual |

---

## Packages

Ron is a monorepo with focused, composable packages:

| Package | Version | Description |
|---|---|---|
| [`@ronjs/core`](#ronjs-core) | ![npm](https://img.shields.io/npm/v/@ronjs/core?style=flat-square) | Type system, `defineConfig`, permission resolver |
| [`@ronjs/ui`](#ronjs-ui) | ![npm](https://img.shields.io/npm/v/@ronjs/ui?style=flat-square) | Component library + design system |
| [`@ronjs/cli`](#cli) | ![npm](https://img.shields.io/npm/v/@ronjs/cli?style=flat-square) | `init`, `sync`, `add`, `eject` commands |
| [`@ronjs/router`](#ronjs-router) | ![npm](https://img.shields.io/npm/v/@ronjs/router?style=flat-square) | File-based routing adapter *(coming soon)* |

---

## Getting Started

### Requirements

- Node.js 18+
- React 18+
- TypeScript 5.4+
- Tailwind CSS v4

### New project

```bash
npx @ronjs/cli init
```

Ron will scaffold a complete project from scratch — no Vite template needed.

### Add to existing project

```bash
cd my-existing-react-app
npx @ronjs/cli init
```

Ron detects your existing setup (router, auth provider, Tailwind) and only adds what's missing.

---

## `admin.config.ts`

The single source of truth for your entire admin panel. Ron reads this file and generates everything else.

```ts
import { defineConfig } from "@ronjs/core";

export default defineConfig({
  branding: {
    name: "Acme Admin",
    logo: "/logo.svg",
  },

  auth: {
    provider: "clerk",
    getCurrentUser: async () => {
      // Return { id, role, permissions } from your auth provider
      throw new Error("Implement getCurrentUser");
    },
  },

  // Roles are typed — TypeScript errors on invalid values everywhere
  roles: ["super_admin", "admin", "editor", "viewer"] as const,

  resources: {
    users: {
      permissions: {
        view:   ["super_admin", "admin"],
        create: ["super_admin", "admin"],
        edit:   ["super_admin", "admin"],
        delete: ["super_admin"],          // ← TypeScript enforces valid roles
      },
    },
    content: {
      permissions: {
        view:    ["super_admin", "admin", "editor", "viewer"],
        create:  ["super_admin", "admin", "editor"],
        publish: ["super_admin", "admin"],
        delete:  ["super_admin", "admin"],
      },
    },
  },

  navigation: [
    { label: "Dashboard", icon: "layout-dashboard", path: "/admin" },
    { label: "Users",     icon: "users",  path: "/admin/users",
      permission: "users:view" },          // ← typed against your resources
    { label: "Content",   icon: "file-text", path: "/admin/content",
      permission: "content:view" },
  ],
});
```

After editing the config, run:

```bash
ron sync
```

Ron regenerates `_generated/permission-matrix.ts` — a fully typed union of every permission string derived from your config.

```ts
// src/admin/_generated/permission-matrix.ts — AUTO-GENERATED
export const PERMISSION_MATRIX = {
  super_admin: ["users:view", "users:create", "users:edit", "users:delete",
                "content:view", "content:create", "content:publish", "content:delete"],
  admin:       ["users:view", "users:create", "users:edit",
                "content:view", "content:create", "content:publish", "content:delete"],
  editor:      ["content:view", "content:create", "content:publish"],
  viewer:      ["content:view"],
} as const;

export type Role       = keyof typeof PERMISSION_MATRIX;
export type Permission = typeof PERMISSION_MATRIX[Role][number];
// ↑ "users:view" | "users:create" | "content:view" | ...
```

TypeScript now knows every valid permission string in your app.

---

## CLI

### `ron init`

Scaffold a new project or add Ron to an existing one.

```bash
npx @ronjs/cli init
npx @ronjs/cli init --cwd ./my-project
```

**What it does:**
- Detects React, TypeScript, Tailwind, router, and auth provider
- Prompts for project name, roles, and auth
- Installs `@ronjs/core`, `@ronjs/ui`, and peer dependencies
- Scaffolds `admin.config.ts` with your settings
- Generates `src/admin/` — hooks, guards, layout, pages
- Patches `index.css` with `@import "@ronjs/ui/css"`

### `ron sync`

Re-reads `admin.config.ts` and regenerates `_generated/` files. Safe to run any time.

```bash
ron sync
```

```
✔ Config is valid
✔ Permission matrix resolved

  super_admin   users:view, users:create, users:edit, users:delete, content:view ...
  admin         users:view, users:create, users:edit, content:view ...
  editor        content:view, content:create, content:publish
  viewer        content:view

✔ _generated/permission-matrix.ts updated
✔ _generated/route-manifest.ts updated

  Sync complete. ✨
```

### `ron add` *(coming soon)*

Copy individual UI components into your project — shadcn-style.

```bash
ron add data-table
ron add form-builder
ron add stat-card
```

### `ron eject` *(coming soon)*

Eject a generated page into a plain React file you own completely.

```bash
ron eject list-page --resource products
# → generates src/admin/pages/products-list.tsx
# → installs required primitives
# → you now own the file, no black-box library logic
```

---

## `@ronjs/core`

The type system and permission resolver. Framework-agnostic — no React dependency.

```ts
import { defineConfig, resolvePermissions, validateConfig } from "@ronjs/core";
```

### `defineConfig(config)`

Provides full TypeScript inference. Roles flow through every nested type — permissions, navigation, and generated hooks.

```ts
// TypeScript catches this instantly:
permissions: {
  view: ["super_admin", "ghost_role"],  // ❌ Error: "ghost_role" not in roles
}

// Navigation permissions are typed too:
{ permission: "users:fly" }             // ❌ Error: not a defined permission
```

### `resolvePermissions(config)`

Builds the `role → permissions[]` map used by the CLI during `ron sync`.

### `validateConfig(config)`

Runtime validation — catches logical errors the type system can't (duplicate roles, orphaned nav permissions, etc.).

---

## `@ronjs/ui`

Ron's own component library and design system. No shadcn dependency, no daisyUI — built from scratch with Tailwind v4.

### Install styles

```css
/* index.css */
@import "tailwindcss";
@import "@ronjs/ui/css";
```

That's it. All Ron design tokens and component classes are available immediately.

### Dark mode

```html
<!-- Toggle dark mode with one attribute -->
<html data-ron-theme="dark">
```

### Components

| Component | Description |
|---|---|
| `<AdminLayout />` | Full admin shell — sidebar, topbar, mobile responsive |
| `<SideNav />` | Collapsible navigation with nested groups and badges |
| `<TopBar />` | Header with user menu, notifications, and action slots |
| `<DataTable />` | TanStack Table v8 — sort, filter, paginate, cell types |
| `<Can />` | Declarative permission gate |
| `<ProtectedRoute />` | Route-level guard with redirect |

### DataTable

```tsx
import { DataTable, type RonColumnDef } from "@ronjs/ui";

const columns: RonColumnDef<User>[] = [
  { accessorKey: "name",     header: "Name" },
  { accessorKey: "email",    header: "Email" },
  { accessorKey: "role",     header: "Role",   type: "badge",
    badgeColors: { Admin: "bg-purple-100 text-purple-700" } },
  { accessorKey: "status",   header: "Status", type: "badge",
    badgeColors: { active: "bg-green-100 text-green-700" } },
  { accessorKey: "salary",   header: "Salary", type: "currency" },
  { accessorKey: "joinedAt", header: "Joined", type: "date" },
  { accessorKey: "active",   header: "Active", type: "boolean" },
];

<DataTable
  data={users}
  columns={columns}
  searchable
  pageSize={10}
  onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
/>
```

**Built-in cell types:** `text` · `number` · `currency` · `date` · `badge` · `boolean`

### Permission Guards

```tsx
import { Can, ProtectedRoute } from "@ronjs/ui";

// Hide a button for unauthorized users
<Can permission="users:create">
  <button className="ron-btn ron-btn-primary">Invite User</button>
</Can>

// Show a disabled fallback instead
<Can
  permission="users:delete"
  fallback={<button disabled>Delete</button>}
>
  <button onClick={handleDelete}>Delete</button>
</Can>

// Require multiple permissions
<Can permission={["users:edit", "users:delete"]} requireAll>
  <DangerZone />
</Can>

// Route guard
<ProtectedRoute permission="users:view">
  <UsersPage />
</ProtectedRoute>
```

### Design System

Ron ships its own CSS design system via `@import "@ronjs/ui/css"`.

```css
/* Buttons */
.ron-btn .ron-btn-primary .ron-btn-secondary
.ron-btn-outline .ron-btn-ghost .ron-btn-danger
.ron-btn-sm .ron-btn-lg .ron-btn-icon

/* Badges */
.ron-badge .ron-badge-success .ron-badge-warning
.ron-badge-danger .ron-badge-info .ron-badge-default

/* Inputs */
.ron-input .ron-input-sm .ron-label .ron-field

/* Cards */
.ron-card .ron-card-header .ron-card-title
.ron-card-body .ron-card-footer

/* Stat Cards */
.ron-stat-card .ron-stat-label .ron-stat-value

/* Tables */
.ron-table-wrapper .ron-table .ron-table-footer
.ron-table-clickable

/* Sidebar */
.ron-sidebar .ron-sidebar-collapsed .ron-sidebar-header
.ron-sidebar-nav .ron-nav-item .ron-nav-item-active

/* Topbar */
.ron-topbar .ron-avatar .ron-dropdown
.ron-dropdown-item .ron-dropdown-item-danger
```

All styles are driven by CSS variables that you can override:

```css
:root {
  --ron-primary:       rgb(59 130 246);  /* your brand color */
  --ron-radius:        0.5rem;           /* border radius */
  --ron-sidebar-width: 16rem;            /* sidebar width */
  /* ... */
}
```

---

## Generated File Structure

After `ron init`, your project gets:

```
src/
└── admin/
    ├── _generated/              ← CLI owns this — re-runs on ron sync
    │   ├── permission-matrix.ts  typed Role + Permission unions
    │   └── route-manifest.ts     registered routes
    │
    ├── hooks/                   ← generated once, you own them
    │   ├── useAuth.ts
    │   ├── usePermission.ts
    │   └── useRole.ts
    │
    ├── components/
    │   └── guards/
    │       ├── ProtectedRoute.tsx
    │       └── Can.tsx
    │
    ├── pages/
    │   ├── _layout.tsx          AdminLayout wrapper
    │   ├── dashboard/
    │   │   └── index.tsx
    │   └── _403/
    │       └── index.tsx
    │
    └── index.tsx                router root

admin.config.ts                  ← you write this
```

**The `_generated/` folder** is the only part `ron sync` overwrites. Everything else is scaffolded once and belongs to you — edit freely.

---

## Hooks

Generated hooks are fully typed against your config after `ron sync`.

```ts
import { usePermission } from "@/admin/hooks/usePermission";
import { useRole }       from "@/admin/hooks/useRole";
import { useAuth }       from "@/admin/hooks/useAuth";

// Check a single permission
const canEdit = usePermission("users:edit");

// Check any of multiple permissions (OR)
const canManage = usePermission(["users:edit", "users:delete"]);

// Check all permissions (AND)
const canAll = usePermission(["users:edit", "users:delete"], true);

// Check role directly
const isSuperAdmin = useRole("super_admin");

// Access current user
const { user, isLoading } = useAuth();
```

---

## Permission Matrix

Full overview of what each role can do — generated from your `admin.config.ts`.

| Permission | super_admin | admin | editor | viewer |
|---|---|---|---|---|
| `users:view` | ✅ | ✅ | ❌ | ❌ |
| `users:create` | ✅ | ✅ | ❌ | ❌ |
| `users:edit` | ✅ | ✅ | ❌ | ❌ |
| `users:delete` | ✅ | ❌ | ❌ | ❌ |
| `content:view` | ✅ | ✅ | ✅ | ✅ |
| `content:create` | ✅ | ✅ | ✅ | ❌ |
| `content:publish` | ✅ | ✅ | ❌ | ❌ |
| `content:delete` | ✅ | ✅ | ❌ | ❌ |

---

## Roadmap

### ✅ Done
- `@ronjs/core` — type system, `defineConfig`, permission resolver
- `ron init` — full project scaffold + existing project detection
- `ron sync` — config → typed permission matrix
- `@ronjs/ui` — `DataTable`, `AdminLayout`, `SideNav`, `TopBar`, `Can`, `ProtectedRoute`
- Ron CSS design system with dark mode

### 🔨 In Progress
- `@ronjs/router` — file-based routing (`src/admin/pages/`)
- `ron add` — copy individual components into your project
- `ron eject` — eject generated pages to plain React files

### 📋 Planned
- `@ronjs/devtools` — role simulator, permission audit log, config inspector
- `ron add form-builder` — React Hook Form + Zod integration
- `ron add stat-card` — KPI widget
- Pro component library — Kanban, rich text editor, file manager
- Next.js / App Router adapter
- Web components (`@ronjs/elements`) for framework-agnostic use

---

## Philosophy

**Generated code you own.**
After `ron init`, the files in `src/admin/` are yours. Ron is a dev dependency, not a runtime dependency. Your production bundle has zero Ron code in it.

**TypeScript config is the interface.**
`admin.config.ts` uses TypeScript's type system to make invalid configs impossible to write. Wrong role name? TypeScript error. Invalid permission in navigation? TypeScript error. Before `ron sync` even runs.

**Eject anytime.**
Every component Ron generates can be ejected into a plain React file with `ron eject`. No magic, no internals, no black boxes. Just code you can read and edit.

**No runtime lock-in.**
Ron is not a framework you import at runtime. It is a code generator you run at development time. The output is standard React + TypeScript that works without Ron installed.

---

## Contributing

Ron is in active early development. Contributions, issues, and feedback are very welcome.

```bash
git clone https://github.com/MaHmOd518/ron
cd ron
pnpm install
pnpm build
```

### Monorepo structure

```
ron/
├── packages/
│   ├── core/     @ronjs/core
│   ├── ui/       @ronjs/ui
│   └── cli/      @ronjs/cli
├── apps/
│   └── docs/     documentation site (coming soon)
├── turbo.json
└── pnpm-workspace.yaml
```

### Development

```bash
# Build all packages
pnpm build

# Build a specific package
cd packages/core && pnpm build

# Watch mode
cd packages/ui && pnpm dev

# Type check
pnpm typecheck
```

---

## License

MIT © [mahmodjnead](https://github.com/mahmodjnead)

---

<div align="center">

Built with ❤️ by a solo developer.

<!-- If Ron saves you time, consider [sponsoring on GitHub](https://github.com/sponsors/mahmodjnead). -->

</div>
