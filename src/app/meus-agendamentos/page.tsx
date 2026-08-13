'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppointmentItem } from '@/lib/db';
import { Phone, Calendar, Scissors, Clock, User, Trash2, AlertCircle, CheckCircle, Search } from 'lucide-react';

export default function MyAppointmentsPage() {
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentItem[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    setLoading(true);
    setCancelMessage('');
    try {
      const res = await fetch(`/api/appointments?phone=${encodeURIComponent(phoneInput)}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => (prev ? prev.filter((a) => a.id !== id) : []));
        setCancelMessage('Agendamento cancelado com sucesso.');
      }
    } catch (err) {
      alert('Erro ao cancelar agendamento.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-10">
          <span className="text-brand-red font-bold text-xs tracking-widest uppercase border-b border-brand-red pb-1">
            Consulta de Clientes
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase">
            Meus <span className="text-brand-red">Agendamentos</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Digite o telefone informado no momento do agendamento para consultar ou cancelar seus horários.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2 p-2 rounded-2xl bg-brand-card border border-brand-border focus-within:border-brand-red">
            <input
              type="tel"
              required
              placeholder="Digite seu número de telefone..."
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-white focus:outline-none text-sm font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {cancelMessage && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm text-center">
            {cancelMessage}
          </div>
        )}

        {/* Results List */}
        {searched && appointments && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wider border-l-2 border-brand-red pl-3">
              Resultados da Busca ({appointments.length})
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-brand-card border border-brand-border rounded-2xl p-6 space-y-3">
                <AlertCircle className="w-10 h-10 mx-auto text-brand-muted" />
                <p className="text-gray-300 font-semibold">Nenhum agendamento encontrado para este número.</p>
                <Link href="/agendar" className="inline-block text-brand-red font-bold text-xs uppercase hover:underline">
                  Clique aqui para fazer um novo agendamento
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4 relative overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                      <span className="text-xs font-bold text-gray-400">Status:</span>
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          app.status === 'CONFIRMED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : app.status === 'CANCELLED'
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : app.status === 'COMPLETED'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {app.status === 'CONFIRMED'
                          ? 'Confirmado'
                          : app.status === 'CANCELLED'
                          ? 'Cancelado'
                          : app.status === 'COMPLETED'
                          ? 'Concluído'
                          : 'Pendente'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Cliente:</span>
                        <span className="font-bold text-white">{app.clientName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Serviço:</span>
                        <span className="font-bold text-white">{app.service?.title || 'Serviço Barbearia'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Barbeiro:</span>
                        <span className="font-bold text-white">{app.barber?.name || 'Geleia Barber'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Data &amp; Horário:</span>
                        <span className="font-bold text-brand-red">{app.date} às {app.timeSlot}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-400 text-xs">Valor:</span>
                        <span className="font-extrabold text-white">R$ {app.totalPrice?.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    {app.status !== 'CANCELLED' && (
                      <div className="pt-3 border-t border-brand-border/60 flex justify-end">
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs transition-colors flex items-center gap-1.5 border border-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Cancelar Agendamento
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
