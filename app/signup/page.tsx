'use client'

import { handleSignup } from './actions';
import { useState } from 'react';
import Spinner from '../_components/Spinner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [telefono, setTelefono] = useState('');

  return (
    <form 
      className="max-w-md mx-auto p-4 flex flex-col 
                 gap-2 min-h-screen justify-center text-white" 
      action={handleSignup}
    >
      <h2 className="text-5xl font-bold mb-4 text-center">
        Registrati
      </h2>
      <input
        name="nome"
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />

      <input
        name="cognome"
        type="text"
        placeholder="Cognome"
        value={cognome}
        onChange={e => setCognome(e.target.value)}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />

      <input
        name="telefono"
        type="tel"
        placeholder="Telefono"
        value={telefono}
        onChange={e => setTelefono(e.target.value)}
        required
        className="p-2 border rounded border-gray-400 focus:outline-none text-lg"
      />
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

      <Spinner text='Registrati'/>
    </form>
  )
}
