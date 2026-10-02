import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";
import { updateLead } from "../../actions";
import { LeadForm } from "../../lead-form";
import { DeleteLeadButton } from "./delete-button";

export default async function EditLeadPage({ params }: PageProps<"/leads/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Edit {lead.seller_name}</h1>
      <LeadForm action={updateLead.bind(null, lead.id)} lead={lead} cancelHref={`/leads/${lead.id}`} />
      <div className="pt-4">
        <DeleteLeadButton id={lead.id} />
      </div>
    </div>
  );
}
