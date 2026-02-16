import { NextRequest, NextResponse } from 'next/server'
import { loginStaff, getStaffSession, logoutStaff } from '@panscan/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const result = await loginStaff(email, password || 'demo')

    if (result.success) {
      // Check if user is admin role
      const session = await getStaffSession()
      if (session?.user?.role !== 'admin') {
        // Log out non-admin users
        await logoutStaff()
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
