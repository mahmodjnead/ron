// src/runtime/RonLayout.tsx
import React, { Suspense } from "react";

interface RonLayoutProps {
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  children: React.ReactNode;
}

export function RonLayout({ layout: Layout, children }: RonLayoutProps) {
  if (!Layout) return <>{children}</>;

  return (
    <Suspense fallback={null}>
      <Layout>{children}</Layout>
    </Suspense>
  );
}
