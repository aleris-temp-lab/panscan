import { NextResponse } from 'next/server'
import { logoutStaff } from '@panscan/auth'

export async function POST() {
  await logoutStaff()
  return NextResponse.json({ success: true })
}
