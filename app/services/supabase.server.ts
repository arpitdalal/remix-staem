import { createClient } from "@supabase/supabase-js";

const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const SUPABASE_BEARER_TOKEN = process.env.SUPABASE_BEARER_TOKEN;

const supabaseClient = createClient(
  "https://gqkuommdmfzmwkzdewma.supabase.co",
  SUPABASE_API_KEY,
  {
    headers: {
      Authorization: `Bearer ${String(SUPABASE_BEARER_TOKEN)}`,
    },
  },
);

export default supabaseClient;
