import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { data } = await req.json()
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return Response.json({ error: 'Utente non autenticato' }, { status: 401 })
  }

  const dataISO = data // es. '2025-10-31'

  // Verifica se la giornata è bloccata
  const { data: bloccoGiorno } = await supabase
    .from('orari_bloccati')
    .select('id')
    .eq('data', dataISO)
    .is('orario', null)
    .or(`barbiere_id.is.null,barbiere_id.eq.${user.id}`)

  if (bloccoGiorno && bloccoGiorno.length > 0) {
    return Response.json([]) // giornata interamente bloccata
  }

  // Carica prenotazioni del barbiere
  const { data: prenotazioni, error } = await supabase
    .from('bookings')
    .select(`
      id,
      data,
      orario,
      cliente:profiles!fk_cliente(id, nome, cognome),
      barbiere:profiles!fk_barbiere(id, nome, cognome),
      servizio:services!fk_servizio(id, nome, prezzo)
    `)
    .eq('data', dataISO)
    .eq('barber_id', user.id)
    .order('orario', { ascending: true })

  if (error) {
    console.error('Errore Supabase:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(prenotazioni)
}
