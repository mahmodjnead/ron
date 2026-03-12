This is the master blueprint for **Ron**. I have organized this into a comprehensive `DEVELOPER_SPEC.md` file. It covers the architecture, package breakdown, and the unique "Eject" philosophy that differentiates Ron from Refine.

---

# `RON_ECOSYSTEM.md`

# ⚡ Ron: The Modern Headless Admin Framework

> **Logic of Refine. Beauty of shadcn/ui. Power of Tailwind.**

Ron is a full-stack ecosystem for building internal tools and admin panels. It is designed to be **ready-to-use** while maintaining the flexibility of a custom-built application.

---

## 🏗 1. Ecosystem Architecture

Ron is built as a **Monorepo** to ensure strict separation between logic, UI components, and routing adapters.

### The Package Map

| Package | Name | Responsibility |
| --- | --- | --- |
| **`@ron/core`** | The Brain | State management, TanStack Query hooks (`useTable`, `useForm`), and Data Provider interfaces. |
| **`@ron/components`** | The Atoms | Specialized shadcn-based inputs (e.g., **Phone Input**, File Uploaders, Rich Text). |
| **`@ron/ui`** | The Pages | Ready-to-use full pages: `RonListPage`, `RonEditPage`, `RonDashboard`. |
| **`@ron/router`** | The Bridge | Adapters for **Next.js (Pages/App)** and **React Router**. |
| **`@ron/cli`** | The Tool | Scaffolding, `npx ron add`, and `npx ron eject`. |

---

## 🧩 2. Component Deep Dive

### `@ron/components` (Smart Inputs)

These are individual UI units that solve complex input problems while staying 100% Tailwind-compatible.

* **`RonPhoneInput`**: Integrated country code picker with search, using `react-phone-number-input` and shadcn Popovers.
* **`RonDataTable`**: A wrapper around TanStack Table v8 with built-in shadcn pagination and skeleton loaders.

### `@ron/ui` (Ready-to-Use Pages)

The primary feature of Ron. Instead of building pages, you *configure* them.

```tsx
// Example: products/index.tsx
import { RonListPage } from "@ron/ui";

export const Products = () => (
  <RonListPage 
    resource="products"
    columns={[
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "price", header: "Price", type: "currency" },
      { accessorKey: "phone", header: "Support", type: "phone" } // Auto-uses RonPhoneInput
    ]}
  />
);

```

---

## 🛣 3. Routing Strategy

Ron is **Router Agnostic**. It uses a specialized `useNavigation` hook that detects the environment.

### Support Matrix

* **Next.js (Pages Router):** Uses `next/router`.
* **Next.js (App Router):** Uses `next/navigation` (Client Components).
* **React Router:** Uses `react-router-dom` v6+.

---

## 🛠 4. The "Ron CLI" & Eject System

This is the "Secret Sauce." If a developer finds a "Ready-to-use" page too restrictive, they can "eject" it.

```bash
# Example Command
npx ron eject list-page --resource products

```

**What happens?**

1. Ron reads the internal `RonListPage` source code.
2. It generates a local `products-list.tsx` file in the user's project.
3. It installs the necessary shadcn primitives (`@/components/ui/table`, etc.).
4. **Result:** The developer now has a standard React file they can edit manually, with no "black box" library logic.

---

## 🎨 5. Theming & Styling

Ron does not use a theme engine like Emotion or Styled Components. It relies entirely on **CSS Variables** defined in a Tailwind configuration.

```css
/* The Ron Design System */
:root {
  --ron-primary: 221.2 83.2% 53.3%;
  --ron-background: 0 0% 100%;
  --ron-card: 0 0% 98%;
}

```

---

## 📋 6. Technical Stack

* **Framework:** React 18/19
* **State/Caching:** TanStack Query (React Query)
* **Styling:** Tailwind CSS
* **UI Primitives:** Radix UI (via shadcn/ui)
* **Forms:** React Hook Form + Zod
* **Icons:** Lucide React

---

## 📅 7. Development Roadmap

### Phase 1: Foundations

* [ ] Core Data Provider interface.
* [ ] Basic `useTable` and `useForm` hooks.
* [ ] Tailwind/shadcn base theme.

### Phase 2: Input Library (`@ron/components`)

* [ ] **Phone Input with Country Code.**
* [ ] Advanced Date Range Picker.
* [ ] JSON Schema form generator.

### Phase 3: Page Templates (`@ron/ui`)

* [ ] Default Admin Dashboard Layout (Sidebar/Navbar).
* [ ] List, Create, Edit, and Show page templates.

### Phase 4: CLI & Distribution

* [ ] Scaffolding command (`npx ron init`).
* [ ] Eject functionality for all `@ron/ui` components.