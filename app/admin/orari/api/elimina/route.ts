import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { id } = await req.json()
  const supabase = await createClient()

  if (!id) {
    return Response.json({ error: 'ID mancante' }, { status: 400 })
  }

  const { error } = await supabase
    .from('orari_bloccati')
    .delete()
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
