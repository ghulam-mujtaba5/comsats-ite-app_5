import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { validateCUIEmail } from "@/lib/auth";

export async function POST(request: Request) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { email, password, name } = await request.json();

  if (!validateCUIEmail(email)) {
    return NextResponse.json(
      { error: "Please use your university email in the format fa22-bse-105@cuilahore.edu.pk" },
      { status: 400, headers }
    );
  }

  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400, headers });
  }

  return NextResponse.json({ data }, { headers });
}
