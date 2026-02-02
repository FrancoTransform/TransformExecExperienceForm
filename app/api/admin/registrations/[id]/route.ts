import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET single registration
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT * FROM registrations
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ registration: result[0] })
  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    )
  }
}

// PUT update registration
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const result = await sql`
      UPDATE registrations
      SET
        first_name = ${data.firstName},
        last_name = ${data.lastName},
        email = ${data.email},
        company = ${data.company},
        title = ${data.title},
        is_chro = ${data.isCHRO},
        company_size = ${data.companySize},
        is_exec_member = ${data.isExecMember},
        activities = ${JSON.stringify(data.activities)},
        staying_at_wynn = ${data.stayingAtWynn},
        check_in_date = ${data.checkInDate || null},
        check_out_date = ${data.checkOutDate || null},
        dietary_restrictions = ${JSON.stringify(data.dietaryRestrictions)},
        dietary_other = ${data.dietaryOther || null}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Registration updated successfully',
      registration: result[0]
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}

// DELETE registration
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`
      DELETE FROM registrations
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Registration deleted successfully',
      id: result[0].id
    })
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}

