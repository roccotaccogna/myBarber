'use server';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export async function handleLogin(formData: FormData) {
        const supabase = await createClient();
    
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
    
      const { error } = await supabase.auth.signInWithPassword({  
        email,  
        password
      })
      
        if (error) {
        redirect('/error');
      }

      // Recupera l'utente autenticato
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user ){
        redirect('/error');
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
        redirect('/error');
      };

      // Reindirizza in base al ruolo
      switch (profile.ruolo) {
        case 'cliente':
          return redirect('/cliente');
        case 'barbiere':
          return redirect('/barber');
        case 'admin':
          return redirect('/admin');
        default:
          return redirect('/error');
      }
  }

