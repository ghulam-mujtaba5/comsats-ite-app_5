import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { validateCUIEmail } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!validateCUIEmail(email)) {
    return NextResponse.json(
      { error: "Please use your university email in the format fa22-bse-105@cuilahore.edu.pk" },
      { status: 400 }
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
