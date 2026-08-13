'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceItem, BarberItem } from '@/lib/db';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');
  const preSelectedBarberId = searchParams.get('barberId');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);

  // Selection state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<BarberItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Available time slots generator based on operating hours:
  // Segunda: 14:30 as 19:30
  // Terça a Sábado: 08:30 as 12:30 e 14:30 as 19:30
  // Domingo: Fechado
  const getTimeSlotsForDate = (dateStr: string) => {
    if (!dateStr) return [];
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) {
      return []; // Domingo fechado
    }

    if (dayOfWeek === 1) {
      // Segunda-feira (14:30 às 19:30)
      return ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];
    }

    // Terça a Sábado (08:30 às 12:30 e 14:30 às 19:30)
    return [
      '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
      '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];
  };

  const currentAvailableSlots = getTimeSlotsForDate(selectedDate);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resServices, resBarbers] = await Promise.all([
          fetch('/api/services').then((r) => r.json()),
          fetch('/api/barbers').then((r) => r.json()),
        ]);

        if (resServices.success) {
          const activeServices = resServices.data.filter((s: ServiceItem) => s.active);
          setServices(activeServices);
          if (preSelectedServiceId) {
            const found = activeServices.find((s: ServiceItem) => s.id === preSelectedServiceId);
            if (found) setSelectedService(found);
          }
        }

        if (resBarbers.success) {
          const activeBarbers = resBarbers.data.filter((b: BarberItem) => b.active);
          setBarbers(activeBarbers);
          if (preSelectedBarberId) {
            const found = activeBarbers.find((b: BarberItem) => b.id === preSelectedBarberId);
            if (found) setSelectedBarber(found);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [preSelectedServiceId, preSelectedBarberId]);

  const handleNextFromService = (srv: ServiceItem) => {
    setSelectedService(srv);
    setStep(2);
  };

  const handleNextFromBarber = (barber: BarberItem) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTimeSlot || !clientName || !clientPhone) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientPhone,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          serviceId: selectedService.id,
          barberId: selectedBarber.id,
          totalPrice: selectedService.price,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedAppointment(data.data);
        setStep(5); // Success step
      } else {
        setErrorMessage(data.error || 'Erro ao realizar agendamento.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao salvar agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!createdAppointment || !selectedService || !selectedBarber) return '#';
    const text = `Olá, Geleia Barber Club! Gostaria de confirmar meu agendamento:\n\n` +
      `📅 Data: ${createdAppointment.date}\n` +
      `⏰ Horário: ${createdAppointment.timeSlot}\n` +
      `✂️ Serviço: ${selectedService.title}\n` +
      `💈 Barbeiro: ${selectedBarber.name}\n` +
      `💰 Valor: R$ ${selectedService.price.toFixed(2).replace('.', ',')}\n` +
      `👤 Cliente: ${createdAppointment.clientName}`;
    return `https://wa.me/5511999998888?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-brand-red font-bold animate-pulse">
            <Scissors className="w-6 h-6 animate-spin" />
            Carregando sistema de agendamento...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        {/* Progress Bar & Header */}
        <div className="space-y-6 mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Agendamento Rápido Online
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase">
            Geleia Barber <span className="text-brand-red">Club</span>
          </h1>

          {/* Stepper indicators */}
          {step < 5 && (
            <div className="flex items-center justify-center gap-2 max-w-xl mx-auto pt-4">
              {[
                { label: 'Serviço', num: 1 },
                { label: 'Barbeiro', num: 2 },
                { label: 'Data & Hora', num: 3 },
                { label: 'Confirmação', num: 4 },
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div
                    onClick={() => s.num < step && setStep(s.num as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      step === s.num
                        ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                        : step > s.num
                        ? 'bg-brand-card text-brand-red border border-brand-red/40'
                        : 'bg-brand-dark text-gray-500 border border-brand-border/40'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-[10px]">
                      {s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {idx < 3 && <div className="h-[2px] w-6 bg-brand-border" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase text-white border-l-4 border-brand-red pl-3">
                Passo 1: Selecione o Serviço
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => handleNextFromService(srv)}
                  className={`p-5 rounded-2xl bg-brand-card border transition-all cursor-pointer flex items-center gap-4 group ${
                    selectedService?.id === srv.id
                      ? 'border-brand-red bg-brand-red/10 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                      : 'border-brand-border hover:border-brand-red/60 hover:bg-brand-dark'
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-dark shrink-0 relative">
                    {srv.imageUrl ? (
                      <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted">
                        <Scissors className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider bg-brand-red/10 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-red" />
                        {srv.durationMinutes} min
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-brand-red transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{srv.description}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-brand-red font-extrabold text-lg">
                        R$ {srv.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-xs font-semibold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Selecionar <ArrowRight className="w-3.5 h-3.5 text-brand-red" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT BARBER */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Serviços
              </button>
              <h2 className="text-xl font-bold uppercase text-white border-l-4 border-brand-red pl-3">
                Passo 2: Escolha o Barbeiro
              </h2>
            </div>

            {selectedService && (
              <div className="p-4 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-gray-400">Serviço Selecionado:</span>
                  <p className="font-bold text-white">{selectedService.title}</p>
                </div>
                <span className="text-brand-red font-extrabold text-base">
                  R$ {selectedService.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => handleNextFromBarber(barber)}
                  className={`p-6 rounded-2xl bg-brand-card border text-center transition-all cursor-pointer flex flex-col items-center space-y-4 group ${
                    selectedBarber?.id === barber.id
                      ? 'border-brand-red bg-brand-red/10 shadow-[0_0_20px_rgba(220,38,38,0.25)]'
                      : 'border-brand-border hover:border-brand-red/60 hover:bg-brand-dark'
                  }`}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-red p-1 bg-brand-dark">
                    {barber.avatarUrl ? (
                      <img src={barber.avatarUrl} alt={barber.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-brand-muted">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-brand-red transition-colors">
                      {barber.name}
                    </h3>
                    <p className="text-xs text-brand-red font-medium mt-0.5">
                      {barber.specialties || 'Barbeiro Profissional'}
                    </p>
                  </div>

                  <button className="w-full py-2 rounded-xl bg-brand-black group-hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors border border-brand-border">
                    Escolher este Barbeiro
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT DATE & TIME SLOT */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Barbeiros
              </button>
              <h2 className="text-xl font-bold uppercase text-white border-l-4 border-brand-red pl-3">
                Passo 3: Data e Horário
              </h2>
            </div>

            {/* Date Input */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                Selecione o Dia do Atendimento:
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot('');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-dark border border-brand-border text-white font-semibold focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Time Slot Picker */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                Horários Disponíveis ({selectedDate}):
              </label>
              {currentAvailableSlots.length === 0 ? (
                <div className="p-6 rounded-xl bg-brand-dark border border-brand-border text-center text-brand-red font-semibold text-sm">
                  A barbearia não abre aos domingos. Por favor, escolha outro dia de segunda a sábado.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {currentAvailableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-3 rounded-xl font-extrabold text-sm transition-all border ${
                        selectedTimeSlot === slot
                          ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                          : 'bg-brand-dark text-gray-300 border-brand-border hover:border-brand-red/50 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={() => setStep(4)}
                className="px-8 py-3.5 rounded-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center gap-2"
              >
                Avançar para Seus Dados
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLIENT DETAILS & CONFIRM */}
        {step === 4 && (
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Horários
              </button>
              <h2 className="text-xl font-bold uppercase text-white border-l-4 border-brand-red pl-3">
                Passo 4: Seus Dados para Agendamento
              </h2>
            </div>

            {/* Summary Box */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-red/40 space-y-3">
              <h3 className="text-sm font-extrabold uppercase text-brand-red tracking-wider">
                Resumo do Agendamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
                <div>
                  <span className="text-gray-400 text-xs">Serviço:</span>
                  <p className="font-bold text-white">{selectedService?.title}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Barbeiro:</span>
                  <p className="font-bold text-white">{selectedBarber?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Data &amp; Horário:</span>
                  <p className="font-bold text-white">{selectedDate} às {selectedTimeSlot}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Valor Total:</span>
                  <p className="font-extrabold text-brand-red text-base">
                    R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                {errorMessage}
              </div>
            )}

            {/* Form Fields */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-red text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: (11) 99999-8888"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-red text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Observações (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Preferência por degradê baixo / cabelo crespo"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-red text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-50 text-white font-extrabold text-base tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Confirmando Agendamento...' : 'Finalizar Agendamento'}
            </button>
          </form>
        )}

        {/* STEP 5: SUCCESS TICKET */}
        {step === 5 && createdAppointment && (
          <div className="max-w-lg mx-auto text-center space-y-6 bg-brand-card border border-brand-red/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.25)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-red uppercase tracking-widest">
                Agendamento Confirmado!
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Obrigado, {createdAppointment.clientName.split(' ')[0]}!
              </h2>
              <p className="text-gray-400 text-xs">
                Seu horário está garantido na Geleia Barber Club.
              </p>
            </div>

            <div className="bg-brand-black/80 rounded-2xl p-5 border border-brand-border/60 text-left space-y-3 text-sm">
              <div className="flex justify-between border-b border-brand-border/40 pb-2">
                <span className="text-gray-400 text-xs">Código do Agendamento:</span>
                <span className="font-mono font-bold text-brand-red">{createdAppointment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Serviço:</span>
                <span className="font-bold text-white">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Barbeiro:</span>
                <span className="font-bold text-white">{selectedBarber?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Data &amp; Horário:</span>
                <span className="font-bold text-white">{createdAppointment.date} às {createdAppointment.timeSlot}</span>
              </div>
              <div className="flex justify-between border-t border-brand-border/40 pt-2">
                <span className="text-gray-400 text-xs">Valor Total:</span>
                <span className="font-extrabold text-brand-red text-base">
                  R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Enviar Comprovante via WhatsApp
              </a>

              <Link
                href="/meus-agendamentos"
                className="w-full py-3 rounded-full bg-brand-dark hover:bg-brand-border text-gray-300 font-bold text-xs uppercase tracking-wider block transition-colors border border-brand-border"
              >
                Consultar Meus Agendamentos
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-black text-white flex flex-col items-center justify-center font-bold text-brand-red animate-pulse">
          Carregando formulário de agendamento...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

