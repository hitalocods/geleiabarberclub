'use client';

import React, { useState, useEffect } from 'react';
import { AppointmentItem, ServiceItem, BarberItem } from '@/lib/db';
import { Calendar, Plus, Search, Filter, Check, CheckCircle2, XCircle, Trash2, Scissors } from 'lucide-react';

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New Manual Appointment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('14:30');
  const [serviceId, setServiceId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    try {
      const [resApp, resSrv, resBarb] = await Promise.all([
        fetch('/api/appointments').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/barbers').then((r) => r.json()),
      ]);

      if (resApp.success) setAppointments(resApp.data);
      if (resSrv.success) {
        setServices(resSrv.data);
        if (resSrv.data.length > 0) setServiceId(resSrv.data[0].id);
      }
      if (resBarb.success) {
        setBarbers(resBarb.data);
        if (resBarb.data.length > 0) setBarberId(resBarb.data[0].id);
      }

      // Check session
      const stored = localStorage.getItem('barberSession');
      if (stored) {
        const parsed = JSON.parse(stored);
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
    loadData();
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
    if (!confirm('Deseja excluir este agendamento?')) return;
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

  const handleCreateManualAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const srv = services.find((s) => s.id === serviceId);
    if (!clientName || !clientPhone || !srv || !barberId) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientPhone,
          date,
          timeSlot,
          serviceId,
          barberId,
          totalPrice: srv.price,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setClientName('');
        setClientPhone('');
        setNotes('');
        loadData();
      } else {
        alert(data.error || 'Erro ao criar agendamento.');
      }
    } catch (err) {
      alert('Erro de comunicação.');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesBarber = selectedBarberId === 'ALL' || app.barberId === selectedBarberId;
    const matchesSearch =
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.clientPhone.includes(searchQuery);
    return matchesStatus && matchesBarber && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-brand-red font-bold animate-pulse">
        <Calendar className="w-6 h-6 animate-spin mr-2" />
        Carregando lista de agendamentos...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
            Gestão de <span className="text-brand-red">Agendamentos</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Filtre por barbeiro, status, altere horários e cadastre clientes presenciais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agendamento Manual
        </button>
      </div>

      {/* Barber Filter Selector Tabs */}
      <div className="bg-brand-card border border-brand-border/80 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-red" />
          <span>Agenda por Barbeiro:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedBarberId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${
              selectedBarberId === 'ALL'
                ? 'bg-brand-red text-white shadow-md'
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap flex items-center gap-2 ${
                  selectedBarberId === b.id
                    ? 'bg-brand-red text-white shadow-md'
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

      {/* Status & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-card border border-brand-border/80 p-4 rounded-2xl">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-400 uppercase shrink-0">Status:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all uppercase whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-brand-red text-white'
                    : 'bg-brand-dark text-gray-400 hover:text-white border border-brand-border/60'
                }`}
              >
                {st === 'ALL'
                  ? 'Todos'
                  : st === 'PENDING'
                  ? 'Pendentes'
                  : st === 'CONFIRMED'
                  ? 'Confirmados'
                  : st === 'COMPLETED'
                  ? 'Concluídos'
                  : 'Cancelados'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Appointments List Table & Mobile Cards */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl overflow-hidden">
        {/* Mobile View (Cards) */}
        <div className="block lg:hidden p-4 space-y-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-500 text-xs py-6">Nenhum agendamento encontrado.</p>
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
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Serviço</th>
                <th className="p-4">Barbeiro</th>
                <th className="p-4">Preço Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 font-medium">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Nenhum agendamento encontrado para este filtro.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-brand-dark/50 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {app.clientName}
                      {app.notes && <span className="block text-[11px] font-normal text-gray-400 italic">{app.notes}</span>}
                    </td>
                    <td className="p-4 text-xs font-mono">{app.clientPhone}</td>
                    <td className="p-4 text-xs">
                      <span className="font-bold text-white block">{app.date}</span>
                      <span className="text-brand-red font-semibold">{app.timeSlot}</span>
                    </td>
                    <td className="p-4">{app.service?.title || 'Serviço Barbearia'}</td>
                    <td className="p-4">{app.barber?.name || 'Geleia Barber'}</td>
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

      {/* MANUAL APPOINTMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-red/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white border-l-4 border-brand-red pl-3">
              Novo Agendamento Manual
            </h2>

            <form onSubmit={handleCreateManualAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Gabriel Santos"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(86) 99999-8888"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Horário *
                  </label>
                  <input
                    type="time"
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Serviço *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} (R$ {s.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Barbeiro *
                  </label>
                  <select
                    value={barberId}
                    onChange={(e) => setBarberId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Observações
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Atendimento presencial / Pago no Pix"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-border text-gray-300 text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-extrabold uppercase shadow-md"
                >
                  Registrar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
