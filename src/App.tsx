/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientProfile } from './pages/ClientProfile';
import { Tasks } from './pages/Tasks';
import { KanbanBoard } from './pages/KanbanBoard';
import { Settings } from './pages/Settings';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { BrandHubList } from './pages/BrandHubList';
import { BrandHubDetail } from './pages/BrandHubDetail';
import { Finances } from './pages/Finances';
import { FirebaseProvider } from './components/FirebaseProvider';

export default function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:projectId" element={<KanbanBoard />} />
            <Route path="brand-hub" element={<BrandHubList />} />
            <Route path="brand-hub/:id" element={<BrandHubDetail />} />
            <Route path="finances" element={<Finances />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  );
}
