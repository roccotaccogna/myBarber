'use client'

import { handleSignup } from './actions';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Spinner from '../_components/Spinner';

type SignupFormData = {
  email: string
  password: string
  nome: string
  cognome: string
  telefono: string
}


export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignupFormData>()

  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(data: SignupFormData) {
    const result = await handleSignup(data)

    if (!result.success) {
      setErrorMessage(result.message || 'Errore durante la registrazione')
      return
    }

    router.push('/')
  }

  return (
    <form 
      className="max-w-md mx-auto p-4 flex flex-col 
                 gap-2 min-h-screen justify-center text-white" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-5xl font-bold mb-4 text-center">
        Registrati
      </h2>

      {errorMessage && (
        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
      )}

      <input
        type="text"
        placeholder="Nome"
        {...register('nome', { required: 'Nome obbligatorio' })}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />

      <input
        type="text"
        placeholder="Cognome"
        {...register('cognome', { required: 'Cognome obbligatorio' })}
    
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />

      <input
        type="tel"
        placeholder="Telefono"
        {...register('telefono', { required: 'Telefono obbligatorio' })}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />
      <input
        type="email"
        placeholder="Email"
        {...register('email', {
          required: 'Email obbligatoria',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email non valida'
          }
        })}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />
      <input
        type="password"
        placeholder="Password"
        {...register('password', {
          required: 'Password obbligatoria',
          minLength: {
            value: 6,
            message: 'Minimo 6 caratteri'
          }
        })}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />

      <Spinner text='Registrati' loading={isSubmitting} />
    </form>
  )
}
