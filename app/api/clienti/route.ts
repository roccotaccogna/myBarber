import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')?.toLowerCase() ?? ''
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, cognome')
    .eq('ruolo', 'cliente')
    .or(`nome.ilike.%${query}%,cognome.ilike.%${query}%`)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
