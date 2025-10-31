'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function handleLogout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Errore durante il logout:', error.message)
    // opzionalmente gestisci errore (per es. notifiche)
  }

  redirect('/')  // reindirizza alla home o pagina pubblica dopo logout
}