import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET all registrations
export async function GET() {
  try {
    const registrations = await sql`
      SELECT * FROM registrations 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

