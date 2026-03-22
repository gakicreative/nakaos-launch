import { create } from 'zustand';

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'Ativo' | 'Inativo';
  logo: string;
  contact: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Ativo' | 'Pausado' | 'Concluído';
  stage: 'Planejamento' | 'Em Andamento' | 'Revisão' | 'Finalizado';
  progress: number;
  dueDate: string;
  team: number;
  description?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  dueDate: string;
  assignee: string;
  createdAt?: string;
  comments?: number;
  attachments?: number;
  date?: string;
}

interface AppState {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  setClients: (clients: Client[]) => void;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useStore = create<AppState>((set) => ({
  clients: [],
  projects: [],
  tasks: [],
  setClients: (clients) => set({ clients }),
  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateClient: (id, client) => set((state) => ({
    clients: state.clients.map(c => c.id === id ? { ...c, ...client } : c)
  })),
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter(c => c.id !== id)
  })),
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...project } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateTask: (id, task) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...task } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  updateTaskStatus: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
  })),
}));
