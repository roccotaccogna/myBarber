import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const { data, barbiere_id } = await req.json()
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      id,
      data,
      orario,
      cliente:profiles!fk_cliente(id, nome, cognome),
      barbiere:profiles!fk_barbiere(id, nome, cognome),
      servizio:services!fk_servizio(id, nome)
    `)

  if (data) {
    query = query.eq('data', data)
  } else if (barbiere_id) {
    query = query.eq('barber_id', barbiere_id)
              .order('data', { ascending: false})
  }

  const { data: prenotazioni, error } = await query

  if (error) {
    console.error('Errore Supabase:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(prenotazioni)
}

