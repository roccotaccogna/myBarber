import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import BarberDashboard from './BarberDashboard';

export default async function ClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login') // 🔒 reindirizza se non autenticato
  }
  return <BarberDashboard />
}