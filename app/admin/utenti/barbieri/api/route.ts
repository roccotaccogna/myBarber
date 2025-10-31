import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, cognome, telefono')
    .eq('ruolo', 'barbiere')
    .eq('attivo', true)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
