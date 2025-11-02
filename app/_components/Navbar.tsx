'use client';

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

import {
  UserIcon,
  HomeIcon,
  ScissorsIcon,
  LogOutIcon,
  LayoutDashboardIcon
} from 'lucide-react';


interface NavbarProps{
  isLoggedIn: boolean,
  ruolo: string | null;
}

export default function Navbar({isLoggedIn, ruolo}: NavbarProps) {
  const supabase = createClient();
  

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-gray-950 p-4 text-white flex justify-between items-center text-lg">
      {
        isLoggedIn ? (
          <>
            <Link href="/profile" className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 inline md:hidden" />
              <span className="hidden md:inline">
                Il mio profilo
              </span>
            </Link>
            {
              ruolo === 'admin' && (
              <Link href="/admin" className="flex items-center space-x-2">
                  <LayoutDashboardIcon className="w-5 h-5 inline md:hidden" />
                  <span className="hidden md:inline">Dashboard Admin</span>
                </Link>
              )
            }
            {
              ruolo === 'barbiere' && (
              <Link href="/barber" className="flex items-center space-x-2">
                <LayoutDashboardIcon className="w-5 h-5 inline md:hidden" />
                <span className="hidden md:inline">Dashboard Barbiere</span>
              </Link>
              )
            }
            {
              ruolo === 'cliente' && (
                <>
                <div className="flex space-x-4">
                  <Link href="/cliente" className="flex items-center space-x-2">
                    <HomeIcon className="w-5 h-5 inline md:hidden" />
                    <span className="hidden md:inline">Home</span>
                  </Link>
                  <p>|</p>
                  <Link href="/cliente/prenotazioni" className="flex items-center space-x-2">
                    <ScissorsIcon className="w-5 h-5 inline md:hidden" />
                    <span className="hidden md:inline">Le Mie prenotazioni</span>
                  </Link>
                </div>
                </>
              )
            }
            
            <button onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer">
              <LogOutIcon className="w-5 h-5 inline md:hidden" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
          <Link href="/">
            <Image 
              src="/assets/barberLogo.png"
              width={50}
              height={50}
              alt="logo"
            />
          </Link>
          <div className="flex space-x-4">
            <Link href="/login">
              Accedi
            </Link>
            <p>|</p>
            <Link href="/signup">
              Registrati
            </Link>
          </div>
          </>
        )
      }
    </nav>
  )
};