import type { Metadata } from "next";
import AdminApp from "./admin-app";

export const metadata: Metadata = { title: "Rise Academy admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <AdminApp />;
}
