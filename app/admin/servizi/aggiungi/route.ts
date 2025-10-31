import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { nome, prezzo } = await req.json()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .insert({ nome, prezzo })
    .select()
    .single()
  if (error) return Response.json({ error }, { status: 500 })
  return Response.json(data)
}
