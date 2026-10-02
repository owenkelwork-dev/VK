import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase connection used on the server (pages and form actions).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a page render, where cookies can't be written.
            // The proxy refreshes the session on every request, so this is safe to ignore.
          }
        },
      },
    },
  );
}
