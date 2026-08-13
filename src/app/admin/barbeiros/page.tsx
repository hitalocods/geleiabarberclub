'use client';

import React, { useState, useEffect } from 'react';
import { BarberItem } from '@/lib/db';
import { Users, Plus, Edit2, Trash2, CheckCircle2, XCircle, Upload, User, Clock, Key, Mail } from 'lucide-react';

export default function BarbersAdminPage() {
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [workingHours, setWorkingHours] = useState('Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30');
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBarbers = async () => {
    try {
      const res = await fetch('/api/barbers');
      const data = await res.json();
      if (data.success) setBarbers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleOpenModal = (b?: BarberItem) => {
    if (b) {
      setEditingId(b.id);
      setName(b.name);
      setEmail(b.email || '');
      setPassword(b.password || '123456');
      setPhone(b.phone || '');
      setBio(b.bio || '');
      setSpecialties(b.specialties || '');
      setAvatarUrl(b.avatarUrl || '');
      setWorkingHours(b.workingHours || 'Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30');
      setActive(b.active);
    } else {
      setEditingId(null);
      setName('');
      setEmail('');
      setPassword('123456');
      setPhone('');
      setBio('');
      setSpecialties('');
      setAvatarUrl('');
      setWorkingHours('Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30');
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.url);
      } else {
        alert('Erro no upload.');
      }
    } catch (err) {
      alert('Falha ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Nome do barbeiro é obrigatório.');
      return;
    }

    const payload = {
      id: editingId,
      name,
      email,
      password,
      phone,
      bio,
      specialties,
      avatarUrl,
      workingHours,
      active,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/barbers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchBarbers();
      } else {
        alert(data.error || 'Erro ao salvar barbeiro.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const handleDeleteBarber = async (id: string) => {
    if (!confirm('Deseja realmente remover este barbeiro?')) return;
    try {
      const res = await fetch(`/api/barbers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBarbers();
      }
    } catch (e) {
      alert('Erro ao excluir.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-brand-red font-bold animate-pulse">
        <Users className="w-6 h-6 animate-spin mr-2" />
        Carregando lista de barbeiros...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
            CRUD de <span className="text-brand-red">Barbeiros &amp; Credenciais</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Cadastre os profissionais, fotos, especialidades e e-mail/senha para acesso individual.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Novo Barbeiro
        </button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((b) => (
          <div
            key={b.id}
            className={`bg-brand-card border rounded-2xl p-6 text-center space-y-4 relative flex flex-col justify-between ${
              b.active ? 'border-brand-border/80' : 'border-red-900/30 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-brand-red p-1 bg-brand-dark shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                {b.avatarUrl ? (
                  <img src={b.avatarUrl} alt={b.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-brand-muted">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{b.name}</h3>
                <p className="text-xs text-brand-red font-semibold uppercase mt-0.5">
                  {b.specialties || 'Degradê & Barba'}
                </p>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {b.bio || 'Sem biografia informada.'}
                </p>
              </div>

              {/* Email & Login Info */}
              <div className="p-3 rounded-xl bg-brand-dark border border-brand-border/60 text-left space-y-1 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span className="truncate">{b.email || `${b.name.toLowerCase().replace(/\s+/g, '')}@barber.com`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Key className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>Senha: {b.password || '123456'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold">
                {b.active ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Inativo
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(b)}
                  className="p-2 rounded-lg bg-brand-dark hover:bg-brand-border text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-brand-red" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteBarber(b.id)}
                  className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT BARBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-red/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white border-l-4 border-brand-red pl-3">
              {editingId ? 'Editar Barbeiro' : 'Novo Barbeiro'}
            </h2>

            <form onSubmit={handleSaveBarber} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Nome do Barbeiro *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Geleia Barber"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    E-mail de Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: geleia@barber.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Senha de Acesso *
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(86) 99999-8888"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Horário de Trabalho
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="Seg: 14:30-19:30 | Ter-Sáb: 08:30-19:30"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Especialidades
                </label>
                <input
                  type="text"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="Ex: Degradê Navalhado, Freestyles, Pigmentação"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Biografia / Apresentação
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Resumo da trajetória profissional..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Foto de Perfil (Vercel Blob / URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border hover:border-brand-red text-white text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4 text-brand-red" />
                    {uploading ? 'Enviando...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeBarberCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-brand-red"
                />
                <label htmlFor="activeBarberCheck" className="text-xs font-bold text-gray-300 uppercase">
                  Barbeiro Ativo e Disponível para Agendamento
                </label>
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
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Barbeiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
