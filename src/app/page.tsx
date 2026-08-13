import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { Calendar, Sparkles, Scissors } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col selection:bg-brand-red selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-radial-gradient py-16 px-4">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2430_1px,transparent_1px),linear-gradient(to_bottom,#1f2430_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-card/90 border border-brand-red/40 text-brand-red font-semibold text-xs uppercase tracking-widest backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Experiência Premium em Barbearia
          </div>

          <div className="flex justify-center my-4">
            <Logo size="lg" />
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight uppercase px-2">
            Estilo, Respeito <br className="hidden sm:inline" />
            <span className="text-gradient-red">&amp; Precisão na Navalha</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-xl font-normal leading-relaxed px-4">
            Mais do que um corte de cabelo, a sua melhor versão. Agende seu horário online em menos de 1 minuto sem pegar filas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4">
            <Link
              href="/agendar"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-base tracking-wider uppercase transition-all shadow-[0_0_35px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              <Calendar className="w-5 h-5" />
              Agendar Meu Horário
            </Link>

            <Link
              href="/meus-agendamentos"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-card hover:bg-brand-border text-white font-bold text-base transition-all border border-brand-border flex items-center justify-center gap-2"
            >
              <Scissors className="w-5 h-5 text-brand-red" />
              Consultar Agendamento
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-12 max-w-4xl mx-auto border-t border-brand-border/60">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-white">4.9 ★</p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Avaliação dos Clientes</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-brand-red">+5.000</p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Cortes Realizados</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Pontualidade</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-brand-red">24/7</p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Agendamento Online</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
