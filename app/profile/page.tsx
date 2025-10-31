import { createClient } from '@/utils/supabase/server'
import { User, Smartphone } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <p>Utente non autenticato</p>;
  }

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from('profiles')
    .select('nome, cognome, telefono')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return <p>Errore nel caricamento del profilo</p>;
  }

  return (
    <div className='min-h-screen justify-center flex flex-col items-center text-white'>
      <div className='mb-20'>
        <h1 className='text-5xl'>
          Il mio Profilo
        </h1>
      </div>

    <div className="space-y-6">
      {/* NOME */}
      <div>
        <label className="block text-gray-400 text-md font-medium mb-2">
          Nome
        </label>
        <div className="flex items-center space-x-6 bg-gray-700 px-4 py-3 rounded-lg w-56">
          <User className="h-5 w-5 text-blue-500" />
          <span className='text-white'>
            {profile.nome}
          </span>
        </div>
      </div>
      {/* COGNOME */}
      <div>
        <label className="block text-gray-400 text-md font-medium mb-2">
          Cognome
        </label>
        <div className="flex items-center space-x-6 bg-gray-700 px-4 py-3 rounded-lg">
          <User className="h-5 w-5 text-blue-500" />
          <span className='text-white'>
            {profile.cognome}
          </span>
        </div>
      </div>

      {/* TELEFONO */}
      <div>
        <label className="block text-gray-400 text-md font-medium mb-2">
          Telefono
        </label>
        <div className="flex items-center space-x-6 bg-gray-700 px-4 py-3 rounded-lg">
          <Smartphone className="h-5 w-5 text-blue-500" />
          <span className='text-white'>
            {profile.telefono}
          </span>
        </div>
      </div>
    </div>
    </div>
  )
}
