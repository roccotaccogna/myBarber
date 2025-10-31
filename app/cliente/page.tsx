import ClienteDashboard from './ClienteDashboard';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login') // 🔒 reindirizza se non autenticato
  }
  return <ClienteDashboard />
}