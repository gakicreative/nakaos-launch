import React, { useState } from 'react';
import { Modal } from '../Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useFirebase } from '../FirebaseProvider';
import { useStore } from '../../store';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTaskModal({ isOpen, onClose }: NewTaskModalProps) {
  const { user } = useFirebase();
  const projects = useStore((state) => state.projects);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    project: projects[0]?.name || '',
    status: 'todo' as const,
    priority: 'Média' as const,
    dueDate: '',
    assignee: 'Alex',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        date: formData.dueDate,
        comments: 0,
        attachments: 0,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      onClose();
      setFormData({
        title: '',
        project: projects[0]?.name || '',
        status: 'todo',
        priority: 'Média',
        dueDate: '',
        assignee: 'Alex',
      });
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Erro ao adicionar tarefa. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Título da Tarefa</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Ex: Criar wireframes da home"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Projeto</label>
          <select
            required
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Prioridade</label>
            <select
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
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
          <label className="text-sm font-medium text-on-surface-variant">Responsável</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Nome da pessoa"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
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
            Criar Tarefa
          </button>
        </div>
      </form>
    </Modal>
  );
}
