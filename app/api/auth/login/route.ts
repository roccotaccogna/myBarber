// app/api/auth/login/route.ts
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  cookieStore.set('token', 'abc123', { httpOnly: true })
  return Response.json({ success: true })
}
