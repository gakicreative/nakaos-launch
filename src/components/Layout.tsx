import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, CheckSquare, SwatchBook, Wallet, Folder, Settings, Bell, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Users, label: 'Clientes', path: '/clients' },
  { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
  { icon: SwatchBook, label: 'Brand Hub', path: '/brand-hub' },
  { icon: Wallet, label: 'Finanças', path: '/finances' },
  { icon: Folder, label: 'Projetos', path: '/projects' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Layout() {
  const user = auth.currentUser;

  return (
    <div className="flex h-screen w-full bg-background text-on-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-surface-container-high">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-bold">
            DA
          </div>
          <span className="font-headline font-semibold text-lg tracking-tight">Digital Atelier</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-container-high">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high cursor-pointer transition-colors">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-bold">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.displayName || 'Usuário'}</span>
              <span className="text-xs text-on-surface-variant">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top App Bar (Mobile & Desktop) */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-surface-container-low">
          <div className="flex items-center gap-4 md:hidden">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline font-bold">
              DA
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full w-96 border border-surface-container-high focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search clients, tasks, or transactions..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-on-surface-variant"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full object-cover md:hidden"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-bold md:hidden">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-surface-container-high flex items-center justify-around p-3 pb-safe z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px]",
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn("px-4 py-1 rounded-full transition-colors", isActive && "bg-primary-container")}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-on-primary-container" : "")} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
