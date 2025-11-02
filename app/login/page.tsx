'use client'

import { handleLogin } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Spinner from '../_components/Spinner';

type LoginFormData = {
  email: string
  password: string
}


export default function LoginPage() {

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<LoginFormData>()

  
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

    async function onSubmit(data: LoginFormData) {
    const result = await handleLogin(data)

    if (!result.success) {
      setErrorMessage(result.message || 'Errore durante il login')
      return
    }

    switch (result.ruolo) {
      case 'cliente':
        router.push('/cliente')
        break
      case 'barbiere':
        router.push('/barber')
        break
      case 'admin':
        router.push('/admin')
        break
      default:
        setErrorMessage('Ruolo non riconosciuto')
    }
  }  


  return (
    <form 
      className="max-w-md mx-auto p-4 flex flex-col 
                 gap-4 min-h-screen justify-center text-white" 
      // action={handleLogin}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-5xl font-bold mb-4 text-center">
        Accedi
      </h2>

      
      {errorMessage && (
        <p className="text-red-500 text-center text-md">
          {errorMessage}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        // name='email'
        // value={email}
        // onChange={e => setEmail(e.target.value)}
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
       {errors.email && <p className="text-red-500 text-md">{errors.email.message}</p>}
      
      <input
        type="password"
        placeholder="Password"
        // name="password"
        // value={password}
        // onChange={e => setPassword(e.target.value)}
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
      {errors.password && <p className="text-red-500 text-md">
        {errors.password.message}
      </p>}
      <Spinner text='Accedi' loading={isSubmitting}/>
    </form>
  )
}

