import { NextResponse } from 'next/server'
import { logoutPatient } from '@panscan/auth'

export async function POST() {
  await logoutPatient()
  return NextResponse.json({ success: true })
}
