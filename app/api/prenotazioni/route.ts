import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return Response.json({ error: 'Utente non autenticato' }, { status: 401 })
  }

  const oggi = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      data,
      orario,
      cliente:profiles!fk_cliente(id, nome, cognome),
      barbiere:profiles!fk_barbiere(id, nome, cognome),
      servizio:services!fk_servizio(id, nome, prezzo)
    `)
    .eq('cliente_id', user.id)
    .gte('data', oggi)
    .order('data', { ascending: true })
    .order('orario', { ascending: true })

  if (!user) {
    return Response.json({ error: 'Utente non autenticato' }, { status: 401 })
  }

  if (error) {
    console.error('Errore Supabase:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
