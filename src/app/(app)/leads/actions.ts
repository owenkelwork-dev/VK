"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { num, text } from "@/lib/form-data";
import { STAGES } from "@/lib/constants";

export type FormState = { error: string } | null;

function leadFromForm(formData: FormData) {
  const stage = text(formData, "stage");
  return {
    seller_name: text(formData, "seller_name") ?? "",
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    property_address: text(formData, "property_address"),
    city: text(formData, "city"),
    state: text(formData, "state")?.toUpperCase() ?? null,
    zip: text(formData, "zip"),
    property_type: text(formData, "property_type"),
    property_condition: text(formData, "property_condition"),
    occupancy: text(formData, "occupancy"),
    lead_source: text(formData, "lead_source"),
    motivation: text(formData, "motivation"),
    timeline: text(formData, "timeline"),
    asking_price: num(formData, "asking_price"),
    notes: text(formData, "notes"),
    stage: STAGES.find((s) => s === stage) ?? "New Lead",
    next_follow_up_date: text(formData, "next_follow_up_date"),
  };
}

export async function createLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const lead = leadFromForm(formData);
  if (!lead.seller_name) return { error: "Seller name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").insert(lead).select("id").single();
  if (error) return { error: `Couldn't save the lead: ${error.message}` };

  revalidatePath("/", "layout");
  redirect(`/leads/${data.id}`);
}

export async function updateLead(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const lead = leadFromForm(formData);
  if (!lead.seller_name) return { error: "Seller name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update(lead).eq("id", id);
  if (error) return { error: `Couldn't save the lead: ${error.message}` };

  revalidatePath("/", "layout");
  redirect(`/leads/${id}`);
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(`Couldn't delete the lead: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/leads");
}
