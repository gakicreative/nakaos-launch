import React, { useState } from 'react';
import { Modal } from '../Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useFirebase } from '../FirebaseProvider';
import { useStore } from '../../store';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const { user } = useFirebase();
  const clients = useStore((state) => state.clients);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    client: clients[0]?.name || '',
    status: 'Em Andamento' as const,
    stage: 'Planejamento' as const,
    dueDate: '',
    team: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        progress: 0,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      onClose();
      setFormData({
        name: '',
        client: clients[0]?.name || '',
        status: 'Em Andamento',
        stage: 'Planejamento',
        dueDate: '',
        team: 1,
      });
    } catch (error) {
      console.error("Error adding project: ", error);
      alert("Erro ao adicionar projeto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Projeto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Nome do Projeto</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Ex: Rebranding 2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Cliente</label>
          <select
            required
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Estágio</label>
            <select
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
            >
              <option value="Planejamento">Planejamento</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Revisão">Revisão</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Prazo</label>
            <input
              required
              type="date"
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Tamanho da Equipe</label>
          <input
            required
            type="number"
            min="1"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            value={formData.team}
            onChange={(e) => setFormData({ ...formData, team: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            Criar Projeto
          </button>
        </div>
      </form>
    </Modal>
  );
}
