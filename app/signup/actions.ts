'use server';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

  export async function handleSignup(formData: FormData) {
  const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const nome = formData.get('nome') as string;
    const cognome = formData.get('cognome') as string;
    const telefono = formData.get('telefono') as string;

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
      console.log('sign up error', signUpError);
      redirect('/error');
    }

  redirect('/');
  }


  

