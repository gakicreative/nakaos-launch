import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { NewTaskModal } from '../components/modals/NewTaskModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Tasks() {
  const projects = useStore((state) => state.projects);
  const tasks = useStore((state) => state.tasks);
  const [expandedProject, setExpandedProject] = useState<string | null>(projects[0]?.id || null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    if (expandedProject === id) {
      setExpandedProject(null);
    } else {
      setExpandedProject(id);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) return;
    
    setDeletingTaskId(taskId);
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Erro ao excluir tarefa. Tente novamente.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const totalTasks = tasks.length;
  const urgentTasks = tasks.filter(t => t.priority === 'Urgente').length;
  const delayedTasks = 0; // Placeholder for now

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">Tarefas</h1>
          <p className="text-on-surface-variant mt-1">Selecione um projeto para visualizar as tarefas.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-primary text-on-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high">
          <h3 className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mb-1">TOTAL</h3>
          <div className="text-2xl font-headline font-bold text-on-surface">{totalTasks}</div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high">
          <h3 className="text-[10px] font-medium text-error uppercase tracking-wider mb-1">URGENTES</h3>
          <div className="text-2xl font-headline font-bold text-error">{urgentTasks}</div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high">
          <h3 className="text-[10px] font-medium text-error uppercase tracking-wider mb-1">ATRASADAS</h3>
          <div className="text-2xl font-headline font-bold text-error">{delayedTasks}</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const isExpanded = expandedProject === project.id;
          const projectTasks = tasks.filter(t => t.project === project.name);

          return (
            <div 
              key={project.id} 
              className="bg-surface-container-low rounded-2xl border border-surface-container-high overflow-hidden"
            >
              <button 
                onClick={() => toggleProject(project.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-headline font-bold text-sm">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h3 className="font-headline font-semibold text-on-surface text-sm">{project.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {projectTasks.length} tarefas • {project.client}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 mt-2">
                  <div className="pt-2">
                    {/* Tasks List */}
                    {projectTasks.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {projectTasks.map(task => (
                          <div key={task.id} className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high flex items-center justify-between group">
                            <div>
                              <p className="text-sm font-medium text-on-surface">{task.title}</p>
                              <p className="text-xs text-on-surface-variant mt-0.5">Resp: {task.assignee} • Prazo: {task.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                                task.priority === 'Urgente' ? 'bg-error/10 text-error' :
                                task.priority === 'Alta' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-surface-container-high text-on-surface-variant'
                              )}>
                                {task.priority}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteTask(task.id);
                                }}
                                disabled={deletingTaskId === task.id}
                                className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Excluir Tarefa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-surface-container-lowest rounded-xl p-6 flex items-center justify-center mb-4 border border-surface-container-high">
                        <span className="text-sm text-on-surface-variant">Nenhuma tarefa</span>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link 
                      to={`/tasks/${project.id}`}
                      className="w-full block text-center py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-semibold transition-colors text-sm"
                    >
                      Abrir Quadro Kanban
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <NewTaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
