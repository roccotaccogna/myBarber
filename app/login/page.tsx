'use client'

import { handleLogin } from './actions';
import { useState } from 'react';
import Spinner from '../_components/Spinner';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form 
      className="max-w-md mx-auto p-4 flex flex-col 
                 gap-4 min-h-screen justify-center text-white" 
      action={handleLogin}
    >
      <h2 className="text-5xl font-bold mb-4 text-center">
        Accedi
      </h2>
      <input
        type="email"
        placeholder="Email"
        name='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />
      <Spinner text='Accedi'/>
    </form>
  )
}

