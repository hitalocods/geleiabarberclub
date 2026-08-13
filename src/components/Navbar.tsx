'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Calendar, Scissors, LayoutDashboard, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-black/90 backdrop-blur-md border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/agendar" className="text-gray-300 hover:text-white transition-colors">
            Agendar Horário
          </Link>
          <Link href="/meus-agendamentos" className="text-gray-300 hover:text-brand-red transition-colors flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-brand-red" />
            Meus Agendamentos
          </Link>
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4 text-gray-400" />
            Painel Admin
          </Link>
        </nav>

        {/* Action CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/agendar"
            className="px-6 py-2.5 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Agendar Horário
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu"
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="w-7 h-7 text-brand-red" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Nav */}
      {isOpen && (
        <div className="md:hidden bg-brand-card border-b border-brand-border px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-brand-dark"
          >
            Início
          </Link>
          <Link
            href="/agendar"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-brand-dark"
          >
            Agendar Horário
          </Link>
          <Link
            href="/meus-agendamentos"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-brand-red hover:bg-brand-dark"
          >
            Meus Agendamentos
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-brand-dark"
          >
            Painel Admin (CRUD)
          </Link>

          <div className="pt-2">
            <Link
              href="/agendar"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl bg-brand-red text-center text-white font-bold block shadow-lg uppercase text-sm"
            >
              Agendar Horário Agora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
