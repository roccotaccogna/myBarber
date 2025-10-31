import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('services').select('id, nome, prezzo')
  if (error) return Response.json({ error }, { status: 500 })
  return Response.json(data)
}
