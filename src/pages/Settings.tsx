import React from 'react';
import { User, Palette, Shield, Key, Bell, Globe, Monitor, Moon, Sun, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

export function Settings() {
  const user = auth.currentUser;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface">
          System Configuration
        </h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <nav className="space-y-2 md:col-span-1">
          {[
            { icon: User, label: 'Profile Identity', active: true },
            { icon: Palette, label: 'Visual Environment', active: false },
            { icon: Shield, label: 'Permissions & Access', active: false },
            { icon: Key, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Globe, label: 'Localization', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                item.active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Identity */}
          <section className="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-surface-container-high">
            <h2 className="font-headline font-semibold text-xl mb-6">Profile Identity</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="relative group">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-surface-container-low bg-surface-container-highest flex items-center justify-center text-3xl text-on-surface font-bold">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                  Change
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-on-surface">Profile Picture</h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Recommended size is 256x256px. Max file size 5MB.
                </p>
                <div className="flex gap-3 mt-3">
                  <button className="px-4 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-medium transition-colors">
                    Upload New
                  </button>
                  <button className="px-4 py-1.5 rounded-lg text-error hover:bg-error/10 text-sm font-medium transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName?.split(' ')[0] || ''}
                    className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors text-on-surface"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName?.split(' ').slice(1).join(' ') || ''}
                    className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors text-on-surface opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant">Role / Title</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors text-on-surface"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-medium transition-colors shadow-sm shadow-primary/20">
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Visual Environment (Preview) */}
          <section className="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-surface-container-high opacity-50 pointer-events-none">
            <h2 className="font-headline font-semibold text-xl mb-6">Visual Environment</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Monitor, label: 'System', active: false },
                { icon: Moon, label: 'Dark', active: true },
                { icon: Sun, label: 'Light', active: false },
              ].map((theme, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-colors",
                    theme.active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-surface-container-high bg-surface-container text-on-surface-variant"
                  )}
                >
                  <theme.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{theme.label}</span>
                  {theme.active && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-on-primary">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
