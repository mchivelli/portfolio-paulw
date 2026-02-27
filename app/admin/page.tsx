'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: { en: string; de: string };
  description: { en: string; de: string };
  longDescription: { en: string; de: string };
  tech: string[];
  image: string;
  images?: string[];
  url: string;
  liveUrl?: string;
  features?: { en: string[]; de: string[] };
  medium: { en: string; de: string };
  span?: string;
  featured?: boolean;
}

interface TimelineItem {
  id: number;
  year: string;
  role: { en: string; de: string };
  company: string;
  description: { en: string; de: string };
  tech: string[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'timeline' | 'settings'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [settings, setSettings] = useState<any>({ clickup: {}, github: { selectedRepos: [] } });
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTimeline();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  async function checkAuth() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/check`, { credentials: 'include' });
      if (res.ok) setIsAuthenticated(true);
    } catch {
      // Silent fail - admin server may not be running
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) { setLoginError('Login failed'); return; }
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch {
      setLoginError('Login failed - make sure admin server is running');
    }
  }

  async function handleLogout() {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
  }

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_BASE}/api/projects`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data);
    } catch { /* silent */ }
  }

  async function fetchTimeline() {
    try {
      const res = await fetch(`${API_BASE}/api/timeline`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setTimeline(data);
    } catch { /* silent */ }
  }

  async function fetchSettings() {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setSettings(data);
    } catch { /* silent */ }
  }

  async function fetchWorkspaces() {
    try {
      const res = await fetch(`${API_BASE}/api/clickup?list=true`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setWorkspaces(data.workspaces || []);
    } catch { /* silent */ }
  }

  async function fetchGithubRepos() {
    try {
      const res = await fetch(`${API_BASE}/api/github?list=true`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setGithubRepos(data.repos || []);
    } catch { /* silent */ }
  }

  async function saveSettings(updatedSettings: any) {
    await fetch(`${API_BASE}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedSettings),
    });
    setSettings(updatedSettings);
  }

  async function saveProject(project: Partial<Project>) {
    const method = project.id ? 'PUT' : 'POST';
    await fetch(`${API_BASE}/api/projects`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(project),
    });
    fetchProjects();
    setEditingProject(null);
    setShowProjectForm(false);
  }

  async function toggleFeatured(id: number, featured: boolean) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const featuredCount = projects.filter(p => p.featured).length;
    if (featured && featuredCount >= 4) {
      alert('You can only feature up to 4 projects. Unfeature one first.');
      return;
    }
    await fetch(`${API_BASE}/api/projects`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...project, featured }),
    });
    fetchProjects();
  }

  async function deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchProjects();
    }
  }

  async function saveTimeline(item: Partial<TimelineItem>) {
    const method = item.id ? 'PUT' : 'POST';
    await fetch(`${API_BASE}/api/timeline`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item),
    });
    fetchTimeline();
    setEditingTimeline(null);
    setShowTimelineForm(false);
  }

  async function deleteTimeline(id: number) {
    if (confirm('Are you sure you want to delete this timeline entry?')) {
      await fetch(`${API_BASE}/api/timeline/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchTimeline();
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="bg-card border border-border p-8 w-[340px]">
          <h1 className="text-foreground text-lg font-semibold mb-6 text-center tracking-wide uppercase font-mono">
            Admin
          </h1>
          {loginError && <p className="text-destructive text-sm mb-4">{loginError}</p>}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button type="submit" className="w-full py-2.5 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wide uppercase font-mono">Portfolio Admin</h1>
        <button onClick={handleLogout} className="px-4 py-1.5 text-sm border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
          Logout
        </button>
      </header>

      <nav className="border-b border-border px-6 flex gap-0">
        {(['projects', 'timeline', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'projects' && `Projects (${projects.length})`}
            {tab === 'timeline' && `Timeline (${timeline.length})`}
            {tab === 'settings' && 'Settings'}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-6xl">
        {activeTab === 'projects' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
                className="px-4 py-2 text-sm bg-accent text-accent-foreground font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                + Add Project
              </button>
            </div>

            {showProjectForm && (
              <ProjectForm
                project={editingProject}
                onSave={saveProject}
                onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
              />
            )}

            <div className="grid gap-3">
              {projects.map((project) => (
                <div key={project.id} className={`bg-card border border-border p-4 flex justify-between items-start gap-4 ${project.featured ? 'border-l-2 border-l-accent' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      {project.featured && <span className="text-accent text-xs font-mono uppercase tracking-wider">Featured</span>}
                      {project.title.en}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{project.description.en}</p>
                    <p className="text-muted-foreground/60 text-xs mt-1 font-mono">{project.tech.join(' / ')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => toggleFeatured(project.id, !project.featured)}
                      className={`px-3 py-1 text-xs border transition-colors ${project.featured ? 'border-border text-muted-foreground hover:text-foreground' : 'border-accent text-accent hover:bg-accent hover:text-accent-foreground'}`}
                    >
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => { setEditingProject(project); setShowProjectForm(true); }}
                      className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => { setEditingTimeline(null); setShowTimelineForm(true); }}
                className="px-4 py-2 text-sm bg-accent text-accent-foreground font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                + Add Entry
              </button>
            </div>

            {showTimelineForm && (
              <TimelineForm
                item={editingTimeline}
                onSave={saveTimeline}
                onCancel={() => { setShowTimelineForm(false); setEditingTimeline(null); }}
              />
            )}

            <div className="grid gap-3">
              {timeline.map((item) => (
                <div key={item.id} className="bg-card border border-border p-4 flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{item.year} &mdash; {item.role.en}</h3>
                    <p className="text-accent text-sm mt-0.5">{item.company}</p>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{item.description.en}</p>
                    <p className="text-muted-foreground/60 text-xs mt-1 font-mono">{item.tech.join(' / ')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingTimeline(item); setShowTimelineForm(true); }}
                      className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTimeline(item.id)}
                      className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            workspaces={workspaces}
            githubRepos={githubRepos}
            onSaveSettings={saveSettings}
            onLoadWorkspaces={fetchWorkspaces}
            onLoadGithubRepos={fetchGithubRepos}
          />
        )}
      </main>
    </div>
  );
}

function SettingsPanel({ settings, workspaces, githubRepos, onSaveSettings, onLoadWorkspaces, onLoadGithubRepos }: any) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  function handleSave() {
    onSaveSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleRepo(repoName: string) {
    const current = localSettings.github?.selectedRepos || [];
    const updated = current.includes(repoName)
      ? current.filter((r: string) => r !== repoName)
      : [...current, repoName];
    setLocalSettings({
      ...localSettings,
      github: { ...localSettings.github, selectedRepos: updated }
    });
  }

  return (
    <div>
      <h2 className="text-base font-semibold uppercase tracking-wider font-mono mb-6">Integration Settings</h2>

      <div className="bg-card border border-border p-5 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-1">ClickUp Workspace</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Select which ClickUp workspace to display data from
        </p>

        <button
          onClick={onLoadWorkspaces}
          className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          {workspaces.length > 0 ? 'Refresh Workspaces' : 'Load Workspaces'}
        </button>

        {workspaces.length > 0 && (
          <div className="space-y-2">
            {workspaces.map((ws: any) => (
              <label key={ws.id} className={`block px-3 py-2.5 border cursor-pointer text-sm transition-colors ${localSettings.clickup?.workspaceId === ws.id ? 'border-accent bg-accent/10 text-foreground' : 'border-border bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <input
                  type="radio"
                  name="workspace"
                  checked={localSettings.clickup?.workspaceId === ws.id}
                  onChange={() => setLocalSettings({
                    ...localSettings,
                    clickup: { workspaceId: ws.id, workspaceName: ws.name }
                  })}
                  className="mr-2 accent-accent"
                />
                {ws.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border p-5 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-1">GitHub Repositories</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Select which repositories to show in Latest Projects section (leave empty to show all)
        </p>

        <button
          onClick={onLoadGithubRepos}
          className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          {githubRepos.length > 0 ? 'Refresh Repositories' : 'Load Repositories'}
        </button>

        {githubRepos.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto">
            <div className="text-muted-foreground text-xs mb-2 font-mono">
              Selected: {localSettings.github?.selectedRepos?.length || 0} repos
            </div>
            <div className="space-y-2">
              {githubRepos.map((repo: any) => (
                <label key={repo.name} className={`flex items-start px-3 py-2.5 border cursor-pointer transition-colors ${localSettings.github?.selectedRepos?.includes(repo.name) ? 'border-accent bg-accent/10' : 'border-border bg-secondary hover:border-muted-foreground'}`}>
                  <input
                    type="checkbox"
                    checked={localSettings.github?.selectedRepos?.includes(repo.name) || false}
                    onChange={() => toggleRepo(repo.name)}
                    className="mr-3 mt-0.5 accent-accent"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{repo.name}</div>
                    {repo.description && <div className="text-muted-foreground text-xs mt-0.5">{repo.description}</div>}
                    <div className="text-muted-foreground/60 text-xs mt-0.5 font-mono">
                      {repo.language && <span>{repo.language}</span>}
                      {repo.stars > 0 && <span className="ml-3">{repo.stars} stars</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Save Settings
        </button>
        {saved && <span className="text-accent text-sm font-mono">Saved</span>}
      </div>
    </div>
  );
}

function ImageUploader({ currentPath, onImageSet, label }: { currentPath: string; onImageSet: (path: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [existingImages, setExistingImages] = useState<{ name: string; path: string; size: number }[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) onImageSet(data.path);
    } catch { /* silent */ }
    setUploading(false);
  }

  async function loadExistingImages() {
    try {
      const res = await fetch(`${API_BASE}/api/images`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setExistingImages(data);
    } catch { /* silent */ }
  }

  return (
    <div>
      {label && <label className="block text-muted-foreground text-xs mb-1">{label}</label>}
      <div className="flex gap-2 items-center">
        <input className="flex-1 px-3 py-2 border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" value={currentPath} onChange={(e) => onImageSet(e.target.value)} placeholder="/image.png" />
        <label className="px-3 py-2 bg-secondary text-secondary-foreground text-xs cursor-pointer hover:bg-muted transition-colors whitespace-nowrap">
          {uploading ? '...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        <button type="button" onClick={() => { setShowPicker(!showPicker); if (!showPicker) loadExistingImages(); }} className="px-3 py-2 border border-border text-muted-foreground text-xs hover:text-foreground transition-colors">
          Browse
        </button>
      </div>
      {currentPath && (
        <div className="mt-2 p-2 bg-secondary">
          <img src={currentPath} alt="preview" className="max-h-[80px]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      {showPicker && (
        <div className="mt-2 max-h-[200px] overflow-y-auto bg-background border border-border p-2">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
            {existingImages.map((img) => (
              <div key={img.name} onClick={() => { onImageSet(img.path); setShowPicker(false); }} className={`cursor-pointer p-1 border text-center transition-colors ${currentPath === img.path ? 'border-accent' : 'border-border hover:border-muted-foreground'}`}>
                <img src={img.path} alt={img.name} className="w-full h-[60px] object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                <div className="text-[0.65rem] text-muted-foreground mt-1 truncate">{img.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel }: { project: Project | null; onSave: (p: Partial<Project>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Project>>(project || {
    title: { en: '', de: '' },
    description: { en: '', de: '' },
    longDescription: { en: '', de: '' },
    tech: [],
    image: '',
    images: [],
    url: '',
    liveUrl: '',
    features: { en: [], de: [] },
    medium: { en: '', de: '' },
    span: 'col-span-1 row-span-1',
    featured: false
  });

  const [techInput, setTechInput] = useState(form.tech?.join(', ') || '');
  const [featuresEnInput, setFeaturesEnInput] = useState(form.features?.en?.join('\n') || '');
  const [featuresDeInput, setFeaturesDeInput] = useState(form.features?.de?.join('\n') || '');
  const [additionalImages, setAdditionalImages] = useState<string[]>(form.images || []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const techArray = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const featuresEn = featuresEnInput.split('\n').map(f => f.trim()).filter(Boolean);
    const featuresDe = featuresDeInput.split('\n').map(f => f.trim()).filter(Boolean);
    
    onSave({
      ...form,
      tech: techArray,
      images: additionalImages.length > 0 ? additionalImages : undefined,
      features: featuresEn.length > 0 || featuresDe.length > 0 ? { en: featuresEn, de: featuresDe } : undefined
    });
  }

  const inputCls = "w-full px-3 py-2 border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors mb-1";
  const labelCls = "block text-muted-foreground text-xs mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-5 mb-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider font-mono mb-4">{project ? 'Edit Project' : 'Add New Project'}</h3>
      
      <div className="mb-4">
        <label className="flex items-center gap-2 text-muted-foreground text-xs cursor-pointer">
          <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-accent" />
          Featured (show on homepage - max 4)
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Title (EN)</label>
          <input className={inputCls} value={form.title?.en || ''} onChange={(e) => setForm({ ...form, title: { ...form.title!, en: e.target.value } })} required />
        </div>
        <div>
          <label className={labelCls}>Title (DE)</label>
          <input className={inputCls} value={form.title?.de || ''} onChange={(e) => setForm({ ...form, title: { ...form.title!, de: e.target.value } })} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Short Description (EN)</label>
          <textarea className={`${inputCls} min-h-[60px]`} value={form.description?.en || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, en: e.target.value } })} required />
        </div>
        <div>
          <label className={labelCls}>Short Description (DE)</label>
          <textarea className={`${inputCls} min-h-[60px]`} value={form.description?.de || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, de: e.target.value } })} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Long Description (EN)</label>
          <textarea className={`${inputCls} min-h-[80px]`} value={form.longDescription?.en || ''} onChange={(e) => setForm({ ...form, longDescription: { ...form.longDescription!, en: e.target.value } })} required />
        </div>
        <div>
          <label className={labelCls}>Long Description (DE)</label>
          <textarea className={`${inputCls} min-h-[80px]`} value={form.longDescription?.de || ''} onChange={(e) => setForm({ ...form, longDescription: { ...form.longDescription!, de: e.target.value } })} required />
        </div>
      </div>

      <div className="mb-3">
        <label className={labelCls}>Tech Stack (comma separated)</label>
        <input className={inputCls} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, MySQL" required />
      </div>

      <div className="mb-3">
        <ImageUploader
          currentPath={form.image || ''}
          onImageSet={(path) => setForm({ ...form, image: path })}
          label="Main Image (upload or type path)"
        />
      </div>

      <div className="mb-3">
        <label className={labelCls}>Additional Images</label>
        {additionalImages.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <div className="flex-1">
              <ImageUploader
                currentPath={img}
                onImageSet={(path) => {
                  const updated = [...additionalImages];
                  updated[i] = path;
                  setAdditionalImages(updated);
                }}
                label=""
              />
            </div>
            <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))} className="px-2 py-1 text-xs border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setAdditionalImages([...additionalImages, ''])} className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground transition-colors">
          + Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>GitHub/Source URL</label>
          <input className={inputCls} value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        </div>
        <div>
          <label className={labelCls}>Live URL (optional)</label>
          <input className={inputCls} value={form.liveUrl || ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Features (EN) - one per line</label>
          <textarea className={`${inputCls} min-h-[100px]`} value={featuresEnInput} onChange={(e) => setFeaturesEnInput(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
        </div>
        <div>
          <label className={labelCls}>Features (DE) - one per line</label>
          <textarea className={`${inputCls} min-h-[100px]`} value={featuresDeInput} onChange={(e) => setFeaturesDeInput(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>Medium (EN)</label>
          <input className={inputCls} value={form.medium?.en || ''} onChange={(e) => setForm({ ...form, medium: { ...form.medium!, en: e.target.value } })} placeholder="Web App" required />
        </div>
        <div>
          <label className={labelCls}>Medium (DE)</label>
          <input className={inputCls} value={form.medium?.de || ''} onChange={(e) => setForm({ ...form, medium: { ...form.medium!, de: e.target.value } })} placeholder="Web App" required />
        </div>
        <div>
          <label className={labelCls}>Grid Span</label>
          <select className={inputCls} value={form.span || 'col-span-1 row-span-1'} onChange={(e) => setForm({ ...form, span: e.target.value })}>
            <option value="col-span-1 row-span-1">1x1</option>
            <option value="col-span-2 row-span-1">2x1</option>
            <option value="col-span-1 row-span-2">1x2</option>
            <option value="col-span-2 row-span-2">2x2</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 text-sm bg-accent text-accent-foreground font-medium uppercase tracking-wider hover:opacity-90 transition-opacity">
          Save Project
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function TimelineForm({ item, onSave, onCancel }: { item: TimelineItem | null; onSave: (t: Partial<TimelineItem>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<TimelineItem>>(item || {
    year: '',
    role: { en: '', de: '' },
    company: '',
    description: { en: '', de: '' },
    tech: []
  });

  const [techInput, setTechInput] = useState(form.tech?.join(', ') || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const techArray = techInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({ ...form, tech: techArray });
  }

  const inputCls = "w-full px-3 py-2 border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors mb-1";
  const labelCls = "block text-muted-foreground text-xs mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-5 mb-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider font-mono mb-4">{item ? 'Edit Timeline Entry' : 'Add New Timeline Entry'}</h3>
      
      <div className="grid grid-cols-[1fr_2fr] gap-4 mb-3">
        <div>
          <label className={labelCls}>Year</label>
          <input className={inputCls} value={form.year || ''} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" required />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input className={inputCls} value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Role (EN)</label>
          <input className={inputCls} value={form.role?.en || ''} onChange={(e) => setForm({ ...form, role: { ...form.role!, en: e.target.value } })} required />
        </div>
        <div>
          <label className={labelCls}>Role (DE)</label>
          <input className={inputCls} value={form.role?.de || ''} onChange={(e) => setForm({ ...form, role: { ...form.role!, de: e.target.value } })} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea className={`${inputCls} min-h-[80px]`} value={form.description?.en || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, en: e.target.value } })} required />
        </div>
        <div>
          <label className={labelCls}>Description (DE)</label>
          <textarea className={`${inputCls} min-h-[80px]`} value={form.description?.de || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, de: e.target.value } })} required />
        </div>
      </div>

      <div className="mb-4">
        <label className={labelCls}>Tech/Skills (comma separated)</label>
        <input className={inputCls} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, Leadership" required />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 text-sm bg-accent text-accent-foreground font-medium uppercase tracking-wider hover:opacity-90 transition-opacity">
          Save Entry
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
