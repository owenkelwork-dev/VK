import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/app/login/actions";
import { NavLinks } from "./nav-links";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
          <span className="font-semibold">VK Home Solutions</span>
          <NavLinks />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-slate-500">{profile.full_name}</span>
            <form action={signOut}>
              <button className="text-slate-500 underline hover:text-slate-900">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
