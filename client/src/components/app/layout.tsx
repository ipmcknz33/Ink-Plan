import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}