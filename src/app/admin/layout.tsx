import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdmin } from "@/lib/admin";
import { getAuthenticatedIdentity } from "@/lib/server-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) {
    const identity = await getAuthenticatedIdentity();
    redirect(identity.status === "authenticated" ? "/student/dashboard" : "/login?next=/admin/dashboard");
  }
  return <AdminShell profile={admin.profile}>{children}</AdminShell>;
}
