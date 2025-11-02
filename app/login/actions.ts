'use server';

import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";


export async function handleLogin(data: { email: string; password: string }) {
        const supabase = await createClient();
    
        // const email = formData.get('email') as string;
        // const password = formData.get('password') as string;
        const { email, password } = data
    
      const { error } = await supabase.auth.signInWithPassword({  
        email,  
        password
      })
      
        if (error) {
        return { success: false, message: error.message }
      }

      // Recupera l'utente autenticato
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user ){
        return { success: false, message: 'Utente non trovato' }
      }

      //Recupera profilo dell'utente per ottenere il ruolo
      const {
        data: profile,
        error: profileError
      } = await supabase
            .from('profiles')
            .select('ruolo')
            .eq('id', user.id)
            .single();

      if( profileError || !profile){
        return { success: false, message: 'Profilo non trovato' }
      };

      // Reindirizza in base al ruolo
      // switch (profile.ruolo) {
      //   case 'cliente':
      //     return redirect('/cliente');
      //   case 'barbiere':
      //     return redirect('/barber');
      //   case 'admin':
      //     return redirect('/admin');
      //   default:
      //     return redirect('/error');
      // }
      return { success: true, ruolo: profile.ruolo }
  }

