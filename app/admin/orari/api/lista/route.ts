import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orari_bloccati')
    .select(`
      id,
      data,
      orario,
      motivo,
      barbiere:profiles(id, nome, cognome)
    `)
    .order('data', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
