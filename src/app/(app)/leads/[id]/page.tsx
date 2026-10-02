import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StageBadge } from "@/components/stage-badge";
import { dateTime, money, shortDate } from "@/lib/format";
import type { Lead } from "@/lib/types";

export default async function LeadPage({ params }: PageProps<"/leads/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*, creator:profiles!leads_created_by_fkey(full_name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const lead = data as Lead & { creator: { full_name: string } | null };

  const fullAddress = [lead.property_address, lead.city, [lead.state, lead.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Link href="/leads" className="text-sm text-slate-500 hover:underline">← All leads</Link>

      {/* Header */}
      <div className="card space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold break-words">{lead.seller_name}</h1>
            <p className="text-sm break-words text-slate-500">{fullAddress || "No address yet"}</p>
          </div>
          <Link href={`/leads/${lead.id}/edit`} className="btn-secondary shrink-0">Edit</Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StageBadge stage={lead.stage} />
          <span className="text-slate-500">
            Next follow-up: <span className="font-medium text-slate-900">{shortDate(lead.next_follow_up_date)}</span>
          </span>
        </div>

        {/* Quick actions — big buttons for thumbs */}
        <div className="grid grid-cols-4 gap-2">
          <QuickAction href={lead.phone ? `tel:${lead.phone}` : undefined} label="Call" />
          <QuickAction href={lead.phone ? `sms:${lead.phone}` : undefined} label="Text" />
          <QuickAction href={lead.email ? `mailto:${lead.email}` : undefined} label="Email" />
          <QuickAction
            href={fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : undefined}
            label="Map"
            external
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Seller">
          <Info label="Name" value={lead.seller_name} />
          <Info label="Phone" value={lead.phone} />
          <Info label="Email" value={lead.email} />
        </InfoCard>

        <InfoCard title="Property">
          <Info label="Address" value={fullAddress} />
          <Info label="Type" value={lead.property_type} />
          <Info label="Condition" value={lead.property_condition} />
          <Info label="Occupancy" value={lead.occupancy} />
          <Info label="Asking price" value={lead.asking_price !== null ? money(lead.asking_price) : null} />
        </InfoCard>

        <InfoCard title="Lead details">
          <Info label="Lead source" value={lead.lead_source} />
          <Info label="Timeline" value={lead.timeline} />
          <Info label="Motivation" value={lead.motivation} />
          <Info label="Added" value={`${dateTime(lead.created_at)}${lead.creator ? ` by ${lead.creator.full_name}` : ""}`} />
        </InfoCard>

        <InfoCard title="Notes">
          <p className="text-sm whitespace-pre-wrap text-slate-700">{lead.notes || "No notes yet."}</p>
        </InfoCard>
      </div>
    </div>
  );
}

function QuickAction({ href, label, external }: { href?: string; label: string; external?: boolean }) {
  const className = "flex h-11 items-center justify-center rounded-md text-sm font-medium";
  if (!href) {
    return <span className={`${className} bg-slate-100 text-slate-400`}>{label}</span>;
  }
  return (
    <a
      href={href}
      className={`${className} bg-blue-50 text-blue-700 hover:bg-blue-100`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <dl className="space-y-2">{children}</dl>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="break-words">{value || "—"}</dd>
    </div>
  );
}
