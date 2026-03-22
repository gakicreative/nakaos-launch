import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export function BrandHubList() {
  const projects = useStore((state) => state.projects);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-on-surface">Brand Hub</h1>
        <p className="text-on-surface-variant mt-1">Identidade visual e diretrizes de marca dos seus clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/brand-hub/${project.id}`}
            className={`relative overflow-hidden rounded-2xl aspect-square flex flex-col justify-between p-6 bg-gradient-to-br from-primary/20 to-surface-container-high border border-surface-container-high hover:border-primary/50 transition-all group`}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            
            <div className="relative z-10 flex justify-end">
              <div className="text-right">
                <h3 className="font-headline font-bold text-white text-xl">{project.name}</h3>
                <p className="text-white/70 text-sm">Brand Hub</p>
              </div>
            </div>

            <div className="relative z-10 bg-surface-container-low/80 backdrop-blur-md rounded-xl p-4 border border-surface-container-high">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-5 h-5 rounded-md border border-white/10 shadow-sm bg-primary" />
                <div className="w-5 h-5 rounded-md border border-white/10 shadow-sm bg-secondary" />
                <div className="w-5 h-5 rounded-md border border-white/10 shadow-sm bg-tertiary" />
              </div>
              
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="font-medium text-on-surface"><span className="text-lg font-bold mr-1">00</span> Logos</span>
                <span>3 Cores • 0 Fontes</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full bg-surface-container-low rounded-2xl p-8 text-center border border-surface-container-high">
            <p className="text-on-surface-variant">Nenhum projeto encontrado para exibir o Brand Hub.</p>
          </div>
        )}
      </div>
    </div>
  );
}
