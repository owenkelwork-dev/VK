import type { Stage } from "./constants";

export type Lead = {
  id: string;
  seller_name: string;
  phone: string | null;
  email: string | null;
  property_address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  property_type: string | null;
  property_condition: string | null;
  occupancy: string | null;
  lead_source: string | null;
  motivation: string | null;
  timeline: string | null;
  asking_price: number | null;
  notes: string | null;
  stage: Stage;
  position: number;
  next_follow_up_date: string | null;
  arv: number | null;
  repair_estimate: number | null;
  mao_percent: number;
  offer_price: number | null;
  contract_price: number | null;
  assignment_price: number | null;
  assigned_buyer_id: string | null;
  closed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = { id: string; full_name: string };
