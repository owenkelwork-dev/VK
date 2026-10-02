import { getCurrentProfile } from "@/lib/auth";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="card">
      <h1 className="text-lg font-semibold">Welcome, {profile.full_name}!</h1>
      <p className="mt-1 text-sm text-slate-500">
        You&apos;re logged in. The dashboard will fill in as we build each feature.
      </p>
    </div>
  );
}
