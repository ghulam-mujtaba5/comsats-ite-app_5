import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminAccess(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isAdmin: false, user: null }
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, permissions')
    .eq('user_id', user.id)
    .single()

  return { isAdmin: !!adminUser, user, adminUser }
}

export async function GET(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore } as any)
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error
    }

    // Return default settings if none exist
    const defaultSettings = {
      site_name: "CampusAxis",
      site_description: "Academic portal for COMSATS University",
      site_logo_url: "",
      contact_email: "admin@comsats.edu.pk",
      maintenance_mode: false,
      registration_enabled: true,
      max_file_size_mb: 10,
      allowed_file_types: ["pdf", "doc", "docx", "jpg", "png"],
      theme_color: "#3b82f6",
      announcement_text: "",
      announcement_enabled: false,
      social_links: {}
    }

    return NextResponse.json(settings || defaultSettings)
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore } as any)
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { section, settings } = await request.json()

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('site_settings')
      .select('id')
      .single()

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', existingSettings.id)

      if (error) throw error
    } else {
      // Create new settings
      const { error } = await supabase
        .from('site_settings')
        .insert(settings)

      if (error) throw error
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error: any) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
