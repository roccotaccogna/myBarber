'use server';

import { createClient } from "@/utils/supabase/server";

  export async function handleSignup(data: {
  email: string
  password: string
  nome: string
  cognome: string
  telefono: string
}) {
  const supabase = await createClient();
  const { email, password, nome, cognome, telefono } = data

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({  
    email,  
    password,
    options: {
      data: {
        nome,
        cognome,
        telefono,
      }
    }
  })

    if (signUpError || !signUpData.user) {
      return { success: false, message: signUpError?.message || 'Errore nella registrazione' }
    }

   return { success: true }
  }


  

