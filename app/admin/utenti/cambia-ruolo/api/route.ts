import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nome, cognome, telefono')
    .eq('ruolo', 'cliente')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ ruolo: 'barbiere', attivo: true })
      .eq('id', id)

    if (error) throw new Error(error.message)

    return Response.json({ success: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json({ error: error.message || 'Errore generico' }, { status: 500 })
  }
}
