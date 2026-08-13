'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { User, Lock, ArrowRight, ShieldCheck, Scissors } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('barberSession', JSON.stringify(data.barber));
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Falha no login.');
      }
    } catch (err) {
      setErrorMsg('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoName: string) => {
    const demoUser = {
      id: demoEmail.includes('geleia') ? 'barber-1' : demoEmail.includes('lucas') ? 'barber-2' : 'barber-3',
      name: demoName,
      email: demoEmail,
    };
    localStorage.setItem('barberSession', JSON.stringify(demoUser));
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-radial-gradient flex items-center justify-center p-4 selection:bg-brand-red selection:text-white">
      <div className="max-w-md w-full bg-brand-card/90 border border-brand-red/40 rounded-3xl p-8 space-y-6 shadow-[0_0_50px_rgba(220,38,38,0.25)] backdrop-blur-xl">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Área do <span className="text-brand-red">Barbeiro / Admin</span>
          </h1>
          <p className="text-xs text-gray-400">
            Entre com suas credenciais para visualizar sua lista de agendamentos.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              E-mail do Barbeiro
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ex: geleia@barber.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
          >
            {loading ? 'Acessando...' : 'Acessar Meu Painel'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Shortcuts */}
        <div className="pt-4 border-t border-brand-border/60 space-y-2">
          <p className="text-[11px] text-gray-400 text-center font-semibold uppercase tracking-wider">
            Acesso Rápido para Demonstração:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('geleia@barber.com', 'Geleia (Master Barber)')}
              className="px-2 py-2 rounded-xl bg-brand-dark hover:bg-brand-border border border-brand-border/60 text-[11px] font-bold text-gray-300 hover:text-white transition-colors"
            >
              Geleia
            </button>
            <button
              onClick={() => handleQuickLogin('lucas@barber.com', 'Lucas "Navalha"')}
              className="px-2 py-2 rounded-xl bg-brand-dark hover:bg-brand-border border border-brand-border/60 text-[11px] font-bold text-gray-300 hover:text-white transition-colors"
            >
              Lucas
            </button>
            <button
              onClick={() => handleQuickLogin('mateus@barber.com', 'Mateus "Fade"')}
              className="px-2 py-2 rounded-xl bg-brand-dark hover:bg-brand-border border border-brand-border/60 text-[11px] font-bold text-gray-300 hover:text-white transition-colors"
            >
              Mateus
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Voltar para o site principal
          </Link>
        </div>
      </div>
    </div>
  );
}
