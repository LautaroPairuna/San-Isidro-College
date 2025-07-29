// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/admin/auth");
  // tras login → la primera tabla:
  return redirect("/admin/resources/GrupoMedios");
}
