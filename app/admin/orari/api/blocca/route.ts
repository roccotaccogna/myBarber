import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { barbiere_id, data, orario, motivo } = await req.json()
  const supabase = await createClient()

  if (!data) {
    return Response.json({ error: 'Data obbligatoria' }, { status: 400 })
  }

  const { error } = await supabase
        .from('orari_bloccati')
        .insert([
            {
            barbiere_id: barbiere_id || null,
            data,
            orario: orario || null,
            motivo: motivo || null,
            },
  ])

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
