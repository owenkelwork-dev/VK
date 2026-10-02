import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Returns the logged-in user's profile (name), or sends them to the login page.
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", userId)
    .single();

  return profile ?? { id: userId, full_name: data.claims.email ?? "Unknown" };
}
