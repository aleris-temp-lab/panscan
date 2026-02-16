import { NextRequest, NextResponse } from 'next/server'
import { loginPatient } from '@panscan/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personalNumber } = body

    if (!personalNumber) {
      return NextResponse.json({ error: 'Personal number required' }, { status: 400 })
    }

    const result = await loginPatient(personalNumber)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
