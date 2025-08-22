import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@cuilahore\.edu\.pk$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please use a valid university email (e.g., your.name@cuilahore.edu.pk)" },
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
