import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StageBadge } from "@/components/stage-badge";
import { money, shortDate } from "@/lib/format";
import type { Lead } from "@/lib/types";
import { LeadFilters } from "./lead-filters";

export default async function LeadsPage({ searchParams }: PageProps<"/leads">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const stage = typeof params.stage === "string" ? params.stage : "";

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (stage) query = query.eq("stage", stage);
  if (q) {
    // Remove characters that have special meaning in the search syntax.
    const term = q.replace(/[%,()*\\]/g, " ");
    query = query.or(
      ["seller_name", "property_address", "city", "zip", "phone", "email"]
        .map((col) => `${col}.ilike.%${term}%`)
        .join(","),
    );
  }

  const { data, error } = await query;
  const leads = (data ?? []) as Lead[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Leads</h1>
        <Link href="/leads/new" className="btn">+ Add lead</Link>
      </div>

      <LeadFilters q={q} stage={stage} />

      {error && <p className="text-sm text-red-600">Couldn&apos;t load leads: {error.message}</p>}

      {leads.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">
          {q || stage ? "No leads match your search." : "No leads yet. Tap “Add lead” to create your first one."}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{leads.length} lead{leads.length === 1 ? "" : "s"}</p>

          {/* Phones: one card per lead */}
          <ul className="space-y-2 md:hidden">
            {leads.map((lead) => (
              <li key={lead.id} className="card flex items-start gap-3 p-4">
                <Link href={`/leads/${lead.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{lead.seller_name}</span>
                  </div>
                  <p className="truncate text-sm text-slate-500">
                    {[lead.property_address, lead.city].filter(Boolean).join(", ") || "No address"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <StageBadge stage={lead.stage} />
                    {lead.next_follow_up_date && <span>Follow up {shortDate(lead.next_follow_up_date)}</span>}
                  </div>
                </Link>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white"
                    aria-label={`Call ${lead.seller_name}`}
                  >
                    <PhoneIcon />
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Computers: table */}
          <div className="card hidden overflow-x-auto p-0 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 text-right font-medium">Asking</th>
                  <th className="px-4 py-3 font-medium">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/leads/${lead.id}`} className="hover:underline">{lead.seller_name}</Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {[lead.property_address, lead.city].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{lead.phone ?? "—"}</td>
                    <td className="px-4 py-3"><StageBadge stage={lead.stage} /></td>
                    <td className="px-4 py-3 text-slate-600">{lead.lead_source ?? "—"}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{money(lead.asking_price)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{shortDate(lead.next_follow_up_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
    </svg>
  );
}
