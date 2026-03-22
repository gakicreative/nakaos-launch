import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, ExternalLink, Mail, Phone, MapPin, Calendar, CheckCircle2, Clock, FileText, Image as ImageIcon, Video, Palette, Type, Plus, Trash2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clients = useStore((state) => state.clients);
  const client = clients.find(c => c.id === id);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Cliente não encontrado</h2>
        <Link to="/clients" className="text-primary hover:underline">Voltar para Clientes</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'clients', client.id));
      navigate('/clients');
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Erro ao excluir cliente. Tente novamente.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link to="/clients" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Clientes
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 hover:bg-error/20 text-error transition-colors border border-error/20 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Excluindo...' : 'Excluir Cliente'}
            </button>
            <button className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors border border-surface-container-highest text-sm font-medium">
              Editar Perfil
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-surface-container-high relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-headline font-bold text-on-primary shadow-lg shadow-primary/20 z-10">
            {client.logo}
          </div>
          
          <div className="flex-1 z-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface">
                {client.name}
              </h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border",
                client.status === 'Ativo' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-surface-variant/10 text-on-surface-variant border-surface-variant/20"
              )}>
                {client.status}
              </span>
            </div>
            <p className="text-on-surface-variant mb-4 max-w-2xl">
              {client.industry}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${client.email}`} className="hover:text-primary transition-colors">{client.email}</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Retainer */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-semibold text-xl">Active Retainer</h2>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Q3 2024</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Monthly Value</span>
                <span className="text-2xl font-headline font-bold text-on-surface">$12,500</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Hours Logged</span>
                <span className="text-2xl font-headline font-bold text-on-surface">42<span className="text-sm text-on-surface-variant font-normal">/60</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Renewal Date</span>
                <span className="text-lg font-headline font-semibold text-on-surface mt-1">Oct 15, 2024</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Health Score</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[92%] rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">92</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Current Focus</h3>
              <div className="flex flex-wrap gap-2">
                {['Brand Refresh', 'Website Redesign', 'Q3 Campaign Assets', 'Social Media Templates'].map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-medium text-on-surface border border-surface-container-high">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Deliverables */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-semibold text-xl">Recent Deliverables</h2>
              <button className="text-sm text-primary hover:underline font-medium">View All</button>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Q3 Campaign Key Visuals', type: 'Image', date: '2 days ago', status: 'Approved', icon: ImageIcon },
                { title: 'Product Launch Video Storyboard', type: 'Video', date: '1 week ago', status: 'In Review', icon: Video },
                { title: 'Brand Guidelines v2.1', type: 'Document', date: '2 weeks ago', status: 'Approved', icon: FileText },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors border border-transparent hover:border-surface-container-highest group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border",
                      item.status === 'Approved' ? "bg-primary/10 text-primary border-primary/20" : "bg-tertiary/10 text-tertiary border-tertiary/20"
                    )}>
                      {item.status}
                    </span>
                    <MoreVertical className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Key Contacts */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <h2 className="font-headline font-semibold text-xl mb-6">Key Contacts</h2>
            <div className="space-y-4">
              {[
                { name: 'Sarah Jenkins', role: 'CMO', email: 'sarah@lumina.tech' },
                { name: 'David Chen', role: 'Brand Director', email: 'david@lumina.tech' },
              ].map((contact, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
                  <img src={`https://picsum.photos/seed/${contact.name}/100/100`} alt={contact.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-on-surface truncate">{contact.name}</h4>
                    <p className="text-xs text-on-surface-variant truncate">{contact.role}</p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-xl border border-dashed border-surface-container-high text-sm font-medium text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          {/* Linked Brands (Brand Hub preview) */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-semibold text-xl">Brand Assets</h2>
              <Link to="/brand-hub" className="text-sm text-primary hover:underline font-medium">Open Hub</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl bg-surface-container flex flex-col items-center justify-center gap-2 border border-surface-container-high hover:border-primary/50 transition-colors cursor-pointer group">
                <ImageIcon className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">Logos</span>
              </div>
              <div className="aspect-square rounded-2xl bg-surface-container flex flex-col items-center justify-center gap-2 border border-surface-container-high hover:border-primary/50 transition-colors cursor-pointer group">
                <Palette className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">Colors</span>
              </div>
              <div className="aspect-square rounded-2xl bg-surface-container flex flex-col items-center justify-center gap-2 border border-surface-container-high hover:border-primary/50 transition-colors cursor-pointer group">
                <Type className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">Typography</span>
              </div>
              <div className="aspect-square rounded-2xl bg-surface-container flex flex-col items-center justify-center gap-2 border border-surface-container-high hover:border-primary/50 transition-colors cursor-pointer group">
                <FileText className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary transition-colors">Guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
