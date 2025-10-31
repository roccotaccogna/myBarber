import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { barbiere_id } = await req.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orari_bloccati')
    .select('data')
    .is('orario', null)
    .or(`barbiere_id.is.null,barbiere_id.eq.${barbiere_id}`)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const dateStrings = data.map(d => d.data)
  return Response.json(dateStrings)
}
