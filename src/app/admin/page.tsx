'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppointmentItem, ServiceItem, BarberItem } from '@/lib/db';
import {
  Calendar,
  DollarSign,
  Users,
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Check,
  Plus,
  Filter,
  User,
  LogOut,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Barber Filter
  const [selectedBarberId, setSelectedBarberId] = useState<string>('ALL');
  const [sessionBarber, setSessionBarber] = useState<any>(null);

  const loadAllData = async () => {
    try {
      const [resApp, resSrv, resBarb] = await Promise.all([
        fetch('/api/appointments').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/barbers').then((r) => r.json()),
      ]);

      if (resApp.success) setAppointments(resApp.data);
      if (resSrv.success) setServices(resSrv.data);
      if (resBarb.success) setBarbers(resBarb.data);

      // Check session
      const stored = localStorage.getItem('barberSession');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessionBarber(parsed);
        // Automatically filter to logged in barber if match found
        if (parsed?.id) {
          setSelectedBarberId(parsed.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (e) {
      alert('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este registro de agendamento?')) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (e) {
      alert('Erro ao excluir.');
    }
  };

  // Filtered Appointments by Barber
  const filteredAppointments = appointments.filter((app) => {
    if (selectedBarberId === 'ALL') return true;
    return app.barberId === selectedBarberId;
  });

  // Metrics Calculations based on filter
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = filteredAppointments.filter((a) => a.date === todayStr);
  const totalRevenue = filteredAppointments
    .filter((a) => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const pendingCount = filteredAppointments.filter((a) => a.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-brand-red font-bold animate-pulse">
        <Scissors className="w-6 h-6 animate-spin mr-2" />
        Carregando dados do painel...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
            Painel Geral <span className="text-brand-red">Geleia Barber</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {sessionBarber
              ? `Logado como: ${sessionBarber.name} (${sessionBarber.email})`
              : 'Agendamentos organizados por barbeiro e equipe.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!sessionBarber && (
            <Link
              href="/admin/login"
              className="px-4 py-2.5 rounded-full bg-brand-dark hover:bg-brand-border border border-brand-border text-gray-300 text-xs font-bold uppercase transition-colors"
            >
              Login do Barbeiro
            </Link>
          )}

          <Link
            href="/agendar"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Agendamento
          </Link>
        </div>
      </div>

      {/* Barber Filter Selector Tabs */}
      <div className="bg-brand-card border border-brand-border/80 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-red" />
          <span>Filtrar Agenda por Barbeiro:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedBarberId('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${
              selectedBarberId === 'ALL'
                ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'bg-brand-dark text-gray-400 hover:text-white border border-brand-border/60'
            }`}
          >
            Todos os Barbeiros ({appointments.length})
          </button>
          {barbers.map((b) => {
            const count = appointments.filter((a) => a.barberId === b.id).length;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBarberId(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap flex items-center gap-2 ${
                  selectedBarberId === b.id
                    ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-brand-dark text-gray-400 hover:text-white border border-brand-border/60'
                }`}
              >
                <span>{b.name}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Faturamento ({selectedBarberId === 'ALL' ? 'Geral' : 'Barbeiro'})</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">Cortes confirmados/concluídos</p>
        </div>

        <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Agendamentos Hoje</span>
            <div className="p-2 rounded-lg bg-brand-red/20 text-brand-red">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{todayAppointments.length}</p>
          <p className="text-[10px] text-gray-400">Data: {todayStr}</p>
        </div>

        <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Pendentes</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-[10px] text-gray-400">Requer confirmação</p>
        </div>

        <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase">
            <span>Barbeiros Ativos</span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{barbers.length}</p>
          <p className="text-[10px] text-gray-400">Equipe Geleia Barber Club</p>
        </div>
      </div>

      {/* Appointments Management - Responsive Table & Cards for Mobile */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden space-y-4">
        <div className="p-4 sm:p-6 border-b border-brand-border/60 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white border-l-4 border-brand-red pl-3">
            Lista de Agendamentos ({filteredAppointments.length})
          </h2>
        </div>

        {/* Mobile View (Cards) */}
        <div className="block lg:hidden p-4 space-y-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-500 text-xs py-6">Nenhum agendamento para este filtro.</p>
          ) : (
            filteredAppointments.map((app) => (
              <div key={app.id} className="p-4 rounded-xl bg-brand-dark border border-brand-border space-y-3">
                <div className="flex justify-between items-start border-b border-brand-border/40 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{app.clientName}</h4>
                    <p className="text-xs text-gray-400 font-mono">{app.clientPhone}</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      app.status === 'CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : app.status === 'COMPLETED'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        : app.status === 'CANCELLED'
                        ? 'bg-red-950 text-red-400 border border-red-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {app.status === 'CONFIRMED'
                      ? 'Confirmado'
                      : app.status === 'COMPLETED'
                      ? 'Concluído'
                      : app.status === 'CANCELLED'
                      ? 'Cancelado'
                      : 'Pendente'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Data &amp; Hora:</span>
                    <span className="font-bold text-brand-red">{app.date} às {app.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Valor:</span>
                    <span className="font-extrabold text-white">R$ {app.totalPrice?.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Serviço:</span>
                    <span className="font-semibold text-gray-200">{app.service?.title || 'Serviço'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Barbeiro:</span>
                    <span className="font-semibold text-gray-200">{app.barber?.name || 'Geleia Barber'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/40">
                  {app.status === 'PENDING' && (
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30"
                    >
                      Confirmar
                    </button>
                  )}
                  {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                      className="px-3 py-1.5 rounded-lg bg-blue-950 text-blue-400 text-xs font-bold border border-blue-500/30"
                    >
                      Concluir
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 rounded-lg bg-red-950 text-red-400 text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-brand-dark text-xs uppercase text-gray-400 tracking-wider">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Data &amp; Hora</th>
                <th className="p-4">Serviço</th>
                <th className="p-4">Barbeiro</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Nenhum agendamento cadastrado.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-brand-dark/50 transition-colors">
                    <td className="p-4 font-bold text-white">{app.clientName}</td>
                    <td className="p-4 text-xs font-mono">{app.clientPhone}</td>
                    <td className="p-4 text-xs">
                      <span className="font-bold text-white block">{app.date}</span>
                      <span className="text-brand-red font-semibold">{app.timeSlot}</span>
                    </td>
                    <td className="p-4">{app.service?.title || 'Serviço Barbearia'}</td>
                    <td className="p-4">{app.barber?.name || 'Barbeiro Geleia'}</td>
                    <td className="p-4 font-bold text-white">
                      R$ {app.totalPrice?.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                          app.status === 'CONFIRMED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'COMPLETED'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                            : app.status === 'CANCELLED'
                            ? 'bg-red-950 text-red-400 border border-red-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {app.status === 'CONFIRMED'
                          ? 'Confirmado'
                          : app.status === 'COMPLETED'
                          ? 'Concluído'
                          : app.status === 'CANCELLED'
                          ? 'Cancelado'
                          : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                            title="Confirmar Agendamento"
                            className="p-2 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-800 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                            title="Marcar como Concluído"
                            className="p-2 rounded-lg bg-blue-950 text-blue-400 hover:bg-blue-800 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {app.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                            title="Cancelar Agendamento"
                            className="p-2 rounded-lg bg-amber-950 text-amber-400 hover:bg-amber-800 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(app.id)}
                          title="Excluir Registro"
                          className="p-2 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
