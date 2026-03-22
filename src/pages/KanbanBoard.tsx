import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Plus, Archive, MoreHorizontal, ChevronDown, MessageSquare, Paperclip, Calendar, GripVertical, AlertCircle, X, Send, AlignLeft, MousePointerClick, Image as ImageIcon, Check, MessageSquareDashed, Type, Terminal, FolderHeart, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { NewTaskModal } from '../components/modals/NewTaskModal';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const priorityConfig = {
  'Urgente': { color: 'text-[#ffb4ab]', bg: 'bg-[#ffb4ab]/10', border: 'border-[#ffb4ab]/20', icon: AlertCircle },
  'Alta': { color: 'text-[#ffb4ab]', bg: 'bg-[#ffb4ab]/10', border: 'border-[#ffb4ab]/20', icon: AlertCircle },
  'Média': { color: 'text-[#6cd3fc]', bg: 'bg-[#6cd3fc]/10', border: 'border-[#6cd3fc]/20', icon: null },
  'Baixa': { color: 'text-[#81c784]', bg: 'bg-[#81c784]/10', border: 'border-[#81c784]/20', icon: null },
};

type Priority = keyof typeof priorityConfig;

interface Assignee {
  name: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  priority: Priority;
  date: string;
  comments: number;
  attachments: number;
  assignees: Assignee[];
  status: string;
  project: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderName: string;
  time: string;
  text?: string;
  image?: string;
  isClient?: boolean;
}

interface Pin {
  id: string;
  x: number;
  y: number;
  text: string;
  resolved: boolean;
  author: string;
}

interface ColumnData {
  title: string;
  role: string;
  color: string;
  tasks: Task[];
}

const mockUsers = {
  ana: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=ana' },
  carlos: { name: 'Carlos Santos', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  marcos: { name: 'Marcos Lima', avatar: 'https://i.pravatar.cc/150?u=marcos' },
  sofia: { name: 'Sofia Costa', avatar: 'https://i.pravatar.cc/150?u=sofia' },
};

const columnDefs = {
  todo: {
    title: 'A Fazer',
    role: 'Backlog e planejamento',
    color: 'bg-[#8d909a]',
  },
  'in-progress': {
    title: 'Em Progresso',
    role: 'Execução ativa',
    color: 'bg-[#6cd3fc]',
  },
  review: {
    title: 'Revisão',
    role: 'Aguardando aprovação',
    color: 'bg-[#ffb4ab]',
  },
  done: {
    title: 'Concluído',
    role: 'Finalizado',
    color: 'bg-[#81c784]',
  }
};

function VisualFeedbackModal({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) {
  const [pins, setPins] = useState<Pin[]>([
    { id: 'p1', x: 45, y: 30, text: 'Aumentar o contraste desta fonte', resolved: false, author: 'Cliente' }
  ]);
  const [draftPin, setDraftPin] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState('');
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('.pin-marker')) {
      return; // Clicked on an existing pin
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDraftPin({ x, y });
    setDraftText('');
    setActivePinId(null);
  };

  const saveDraftPin = () => {
    if (!draftPin || !draftText.trim()) return;
    const newPin: Pin = {
      id: Date.now().toString(),
      x: draftPin.x,
      y: draftPin.y,
      text: draftText,
      resolved: false,
      author: 'Você'
    };
    setPins([...pins, newPin]);
    setDraftPin(null);
    setDraftText('');
    setActivePinId(newPin.id);
  };

  const toggleResolve = (id: string) => {
    setPins(pins.map(p => p.id === id ? { ...p, resolved: !p.resolved } : p));
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#0a0a0a] animate-in fade-in duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#131313] border-b border-[#2a2a2a] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-[#2a2a2a] rounded-full text-[#8d909a] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-headline font-bold text-[#e5e2e1]">Feedback Visual</h2>
          <div className="px-3 py-1 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-xs text-[#8d909a] flex items-center gap-2">
            <MousePointerClick className="w-3.5 h-3.5" />
            Clique na imagem para adicionar um comentário
          </div>
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] text-[#e5e2e1] text-sm font-medium transition-colors">
          Concluir
        </button>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full pt-16">
        {/* Image Area */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-8">
          <div 
            ref={imageContainerRef}
            className="relative max-w-full max-h-full shadow-2xl cursor-crosshair"
            onClick={handleImageClick}
          >
            <img 
              src={imageUrl} 
              alt="Feedback target" 
              className="max-w-full max-h-full object-contain rounded-lg border border-[#2a2a2a]"
              referrerPolicy="no-referrer"
            />
            
            {/* Render Pins */}
            {pins.map((pin, index) => (
              <div 
                key={pin.id}
                className={cn(
                  "pin-marker absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer transition-transform hover:scale-110",
                  pin.resolved ? "bg-[#81c784] text-[#0a0a0a]" : "bg-[#ffb4ab] text-[#0a0a0a]",
                  activePinId === pin.id && "ring-4 ring-white/20"
                )}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePinId(pin.id);
                  setDraftPin(null);
                }}
              >
                {index + 1}
              </div>
            ))}

            {/* Draft Pin */}
            {draftPin && (
              <div 
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-[#b7c4ff] text-[#002682] flex items-center justify-center text-sm font-bold shadow-lg animate-bounce"
                style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}
              >
                +
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-[#131313] border-l border-[#2a2a2a] flex flex-col h-full">
          <div className="p-5 border-b border-[#2a2a2a]">
            <h3 className="font-headline font-semibold text-[#e5e2e1] flex items-center gap-2">
              <MessageSquareDashed className="w-5 h-5 text-[#8d909a]" />
              Comentários ({pins.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {draftPin && (
              <div className="bg-[#1c1c1c] border border-[#b7c4ff]/50 rounded-xl p-4 shadow-lg animate-in slide-in-from-right-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#b7c4ff] text-[#002682] flex items-center justify-center text-xs font-bold">
                    +
                  </div>
                  <span className="text-sm font-medium text-[#e5e2e1]">Novo Comentário</span>
                </div>
                <textarea
                  autoFocus
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Descreva a alteração necessária..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#b7c4ff]/50 resize-none h-24 mb-3"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setDraftPin(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8d909a] hover:bg-[#2a2a2a] transition-colors">
                    Cancelar
                  </button>
                  <button onClick={saveDraftPin} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#b7c4ff] text-[#002682] hover:bg-[#b7c4ff]/90 transition-colors">
                    Salvar
                  </button>
                </div>
              </div>
            )}

            {pins.map((pin, index) => (
              <div 
                key={pin.id}
                className={cn(
                  "bg-[#1c1c1c] border rounded-xl p-4 transition-colors cursor-pointer",
                  activePinId === pin.id ? "border-[#b7c4ff]/50" : "border-[#2a2a2a] hover:border-[#333]",
                  pin.resolved && "opacity-60"
                )}
                onClick={() => setActivePinId(pin.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      pin.resolved ? "bg-[#81c784] text-[#0a0a0a]" : "bg-[#ffb4ab] text-[#0a0a0a]"
                    )}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-[#e5e2e1]">{pin.author}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleResolve(pin.id); }}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      pin.resolved ? "bg-[#81c784]/20 text-[#81c784]" : "bg-[#2a2a2a] text-[#8d909a] hover:text-[#e5e2e1]"
                    )}
                    title={pin.resolved ? "Reabrir" : "Marcar como resolvido"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className={cn("text-sm", pin.resolved ? "text-[#8d909a] line-through" : "text-[#e5e2e1]")}>
                  {pin.text}
                </p>
              </div>
            ))}

            {pins.length === 0 && !draftPin && (
              <div className="text-center py-10 text-[#8d909a] text-sm">
                Nenhum comentário ainda. Clique na imagem para adicionar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ 
  task, 
  onClick,
  onCommentClick,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver
}: { 
  key?: string | number;
  task: Task; 
  onClick: () => void;
  onCommentClick: (e: React.MouseEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}) {
  const config = priorityConfig[task.priority];
  const Icon = config.icon;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Erro ao excluir tarefa. Tente novamente.");
      setIsDeleting(false);
    }
  };

  return (
    <div 
      id={`task-${task.id}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "task-card bg-[#1c1c1c] rounded-xl p-4 border transition-all group shadow-sm hover:shadow-md",
        isDragOver ? "border-[#b7c4ff] border-2 border-dashed opacity-80 scale-[1.02]" : "border-[#2a2a2a] hover:border-[#b7c4ff]/50",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border", config.bg, config.color, config.border)}>
          {Icon && <Icon className="w-3 h-3" />}
          {task.priority}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-[#8d909a] hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded-md transition-colors"
            title="Excluir Tarefa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-[#8d909a] hover:text-[#e5e2e1] hover:bg-[#2a2a2a] rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-[#e5e2e1] mb-4 leading-snug group-hover:text-[#b7c4ff] transition-colors">
        {task.title}
      </h4>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2 text-[#8d909a]">
          <div className="flex items-center gap-1.5 text-xs bg-[#2a2a2a]/50 px-2 py-1.5 rounded-md" title="Due Date">
            <Calendar className={cn("w-3.5 h-3.5", task.date === 'Hoje' ? 'text-[#ffb4ab]' : '')} />
            <span className={cn("font-medium", task.date === 'Hoje' ? 'text-[#ffb4ab]' : 'text-[#e5e2e1]')}>{task.date}</span>
          </div>
          
          <div 
            className="flex items-center gap-1.5 text-xs hover:text-[#b7c4ff] hover:bg-[#b7c4ff]/10 px-2 py-1.5 rounded-md cursor-pointer transition-colors" 
            title="Comments"
            onClick={onCommentClick}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium">{task.comments}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md" title="Attachments">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="font-medium">{task.attachments}</span>
          </div>
        </div>
        
        <div className="flex items-center -space-x-2">
          {task.assignees.map((assignee, i) => (
            <img 
              key={i} 
              src={assignee.avatar} 
              alt={assignee.name}
              title={assignee.name}
              className="w-7 h-7 rounded-full border-2 border-[#1c1c1c] object-cover z-10 hover:z-20 transition-transform hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ 
  title, 
  icon: Icon, 
  defaultOpen = true, 
  children,
  action
}: { 
  title: string; 
  icon: any; 
  defaultOpen?: boolean; 
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-between group cursor-pointer hover:bg-[#2a2a2a]/30 p-2 -mx-2 rounded-lg transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#8d909a]" />
          <h3 className="text-base font-semibold text-[#e5e2e1]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          <button className="text-[#8d909a] hover:text-[#e5e2e1] transition-colors p-1 rounded hover:bg-[#2a2a2a]">
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="pl-8 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function TaskModal({ task, onClose, onOpenFeedback, focusChat }: { task: Task; onClose: () => void; onOpenFeedback: (url: string) => void; focusChat?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'A', senderName: 'Ana Silva', time: 'Hoje, 10:30', text: 'Iniciei o trabalho nesta tarefa. Alguma preferência de formato?' },
    { id: 'm2', sender: 'C', senderName: 'Cliente', time: 'Hoje, 10:45', text: 'Pode ser em formato quadrado para o feed do Instagram, por favor.', isClient: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (focusChat && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [focusChat]);

  const [attachments, setAttachments] = useState<{name: string, size: string}[]>([
    { name: 'briefing_campanha.pdf', size: '2.4 MB' }
  ]);

  const handleAddAttachment = () => {
    setAttachments([...attachments, { name: `novo_anexo_${attachments.length + 1}.png`, size: '1.1 MB' }]);
  };

  if (!task) return null;
  const config = priorityConfig[task.priority];
  const Icon = config.icon;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'V',
      senderName: 'Você',
      time: 'Agora',
      text: newMessage
    }]);
    setNewMessage('');
  };

  const handleSendMockImage = () => {
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'V',
      senderName: 'Você',
      time: 'Agora',
      text: 'Aqui está a primeira versão da arte. O que acha?',
      image: 'https://picsum.photos/seed/design/800/800'
    }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1c1c1c] w-full max-w-5xl h-[85vh] rounded-2xl border border-[#2a2a2a] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Left Column: Task Details */}
        <div className="w-full md:w-3/5 h-full overflow-y-auto border-b md:border-b-0 md:border-r border-[#2a2a2a] p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border", config.bg, config.color, config.border)}>
                  {Icon && <Icon className="w-3 h-3" />}
                  {task.priority}
                </div>
                <span className="text-xs text-[#8d909a] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {task.date}
                </span>
              </div>
              <input 
                type="text" 
                defaultValue={task.title}
                className="w-full bg-transparent text-2xl font-headline font-bold text-[#e5e2e1] focus:outline-none focus:border-b border-[#b7c4ff]/50 pb-1"
              />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#2a2a2a] rounded-xl text-[#8d909a] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <CollapsibleSection 
              title="Descrição" 
              icon={AlignLeft}
              action={<button className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-xs font-medium text-[#e5e2e1] transition-colors">Editar</button>}
            >
              <textarea 
                className="w-full h-32 bg-[#131313] border border-[#2a2a2a] rounded-xl p-4 text-sm text-[#8d909a] focus:outline-none focus:border-[#b7c4ff]/50 resize-none"
                placeholder="Adicione uma descrição mais detalhada..."
                defaultValue="Detalhes da tarefa..."
              />
            </CollapsibleSection>

            <CollapsibleSection 
              title="Texto do Design" 
              icon={Type}
              action={<button className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-xs font-medium text-[#e5e2e1] transition-colors">Editar</button>}
            >
              <textarea 
                className="w-full h-24 bg-[#131313] border border-[#2a2a2a] rounded-xl p-4 text-sm text-[#8d909a] focus:outline-none focus:border-[#b7c4ff]/50 resize-none"
                placeholder="Adicione o texto/copy que deve ir na arte..."
              />
            </CollapsibleSection>

            <CollapsibleSection 
              title="Equipe Técnica" 
              icon={Terminal}
              action={<button className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-xs font-medium text-[#e5e2e1] transition-colors">Editar</button>}
            >
              <textarea 
                className="w-full h-24 bg-[#131313] border border-[#2a2a2a] rounded-xl p-4 text-sm text-[#8d909a] focus:outline-none focus:border-[#b7c4ff]/50 resize-none font-mono"
                placeholder="Notas para desenvolvedores, links de repositório, etc..."
              />
            </CollapsibleSection>

            <CollapsibleSection 
              title={`Anexos (${attachments.length})`} 
              icon={Paperclip}
              action={
                <button onClick={handleAddAttachment} className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-xs font-medium text-[#e5e2e1] transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              }
            >
              <div className="flex flex-col gap-3">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#131313] border border-[#2a2a2a] group/att">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#8d909a]">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e5e2e1]">{att.name}</p>
                        <p className="text-xs text-[#8d909a]">{att.size}</p>
                      </div>
                    </div>
                    <button className="text-[#8d909a] opacity-0 group-hover/att:opacity-100 hover:text-[#ffb4ab] transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection 
              title="Ativos de Marca" 
              icon={FolderHeart}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#131313] border border-[#2a2a2a] flex items-center gap-3 cursor-pointer hover:border-[#b7c4ff]/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#8d909a]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e5e2e1]">Logos</p>
                    <p className="text-xs text-[#8d909a]">Brand Hub</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#131313] border border-[#2a2a2a] flex items-center gap-3 cursor-pointer hover:border-[#b7c4ff]/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#8d909a]">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e5e2e1]">Tipografia</p>
                    <p className="text-xs text-[#8d909a]">Brand Hub</p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Right Column: Chat */}
        <div className="w-full md:w-2/5 h-full flex flex-col bg-[#131313]">
          <div className="p-5 border-b border-[#2a2a2a] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#8d909a]" />
            <h3 className="font-headline font-semibold text-[#e5e2e1]">Chat da Tarefa</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.isClient ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  msg.isClient ? "bg-[#b7c4ff] text-[#002682]" : "bg-[#2a2a2a] text-[#e5e2e1]"
                )}>
                  {msg.sender}
                </div>
                <div className={cn("flex flex-col", msg.isClient ? "items-end" : "items-start")}>
                  <div className={cn("flex items-baseline gap-2 mb-1", msg.isClient ? "flex-row-reverse" : "")}>
                    <span className="text-sm font-medium text-[#e5e2e1]">{msg.senderName}</span>
                    <span className="text-[10px] text-[#8d909a]">{msg.time}</span>
                  </div>
                  <div className={cn(
                    "border rounded-2xl p-3 text-sm max-w-[280px]",
                    msg.isClient 
                      ? "bg-[#b7c4ff]/10 border-[#b7c4ff]/20 text-[#b7c4ff] rounded-tr-none" 
                      : "bg-[#1c1c1c] border-[#2a2a2a] text-[#8d909a] rounded-tl-none"
                  )}>
                    {msg.text && <p>{msg.text}</p>}
                    
                    {/* Image with Feedback Overlay */}
                    {msg.image && (
                      <div className="mt-3 relative group overflow-hidden rounded-lg border border-[#2a2a2a]">
                        <img src={msg.image} alt="Anexo" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button 
                            onClick={() => onOpenFeedback(msg.image!)}
                            className="bg-[#b7c4ff] text-[#002682] px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                          >
                            <MousePointerClick className="w-4 h-4" />
                            Feedback Visual
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#2a2a2a] bg-[#1c1c1c]">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSendMockImage}
                className="p-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-[#8d909a] hover:text-[#b7c4ff] hover:border-[#b7c4ff]/50 transition-colors"
                title="Enviar Imagem (Simulação)"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <div className="relative flex-1">
                <input 
                  ref={chatInputRef}
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..." 
                  className="w-full bg-[#131313] border border-[#2a2a2a] rounded-xl py-3 pl-4 pr-12 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#b7c4ff]/50 transition-colors placeholder:text-[#8d909a]"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#b7c4ff] hover:bg-[#b7c4ff]/10 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('criacao-conteudo');
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [focusChat, setFocusChat] = useState(false);
  const [feedbackImage, setFeedbackImage] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  
  const tasks = useStore((state) => state.tasks);
  const projects = useStore((state) => state.projects);
  const project = projects.find(p => p.id === projectId);

  const [columns, setColumns] = useState<Record<string, ColumnData>>({});

  useEffect(() => {
    // Filter tasks for this project
    const projectTasks = tasks.filter(t => t.project === project?.name);
    
    // Group tasks by status
    const newColumns: Record<string, ColumnData> = {
      todo: { ...columnDefs.todo, tasks: [] },
      'in-progress': { ...columnDefs['in-progress'], tasks: [] },
      review: { ...columnDefs.review, tasks: [] },
      done: { ...columnDefs.done, tasks: [] }
    };

    projectTasks.forEach(task => {
      const status = task.status || 'todo';
      if (newColumns[status]) {
        // Map to the format expected by TaskCard
        newColumns[status].tasks.push({
          ...task,
          assignees: task.assignee ? [{ name: task.assignee, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=random` }] : [],
          date: task.dueDate || task.date || 'Sem data',
        } as Task);
      }
    });

    setColumns(newColumns);
  }, [tasks, project]);

  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{ id: string, columnId: string } | null>(null);
  const [dragOverTask, setDragOverTask] = useState<{ id: string, columnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Drag to scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const draggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    draggedRef.current = false;
    if ((e.target as HTMLElement).closest('.task-card')) return;
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    draggedRef.current = true;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    e.stopPropagation();
    draggedRef.current = true;
    setDraggedTask({ id: taskId, columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    setTimeout(() => {
      const el = document.getElementById(`task-${taskId}`);
      if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, taskId: string) => {
    e.stopPropagation();
    setDraggedTask(null);
    setDragOverTask(null);
    setDragOverColumn(null);
    const el = document.getElementById(`task-${taskId}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOverTask = (e: React.DragEvent, columnId: string, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTask?.id === taskId) return;
    setDragOverTask({ id: taskId, columnId });
    setDragOverColumn(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
    setDragOverTask(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string, targetTaskId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedTask) return;
    
    const { id: sourceId, columnId: sourceColumnId } = draggedTask;
    if (sourceId === targetTaskId) {
      setDraggedTask(null);
      setDragOverTask(null);
      setDragOverColumn(null);
      return;
    }

    // Optimistic UI update
    setColumns(prev => {
      const newColumns = { ...prev };
      const sourceColumn = { ...newColumns[sourceColumnId] };
      const targetColumn = { ...newColumns[targetColumnId] };
      
      sourceColumn.tasks = [...sourceColumn.tasks];
      targetColumn.tasks = sourceColumnId === targetColumnId ? sourceColumn.tasks : [...targetColumn.tasks];
      
      const taskIndex = sourceColumn.tasks.findIndex(t => t.id === sourceId);
      if (taskIndex === -1) return prev;
      
      const task = sourceColumn.tasks[taskIndex];
      sourceColumn.tasks.splice(taskIndex, 1);
      
      if (targetTaskId) {
        const targetIndex = targetColumn.tasks.findIndex(t => t.id === targetTaskId);
        const insertIndex = targetIndex >= 0 ? targetIndex : targetColumn.tasks.length;
        targetColumn.tasks.splice(insertIndex, 0, task);
      } else {
        targetColumn.tasks.push(task);
      }
      
      newColumns[sourceColumnId] = sourceColumn;
      newColumns[targetColumnId] = targetColumn;
      
      return newColumns;
    });
    
    setDraggedTask(null);
    setDragOverTask(null);
    setDragOverColumn(null);

    // Update Firebase
    if (sourceColumnId !== targetColumnId) {
      try {
        const taskRef = doc(db, 'tasks', sourceId);
        await updateDoc(taskRef, {
          status: targetColumnId
        });
      } catch (error) {
        console.error("Error updating task status:", error);
        // In a real app, we might want to revert the optimistic update here
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/tasks" className="p-2 rounded-full hover:bg-[#202020] text-[#8d909a] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-headline font-bold tracking-tight text-[#e5e2e1]">
                {project?.name || 'Projeto'}
              </h1>
              <p className="text-[#8d909a] text-xs mt-1">
                {tasks.filter(t => t.project === project?.name).length} tarefas • {project?.client}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#b7c4ff] hover:bg-[#b7c4ff]/90 text-[#002682] font-semibold transition-colors text-sm shadow-sm shadow-[#b7c4ff]/20"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
          <button 
            onClick={() => setActiveTab('criacao-conteudo')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              activeTab === 'criacao-conteudo' 
                ? "bg-[#1a3b4a] text-[#6cd3fc] border border-[#264b5d]" 
                : "text-[#8d909a] hover:bg-[#202020]"
            )}
          >
            Criação de conteúdo <span className="ml-1 opacity-70">5</span>
          </button>
          <button 
            onClick={() => setActiveTab('geral')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              activeTab === 'geral' 
                ? "bg-[#1a3b4a] text-[#6cd3fc] border border-[#264b5d]" 
                : "text-[#8d909a] hover:bg-[#202020]"
            )}
          >
            Geral <span className="ml-1 opacity-70">0</span>
          </button>
          <button 
            onClick={() => setActiveTab('arquivadas')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              activeTab === 'arquivadas' 
                ? "bg-[#1a3b4a] text-[#6cd3fc] border border-[#264b5d]" 
                : "text-[#8d909a] hover:bg-[#202020]"
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            Arquivadas <span className="ml-1 opacity-70">2</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveFilter('Todas')}
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-full transition-colors",
                activeFilter === 'Todas' ? "bg-[#2a2a2a] text-[#e5e2e1]" : "text-[#8d909a] hover:text-[#e5e2e1]"
              )}
            >
              Todas
            </button>
            <button 
              onClick={() => setActiveFilter('Urgente')}
              className={cn("flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full transition-colors", activeFilter === 'Urgente' ? "bg-[#ffb4ab]/10 text-[#ffb4ab]" : "text-[#8d909a] hover:text-[#e5e2e1]")}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></div>
              Urgente
            </button>
            <button 
              onClick={() => setActiveFilter('Alta')}
              className={cn("flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full transition-colors", activeFilter === 'Alta' ? "bg-[#ffb4ab]/10 text-[#ffb4ab]" : "text-[#8d909a] hover:text-[#e5e2e1]")}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></div>
              Alta
            </button>
            <button 
              onClick={() => setActiveFilter('Média')}
              className={cn("flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full transition-colors", activeFilter === 'Média' ? "bg-[#6cd3fc]/10 text-[#6cd3fc]" : "text-[#8d909a] hover:text-[#e5e2e1]")}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#6cd3fc]"></div>
              Média
            </button>
            <button 
              onClick={() => setActiveFilter('Baixa')}
              className={cn("flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full transition-colors", activeFilter === 'Baixa' ? "bg-[#81c784]/10 text-[#81c784]" : "text-[#8d909a] hover:text-[#e5e2e1]")}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#81c784]"></div>
              Baixa
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] text-xs font-medium text-[#8d909a] hover:text-[#e5e2e1] transition-colors ml-auto">
            Todas as tags
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Kanban Columns */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          "flex-1 flex gap-6 overflow-x-auto pb-4 items-start scrollbar-hide",
          isDragging ? "cursor-grabbing select-none" : ""
        )}
      >
        {Object.entries(columns).map(([key, column]: [string, ColumnData]) => (
          <div 
            key={key} 
            className={cn(
              "flex-shrink-0 w-[320px] flex flex-col gap-3 rounded-2xl transition-colors p-1",
              dragOverColumn === key ? "bg-[#2a2a2a]/30" : ""
            )}
            onDragOver={(e) => handleDragOverColumn(e, key)}
            onDrop={(e) => handleDrop(e, key)}
          >
            <div className="flex items-start justify-between px-1 mb-2">
              <div className="flex items-start gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", column.color)} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-semibold text-sm text-[#e5e2e1]">{column.title}</h3>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#2a2a2a] text-[10px] font-medium text-[#8d909a]">
                      {column.tasks.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8d909a] mt-0.5">{column.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#202020] text-[#8d909a] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[#202020] text-[#8d909a] transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 min-h-[150px]">
              {column.tasks
                .filter(task => activeFilter === 'Todas' || task.priority === activeFilter)
                .map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => {
                    if (!draggedRef.current) setSelectedTask(task);
                  }}
                  onCommentClick={(e) => {
                    e.stopPropagation();
                    if (!draggedRef.current) {
                      setSelectedTask(task);
                      setFocusChat(true);
                    }
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, key)}
                  onDragEnd={(e) => handleDragEnd(e, task.id)}
                  onDragOver={(e) => handleDragOverTask(e, key, task.id)}
                  onDrop={(e) => handleDrop(e, key, task.id)}
                  isDragOver={dragOverTask?.id === task.id}
                />
              ))}
              {column.tasks.filter(task => activeFilter === 'Todas' || task.priority === activeFilter).length === 0 && (
                <div className="flex-1 border-2 border-dashed border-[#2a2a2a] rounded-xl flex items-center justify-center text-xs text-[#8d909a] p-4 text-center pointer-events-none">
                  Nenhuma tarefa {activeFilter !== 'Todas' ? `com prioridade ${activeFilter}` : 'nesta coluna'}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Nova Coluna */}
        <div className="flex-shrink-0 w-[320px]">
          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-[#2a2a2a] hover:border-[#b7c4ff]/50 hover:bg-[#b7c4ff]/5 text-[#8d909a] hover:text-[#b7c4ff] transition-all flex items-center justify-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" />
            Nova Coluna
          </button>
        </div>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => { setSelectedTask(null); setFocusChat(false); }} 
          onOpenFeedback={(url) => setFeedbackImage(url)}
          focusChat={focusChat}
        />
      )}

      {feedbackImage && (
        <VisualFeedbackModal 
          imageUrl={feedbackImage} 
          onClose={() => setFeedbackImage(null)} 
        />
      )}

      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)} 
      />
    </div>
  );
}
