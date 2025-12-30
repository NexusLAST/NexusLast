import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { DemoBanner } from "@/components/ui/demo-banner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DemoBanner />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
