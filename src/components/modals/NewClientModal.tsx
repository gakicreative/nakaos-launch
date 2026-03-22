import React, { useState } from 'react';
import { Modal } from '../Modal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useFirebase } from '../FirebaseProvider';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
  const { user } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    status: 'Ativo' as const,
    logo: '',
    contact: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'clients'), {
        ...formData,
        logo: formData.name.charAt(0).toUpperCase() || 'C',
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      onClose();
      setFormData({
        name: '',
        industry: '',
        status: 'Ativo',
        logo: '',
        contact: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error("Error adding client: ", error);
      alert("Erro ao adicionar cliente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Nome da Empresa</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Ex: Acme Corp"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Setor / Indústria</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Ex: Tecnologia"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Contato Principal</label>
          <input
            required
            type="text"
            className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
            placeholder="Nome da pessoa"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Email</label>
            <input
              required
              type="email"
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
              placeholder="contato@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Telefone</label>
            <input
              required
              type="tel"
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-on-surface"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
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
            Adicionar Cliente
          </button>
        </div>
      </form>
    </Modal>
  );
}
