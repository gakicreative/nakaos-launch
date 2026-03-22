import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, Plus, Edit2, ExternalLink } from 'lucide-react';
import { useStore } from '../store';

export function BrandHubDetail() {
  const { id } = useParams();
  const projects = useStore((state) => state.projects);
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div className="p-8 text-on-surface">Brand Hub não encontrado para este projeto.</div>;
  }

  // Mock data for now, as we haven't added these to the store yet
  const hub = {
    name: project.name,
    colors: [
      { name: 'Primary', hex: '#FCB004' },
      { name: 'Secondary', hex: '#33312F' },
    ],
    logos: 0,
    fonts: 0,
    identity: {
      nicho: '',
      publicoAlvo: '',
      tomDeVoz: '',
      slogan: '',
      concorrentes: '',
      restricoesVisuais: ''
    },
    figmaLink: 'https://www.figma.com/design/...',
    history: [
      { action: 'Brand Hub criado', user: 'Sistema', date: new Date().toLocaleDateString('pt-BR') },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/brand-hub" className="p-2 hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-headline font-bold text-on-surface">{hub.name}</h1>
            <p className="text-on-surface-variant text-sm">Brand Hub</p>
          </div>
        </div>
        <button className="border border-surface-container-high text-on-surface px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-surface-container-high transition-colors text-sm">
          <Download className="w-4 h-4" />
          Importar CSV
        </button>
      </div>

      {/* Logos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
            Logos <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">{hub.logos}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button className="h-32 rounded-2xl border border-dashed border-surface-container-high hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-lowest">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Nova variação</span>
          </button>
        </div>
      </section>

      {/* Paleta de Cores */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
            Paleta de Cores <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">{hub.colors.length}</span>
          </h2>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {hub.colors.map((color, idx) => (
            <div key={idx} className="rounded-2xl border border-surface-container-high overflow-hidden bg-surface-container-low flex flex-col">
              <div className="h-24 w-full" style={{ backgroundColor: color.hex }} />
              <div className="p-3">
                <p className="text-sm font-medium text-on-surface truncate">{color.name}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-on-surface-variant">
                  <span>HEX</span>
                  <span className="font-mono uppercase">{color.hex}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tipografia */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
            Tipografia <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">{hub.fonts}</span>
          </h2>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="p-8 rounded-2xl border border-dashed border-surface-container-high text-center text-on-surface-variant bg-surface-container-lowest">
          Nenhuma tipografia adicionada.
        </div>
      </section>

      {/* Identidade da Marca */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-on-surface">Identidade da Marca</h2>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <Edit2 className="w-4 h-4" /> Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(hub.identity).map(([key, value]) => (
            <div key={key} className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-low">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-sm text-on-surface">{value || '—'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Figma */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19C14.7467 19 19 23.2533 19 28.5Z" fill="#0ACF83"/>
              <path d="M0 47.5C0 52.7467 4.25329 57 9.5 57C14.7467 57 19 52.7467 19 47.5V38H9.5C4.25329 38 0 42.2533 0 47.5Z" fill="#1ABCFE"/>
              <path d="M38 9.5C38 14.7467 33.7467 19 28.5 19H19V0H28.5C33.7467 0 38 4.25329 38 9.5Z" fill="#F24E1E"/>
              <path d="M19 19H9.5C4.25329 19 0 14.7467 0 9.5C0 4.25329 4.25329 0 9.5 0H19V19Z" fill="#FF7262"/>
              <path d="M38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5Z" fill="#A259FF"/>
            </svg>
            Figma
          </h2>
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <Edit2 className="w-4 h-4" /> Editar
          </button>
        </div>
        <div className="rounded-2xl border border-surface-container-high bg-surface-container-low overflow-hidden">
          <div className="aspect-video bg-surface-container-lowest flex items-center justify-center border-b border-surface-container-high relative">
            {/* Placeholder for Figma Embed */}
            <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-on-surface-variant">
              Figma iframe placeholder
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant truncate max-w-md">{hub.figmaLink}</span>
            <a href="#" className="text-primary hover:underline flex items-center gap-1 font-medium">
              Abrir no Figma <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Histórico de Alterações */}
      <section className="space-y-4">
        <h2 className="text-lg font-headline font-semibold text-on-surface">Histórico de Alterações</h2>
        <div className="p-6 rounded-2xl border border-surface-container-high bg-surface-container-low">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-container-high before:to-transparent">
            {hub.history.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-surface-container-low bg-on-surface-variant group-[.is-active]:bg-primary text-surface-container-low shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-on-surface text-sm">{item.action}</div>
                  </div>
                  <div className="text-xs text-on-surface-variant">{item.user} • {item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
