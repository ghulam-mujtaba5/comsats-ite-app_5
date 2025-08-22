/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function getSchema() {
  try {
    // This is a simplified way to get schema info. 
    // A more robust method would query pg_catalog directly.
    const { data, error } = await supabase.from("reviews").select("*").limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      console.log("Columns for 'reviews' table:", Object.keys(data[0]));
    } else {
      console.log("Could not infer columns as 'reviews' table is empty. Please add a manual entry to inspect the schema.");
    }
  } catch (error: any) {
    console.error("Error fetching schema:", error.message);
    process.exit(1);
  }
}

getSchema();
