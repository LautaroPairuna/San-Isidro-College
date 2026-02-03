import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function adminGuard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
