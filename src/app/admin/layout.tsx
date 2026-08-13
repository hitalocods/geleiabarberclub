'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Scissors,
  Users,
  Calendar,
  ArrowLeft,
  Plus,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    // Check if barber is logged in
    const stored = localStorage.getItem('barberSession');
    if (stored) {
      try {
        setSessionUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('barberSession');
    setSessionUser(null);
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { label: 'Agendamentos', href: '/admin/agendamentos', icon: Calendar },
    { label: 'Gerenciar Serviços', href: '/admin/servicos', icon: Scissors },
    { label: 'Gerenciar Barbeiros', href: '/admin/barbeiros', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col md:flex-row">
      {/* Mobile Top Header with Hamburger Toggle */}
      <div className="md:hidden bg-brand-dark border-b border-brand-border/60 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-3">
          {sessionUser && (
            <span className="text-[11px] font-bold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full border border-brand-red/30 truncate max-w-[120px]">
              {sessionUser.name.split(' ')[0]}
            </span>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu Administrativo"
            className="p-2 text-gray-300 hover:text-white rounded-lg bg-brand-card border border-brand-border"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-brand-red" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar & Mobile Drawer Overlay */}
      <aside
        className={`${
          mobileMenuOpen ? 'block fixed inset-0 z-50 bg-brand-black/95 backdrop-blur-xl' : 'hidden'
        } md:block md:relative w-full md:w-64 bg-brand-dark border-r border-brand-border/60 p-6 flex flex-col justify-between shrink-0`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Logo size="sm" />
              <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest mt-1 block">
                Painel Administrativo
              </span>
            </Link>

            {/* Mobile close button inside drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Session Info Card */}
          {sessionUser ? (
            <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-red/30 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{sessionUser.name}</p>
                  <p className="text-[10px] text-brand-red truncate">{sessionUser.email || 'Barbeiro Ativo'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 border border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair da Conta
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between text-xs font-bold text-gray-300 hover:text-white hover:border-brand-red transition-all"
            >
              <span>Fazer Login como Barbeiro</span>
              <User className="w-4 h-4 text-brand-red" />
            </Link>
          )}

          {/* Nav Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    active
                      ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-brand-card'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-brand-border/40 space-y-3 mt-6">
          <Link
            href="/agendar"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-brand-red/10 border border-brand-red/30 hover:bg-brand-red text-brand-red hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Agendamento
          </Link>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
