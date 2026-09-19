"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ className = "account-logout" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return <button className={className} type="button" disabled={loading} onClick={async () => {
    setLoading(true);
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }}>{loading ? "Signing out…" : "Logout"}</button>;
}
