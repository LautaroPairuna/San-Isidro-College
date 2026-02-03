// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/admin/auth");
  
  return <AdminDashboard />;
}
