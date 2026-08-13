'use client';

import React, { useState, useEffect } from 'react';
import { ServiceItem } from '@/lib/db';
import { Scissors, Plus, Edit2, Trash2, CheckCircle2, XCircle, Upload, Image as ImageIcon } from 'lucide-react';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [category, setCategory] = useState('Cabelo');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (srv?: ServiceItem) => {
    if (srv) {
      setEditingId(srv.id);
      setTitle(srv.title);
      setDescription(srv.description);
      setPrice(srv.price.toString());
      setDurationMinutes(srv.durationMinutes.toString());
      setCategory(srv.category);
      setImageUrl(srv.imageUrl || '');
      setActive(srv.active);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setDurationMinutes('30');
      setCategory('Cabelo');
      setImageUrl('');
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageUrl(data.url);
      } else {
        alert('Erro ao carregar imagem.');
      }
    } catch (err) {
      alert('Falha no upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Título e Preço são obrigatórios.');
      return;
    }

    const payload = {
      id: editingId,
      title,
      description,
      price,
      durationMinutes,
      category,
      imageUrl,
      active,
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert(data.error || 'Erro ao salvar serviço.');
      }
    } catch (err) {
      alert('Erro ao conectar à API.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Deseja realmente excluir este serviço do catálogo?')) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchServices();
      }
    } catch (e) {
      alert('Erro ao excluir.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-brand-red font-bold animate-pulse">
        <Scissors className="w-6 h-6 animate-spin mr-2" />
        Carregando catálogo de serviços...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-white">
            CRUD de <span className="text-brand-red">Serviços</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Cadastre, edite preços, duração e imagens dos serviços da barbearia.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 rounded-full bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Novo Serviço
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`bg-brand-card border rounded-2xl overflow-hidden p-6 flex flex-col justify-between space-y-4 relative ${
              srv.active ? 'border-brand-border/80' : 'border-red-900/30 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="h-44 w-full bg-brand-dark rounded-xl overflow-hidden relative border border-brand-border/60">
                {srv.imageUrl ? (
                  <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-brand-red text-white font-extrabold text-sm px-3 py-1 rounded-full shadow-md">
                  R$ {srv.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider bg-brand-red/10 px-2 py-0.5 rounded">
                    {srv.category}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {srv.durationMinutes} min
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{srv.title}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{srv.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
              <span className="text-xs flex items-center gap-1 font-semibold">
                {srv.active ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativo no Site
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Inativo
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(srv)}
                  className="p-2 rounded-lg bg-brand-dark hover:bg-brand-border text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-brand-red" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-red/50 rounded-3xl max-w-lg w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black uppercase text-white border-l-4 border-brand-red pl-3">
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Título do Serviço *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Corte Degradê + Barba Terapia"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="45.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Duração (Minutos)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="30"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                >
                  <option value="Cabelo">Cabelo</option>
                  <option value="Barba">Barba</option>
                  <option value="Combos">Combos</option>
                  <option value="Tratamento">Tratamento</option>
                  <option value="Acabamento">Acabamento</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva detalhes do atendimento..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              {/* Image Upload & Vercel Blob Ready */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  URL da Foto do Serviço (Vercel Blob / Unsplash)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-brand-dark border border-brand-border hover:border-brand-red text-white text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <Upload className="w-4 h-4 text-brand-red" />
                    {uploading ? 'Enviando...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-brand-red"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-gray-300 uppercase">
                  Serviço Ativo e Disponível para Agendamento
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
                  {editingId ? 'Salvar Alterações' : 'Criar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
