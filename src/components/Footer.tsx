import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-black border-t border-brand-border/60 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Onde o estilo clássico encontra a precisão moderna. Atendimento exclusivo, produtos premium e a melhor experiência de barbearia da cidade.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-card flex items-center justify-center text-white hover:bg-brand-red transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-card flex items-center justify-center text-white hover:bg-brand-red transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wider border-l-2 border-brand-red pl-3">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/agendar" className="text-brand-red font-semibold hover:underline">Agendar Horário</Link>
              </li>
              <li>
                <Link href="/meus-agendamentos" className="hover:text-white transition-colors">Consultar Agendamento</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">Painel Administrativo</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wider border-l-2 border-brand-red pl-3">
              Horário de Funcionamento
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex flex-col py-1 border-b border-brand-border/40">
                <span className="text-gray-400 font-medium">Segunda-feira</span>
                <span className="text-white font-semibold">14:30 às 19:30</span>
              </li>
              <li className="flex flex-col py-1 border-b border-brand-border/40">
                <span className="text-gray-400 font-medium">Terça a Sábado</span>
                <span className="text-white font-semibold">08:30 às 12:30</span>
                <span className="text-white font-semibold">14:30 às 19:30</span>
              </li>
              <li className="flex items-center justify-between py-1 text-brand-muted">
                <span>Domingos &amp; Feriados</span>
                <span className="text-brand-red font-semibold">Fechado</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wider border-l-2 border-brand-red pl-3">
              Contato &amp; Endereço
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-300 leading-normal">
                  Av. Marechal Juarez Távora, Quadra 01, Casa 19 - Parque Piauí, Teresina - PI
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                <span>(86) 99999-8888</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-red shrink-0" />
                <span>Agendamentos online 24h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-border/40 text-center text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Geleia Barber Club - Teresina / PI. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Painel Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
