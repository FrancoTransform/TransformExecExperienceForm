import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { RegistrationFormData } from '@/lib/types'
import { syncToHubSpot } from '@/lib/hubspot'

export async function POST(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const formData: RegistrationFormData = await request.json()

    // Insert into database using Neon
    const result = await sql`
      INSERT INTO registrations (
        first_name, last_name, email, company, title,
        is_chro, company_size, is_exec_member,
        ai_at_work_mon, exec_chambers_mon, sponsored_dinner_mon,
        exec_member_lunch_tue, chro_experience_lunch_tue, chro_track_session_tue,
        exec_chambers_tue, vip_dinner_tue,
        chro_experience_breakfast_wed, executive_breakfast_wed, exec_chambers_wed,
        staying_at_wynn, check_in_date, check_out_date,
        dietary_restrictions, dietary_other
      ) VALUES (
        ${formData.firstName}, ${formData.lastName}, ${formData.email},
        ${formData.company}, ${formData.title},
        ${formData.isCHRO}, ${formData.companySize}, ${formData.isExecMember},
        ${formData.activities.aiAtWorkMon}, ${formData.activities.execChambersMon},
        ${formData.activities.sponsoredDinnerMon},
        ${formData.activities.execMemberLunchTue}, ${formData.activities.chroExperienceLunchTue},
        ${formData.activities.chroTrackSessionTue}, ${formData.activities.execChambersTue},
        ${formData.activities.vipDinnerTue},
        ${formData.activities.chroExperienceBreakfastWed}, ${formData.activities.executiveBreakfastWed},
        ${formData.activities.execChambersWed},
        ${formData.stayingAtWynn}, ${formData.checkInDate || null}, ${formData.checkOutDate || null},
        ${formData.dietaryRestrictions}, ${formData.dietaryOther || null}
      )
      RETURNING id
    `

    if (!result || result.length === 0) {
      console.error('Database error: No result returned')
      return NextResponse.json(
        { error: 'Failed to save registration' },
        { status: 500 }
      )
    }

    // Sync to HubSpot (don't block registration if this fails)
    try {
      await syncToHubSpot(formData)
    } catch (hubspotError) {
      console.error('HubSpot sync failed (non-blocking):', hubspotError)
      // Continue - we don't want to fail the registration if HubSpot fails
    }

    // TODO: Send confirmation email
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      id: result[0].id,
      message: 'Registration successful'
    })
  } catch (error: any) {
    console.error('Error processing registration:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

