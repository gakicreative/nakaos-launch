import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, Folder, CheckSquare, Users, Clock, AlertCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { NewTaskModal } from '../components/modals/NewTaskModal';
import { NewClientModal } from '../components/modals/NewClientModal';

export function Dashboard() {
  const projects = useStore((state) => state.projects);
  const tasks = useStore((state) => state.tasks);
  const clients = useStore((state) => state.clients);

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isClientModalOpen, setClientModalOpen] = useState(false);

  const activeProjectsCount = projects.filter(p => p.status === 'Ativo').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const activeClientsCount = clients.filter(c => c.status === 'Ativo').length;

  const urgentTasks = tasks.filter(t => t.priority === 'Urgente' || t.priority === 'Alta').slice(0, 3);
  const featuredProjects = projects.filter(p => p.status === 'Ativo').slice(0, 2);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface">
          Olá, Gaki Creative
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Aqui está o resumo do seu estúdio hoje.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Folder className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Atualizado</span>
          </div>
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface">{activeProjectsCount}</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Projetos Ativos</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">Ativas</span>
          </div>
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface">{pendingTasksCount}</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Tarefas Pendentes</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Atualizado</span>
          </div>
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface">{activeClientsCount}</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Clientes Ativos</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">+15%</span>
          </div>
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface">R$ 45k</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">Faturamento (Mês)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks & Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Tasks */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-headline font-semibold text-on-surface flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-error" />
                Tarefas Prioritárias
              </h2>
              <Link to="/tasks" className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
            </div>
            <div className="space-y-3">
              {urgentTasks.length > 0 ? urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", task.priority === 'Urgente' ? "bg-error" : "bg-primary")} />
                    <div>
                      <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    {task.dueDate}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant">Nenhuma tarefa prioritária no momento.</p>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-headline font-semibold text-on-surface">Projetos em Destaque</h2>
              <Link to="/projects" className="text-sm text-primary hover:underline font-medium">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProjects.map((project) => (
                <Link to={`/projects/${project.id}`} key={project.id} className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-lg font-bold text-on-surface group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-headline font-semibold text-on-surface truncate">{project.name}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-on-surface-variant">Progresso</span>
                      <span className="text-xs font-bold text-primary">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </Link>
              ))}
              {featuredProjects.length === 0 && (
                <p className="text-sm text-on-surface-variant col-span-2">Nenhum projeto em destaque no momento.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Finances */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <h2 className="text-lg font-headline font-semibold text-on-surface mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setProjectModalOpen(true)} className="p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-on-surface">Novo Projeto</span>
              </button>
              <button onClick={() => setTaskModalOpen(true)} className="p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-on-surface">Nova Tarefa</span>
              </button>
              <button onClick={() => setClientModalOpen(true)} className="p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-on-surface">Novo Cliente</span>
              </button>
              <button className="p-4 rounded-xl border border-surface-container-high bg-surface-container-lowest hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-center group">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-on-surface">Nova Fatura</span>
              </button>
            </div>
          </div>

          {/* Pending Invoices Mini */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-headline font-semibold text-on-surface">A Receber</h2>
              <Link to="/finances" className="text-sm text-primary hover:underline font-medium">Finanças</Link>
            </div>
            <div className="space-y-3">
              {[
                { client: 'Synara Clinic', amount: 'R$ 3.500', due: 'Hoje' },
                { client: 'Gaki USA', amount: 'R$ 8.200', due: 'Em 3 dias' },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{invoice.client}</p>
                    <p className="text-xs text-error font-medium mt-0.5">{invoice.due}</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface">{invoice.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewProjectModal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} />
      <NewTaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <NewClientModal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)} />
    </div>
  );
}
