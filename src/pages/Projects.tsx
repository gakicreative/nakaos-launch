import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { NewProjectModal } from '../components/modals/NewProjectModal';

export function Projects() {
  const projects = useStore((state) => state.projects);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">Projetos</h1>
          <p className="text-on-surface-variant mt-1">{projects.length} projetos</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="bg-surface-container-low border border-surface-container-high rounded-2xl p-5 hover:border-primary/50 transition-colors cursor-pointer flex flex-col gap-4 group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-lg font-bold text-on-surface group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                  {project.stage}
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${project.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' : project.status === 'Concluído' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                  {project.status}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-headline font-semibold text-on-surface text-lg">{project.name}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{project.client}</p>
            </div>
            
            <div className="mt-auto pt-4 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">Prazo: {project.dueDate}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{project.progress}%</span>
                <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full bg-surface-container-low rounded-2xl p-8 text-center border border-surface-container-high">
            <p className="text-on-surface-variant">Nenhum projeto encontrado.</p>
          </div>
        )}
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
