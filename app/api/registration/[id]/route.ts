import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT * FROM registrations WHERE id = ${id}
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    const data = result[0]

    // Map activity selections to readable names with full dates
    const selectedActivities: string[] = []
    const activityMapping = {
      ai_at_work_mon: 'AI@Work Session - Mon, Feb 24 • 12:00 PM – 1:00 PM',
      exec_chambers_mon: 'Exec Chambers Session - Mon, Feb 24 • 4:00 PM – 5:00 PM',
      sponsored_dinner_mon: 'Sponsored Dinner - Mon, Feb 24 • 6:00 PM – 9:00 PM',
      exec_member_lunch_tue: 'Exec Member Lunch - Tue, Feb 25 • 11:30 AM – 12:30 PM',
      chro_experience_lunch_tue: 'CHRO Experience Lunch - Tue, Feb 25 • 12:00 PM – 12:45 PM',
      chro_track_session_tue: 'CHRO Track Session - Tue, Feb 25 • 2:00 PM – 4:00 PM',
      exec_chambers_tue: 'Exec Chambers Session - Tue, Feb 25 • 4:00 PM – 5:00 PM',
      vip_dinner_tue: 'VIP Dinner - Tue, Feb 25 • 6:30 PM – 9:00 PM',
      chro_experience_breakfast_wed: 'CHRO Experience Breakfast - Wed, Feb 26 • 8:00 AM – 9:00 AM',
      executive_breakfast_wed: 'Executive Breakfast - Wed, Feb 26 • 8:00 AM – 9:00 AM',
      exec_chambers_wed: 'Exec Chambers Session - Wed, Feb 26 • 3:00 PM – 4:00 PM',
    }

    Object.entries(activityMapping).forEach(([key, name]) => {
      if (data[key]) {
        selectedActivities.push(name)
      }
    })

    return NextResponse.json({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      selectedActivities,
      stayingAtWynn: data.staying_at_wynn,
      checkInDate: data.check_in_date,
      checkOutDate: data.check_out_date,
      dietaryRestrictions: data.dietary_restrictions || [],
      dietaryOther: data.dietary_other,
    })
  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

