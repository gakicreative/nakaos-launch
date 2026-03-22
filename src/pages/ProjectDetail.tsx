import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Calendar, Clock, CheckCircle2, Users, FileText, BarChart2, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useStore((state) => state.projects);
  const project = projects.find(p => p.id === id);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Projeto não encontrado</h2>
        <Link to="/projects" className="text-primary hover:underline">Voltar para Projetos</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', project.id));
      navigate('/projects');
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Erro ao excluir projeto. Tente novamente.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-2 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-2xl font-bold text-on-surface">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-headline font-bold text-on-surface">{project.name}</h1>
              <p className="text-on-surface-variant text-sm">Cliente: {project.client}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant text-xs font-bold tracking-wider uppercase flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {project.stage}
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-2",
            project.status === 'Ativo' ? "bg-emerald-500/10 text-emerald-500" : "bg-surface-variant/10 text-on-surface-variant"
          )}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {project.status}
          </div>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-error/20 bg-error/10 rounded-xl text-error transition-colors"
            title="Excluir Projeto"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-colors">
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6">
            <h2 className="text-lg font-headline font-semibold text-on-surface mb-4">Visão Geral</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              {project.description || 'Nenhuma descrição fornecida para este projeto.'}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Início</span>
                </div>
                <p className="text-on-surface font-semibold">{project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Prazo</span>
                </div>
                <p className="text-on-surface font-semibold">{project.dueDate || '-'}</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <BarChart2 className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Progresso</span>
                </div>
                <p className="text-on-surface font-semibold">{project.progress || 0}%</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Equipe</span>
                </div>
                <p className="text-on-surface font-semibold">{project.team || 1} membros</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-on-surface">Progresso do Projeto</span>
                <span className="text-sm font-bold text-primary">{project.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Links / Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to={`/tasks/${project.id}`} className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 text-center group">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-semibold text-on-surface">Tarefas</h3>
                <p className="text-xs text-on-surface-variant mt-1">Ver quadro Kanban</p>
              </div>
            </Link>
            <Link to={`/brand-hub/${project.id}`} className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 text-center group">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-semibold text-on-surface">Brand Hub</h3>
                <p className="text-xs text-on-surface-variant mt-1">Ativos da marca</p>
              </div>
            </Link>
            <button className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 text-center group">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline font-semibold text-on-surface">Discussões</h3>
                <p className="text-xs text-on-surface-variant mt-1">Chat do projeto</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Team & Activity */}
        <div className="space-y-6">
          {/* Team */}
          <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-headline font-semibold text-on-surface">Equipe</h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                Gerenciar
              </button>
            </div>
            <p className="text-sm text-on-surface-variant text-center py-4">Equipe de {project.team || 1} pessoas alocadas.</p>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6">
            <h2 className="text-lg font-headline font-semibold text-on-surface mb-4">Atividade Recente</h2>
            <p className="text-sm text-on-surface-variant text-center py-4">Nenhuma atividade recente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
