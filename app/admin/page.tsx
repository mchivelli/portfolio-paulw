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

  const API_BASE = 'http://localhost:3001';

  async function checkAuth() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/check`, { credentials: 'include' });
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed - make sure admin server is running on port 3001');
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
      
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      setLoginError('Login failed - make sure admin server is running on port 3001');
    }
  }

  async function handleLogout() {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
  }

  async function fetchProjects() {
    const res = await fetch(`${API_BASE}/api/projects`, { credentials: 'include' });
    const data = await res.json();
    setProjects(data);
  }

  async function fetchTimeline() {
    const res = await fetch(`${API_BASE}/api/timeline`, { credentials: 'include' });
    const data = await res.json();
    setTimeline(data);
  }

  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/api/settings`, { credentials: 'include' });
    const data = await res.json();
    setSettings(data);
  }

  async function fetchWorkspaces() {
    const res = await fetch('/api/clickup?list=true');
    const data = await res.json();
    setWorkspaces(data.workspaces || []);
  }

  async function fetchGithubRepos() {
    const res = await fetch('/api/github?list=true');
    const data = await res.json();
    setGithubRepos(data.repos || []);
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
        <form onSubmit={handleLogin} style={{ background: '#222', padding: '2rem', borderRadius: '8px', width: '300px' }}>
          <h1 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
          {loginError && <p style={{ color: '#f66', marginBottom: '1rem' }}>{loginError}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Portfolio Admin</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#f44', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('projects')}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', background: activeTab === 'projects' ? '#0070f3' : '#333', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', background: activeTab === 'timeline' ? '#0070f3' : '#333', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          Timeline ({timeline.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{ padding: '0.5rem 1rem', background: activeTab === 'settings' ? '#0070f3' : '#333', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          ⚙️ Settings
        </button>
      </div>

      {activeTab === 'projects' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
              style={{ padding: '0.5rem 1rem', background: '#0a0', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
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

          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((project) => (
              <div key={project.id} style={{ background: '#222', padding: '1rem', borderRadius: '8px', borderLeft: project.featured ? '3px solid #0a0' : '3px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {project.featured && <span style={{ color: '#0a0', marginRight: '0.5rem', fontSize: '0.75rem' }}>★ FEATURED</span>}
                      {project.title.en}
                    </h3>
                    <p style={{ color: '#888', margin: '0.5rem 0' }}>{project.description.en}</p>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>Tech: {project.tech.join(', ')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => toggleFeatured(project.id, !project.featured)}
                      style={{ padding: '0.25rem 0.5rem', background: project.featured ? '#555' : '#0a0', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => { setEditingProject(project); setShowProjectForm(true); }}
                      style={{ padding: '0.25rem 0.5rem', background: '#0070f3', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#f44', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => { setEditingTimeline(null); setShowTimelineForm(true); }}
              style={{ padding: '0.5rem 1rem', background: '#0a0', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
            >
              + Add Timeline Entry
            </button>
          </div>

          {showTimelineForm && (
            <TimelineForm
              item={editingTimeline}
              onSave={saveTimeline}
              onCancel={() => { setShowTimelineForm(false); setEditingTimeline(null); }}
            />
          )}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {timeline.map((item) => (
              <div key={item.id} style={{ background: '#222', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.year} - {item.role.en}</h3>
                    <p style={{ color: '#0070f3', margin: '0.25rem 0' }}>{item.company}</p>
                    <p style={{ color: '#888', margin: '0.5rem 0' }}>{item.description.en}</p>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>Tech: {item.tech.join(', ')}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => { setEditingTimeline(item); setShowTimelineForm(true); }}
                      style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem', background: '#0070f3', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTimeline(item.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#f44', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
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
      <h2 style={{ marginTop: 0 }}>Integration Settings</h2>

      {/* ClickUp Workspace Selection */}
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#0070f3' }}>🔵 ClickUp Workspace</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Select which ClickUp workspace to display data from
        </p>
        
        <button
          onClick={onLoadWorkspaces}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', background: '#555', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          {workspaces.length > 0 ? 'Refresh Workspaces' : 'Load Workspaces'}
        </button>

        {workspaces.length > 0 && (
          <div>
            {workspaces.map((ws: any) => (
              <label key={ws.id} style={{ display: 'block', padding: '0.75rem', background: localSettings.clickup?.workspaceId === ws.id ? '#0070f3' : '#333', marginBottom: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="workspace"
                  checked={localSettings.clickup?.workspaceId === ws.id}
                  onChange={() => setLocalSettings({
                    ...localSettings,
                    clickup: { workspaceId: ws.id, workspaceName: ws.name }
                  })}
                  style={{ marginRight: '0.5rem' }}
                />
                {ws.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* GitHub Repo Selection */}
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#0070f3' }}>📦 GitHub Repositories</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Select which repositories to show in Latest Projects section (leave empty to show all)
        </p>

        <button
          onClick={onLoadGithubRepos}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', background: '#555', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          {githubRepos.length > 0 ? 'Refresh Repositories' : 'Load Repositories'}
        </button>

        {githubRepos.length > 0 && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '0.5rem', color: '#aaa', fontSize: '0.85rem' }}>
              Selected: {localSettings.github?.selectedRepos?.length || 0} repos
            </div>
            {githubRepos.map((repo: any) => (
              <label key={repo.name} style={{ display: 'flex', alignItems: 'flex-start', padding: '0.75rem', background: localSettings.github?.selectedRepos?.includes(repo.name) ? '#0070f3' : '#333', marginBottom: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localSettings.github?.selectedRepos?.includes(repo.name) || false}
                  onChange={() => toggleRepo(repo.name)}
                  style={{ marginRight: '0.75rem', marginTop: '0.25rem' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{repo.name}</div>
                  {repo.description && <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.25rem' }}>{repo.description}</div>}
                  <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {repo.language && <span>🔹 {repo.language}</span>}
                    {repo.stars > 0 && <span style={{ marginLeft: '1rem' }}>⭐ {repo.stars}</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          style={{ padding: '0.75rem 1.5rem', background: '#0a0', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
        >
          💾 Save Settings
        </button>
        {saved && <span style={{ color: '#0a0' }}>✓ Saved successfully!</span>}
      </div>
    </div>
  );
}

function ImageUploader({ currentPath, onImageSet, label }: { currentPath: string; onImageSet: (path: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [existingImages, setExistingImages] = useState<{ name: string; path: string; size: number }[]>([]);

  const API_BASE = 'http://localhost:3001';

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
      const data = await res.json();
      if (data.success) {
        onImageSet(data.path);
      }
    } catch (error) {
      console.error('Upload failed', error);
    }
    setUploading(false);
  }

  async function loadExistingImages() {
    try {
      const res = await fetch(`${API_BASE}/api/images`, { credentials: 'include' });
      const data = await res.json();
      setExistingImages(data);
    } catch (error) {
      console.error('Failed to load images');
    }
  }

  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', marginBottom: '0.5rem' };
  const labelStyle: React.CSSProperties = { display: 'block', color: '#aaa', marginBottom: '0.25rem', fontSize: '0.85rem' };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input style={{ ...inputStyle, flex: 1 }} value={currentPath} onChange={(e) => onImageSet(e.target.value)} placeholder="/image.png" />
        <label style={{ padding: '0.5rem 0.75rem', background: '#0070f3', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          {uploading ? '...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
        <button type="button" onClick={() => { setShowPicker(!showPicker); if (!showPicker) loadExistingImages(); }} style={{ padding: '0.5rem 0.75rem', background: '#555', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
          Browse
        </button>
      </div>
      {currentPath && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#2a2a2a', borderRadius: '4px' }}>
          <img src={currentPath} alt="preview" style={{ maxHeight: '80px', borderRadius: '4px' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      {showPicker && (
        <div style={{ marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto', background: '#1a1a1a', border: '1px solid #444', borderRadius: '4px', padding: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
            {existingImages.map((img) => (
              <div key={img.name} onClick={() => { onImageSet(img.path); setShowPicker(false); }} style={{ cursor: 'pointer', padding: '0.25rem', border: currentPath === img.path ? '2px solid #0070f3' : '1px solid #333', borderRadius: '4px', textAlign: 'center' }}>
                <img src={img.path} alt={img.name} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</div>
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

  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', marginBottom: '0.5rem' };
  const labelStyle: React.CSSProperties = { display: 'block', color: '#aaa', marginBottom: '0.25rem', fontSize: '0.85rem' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>{project ? 'Edit Project' : 'Add New Project'}</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: '#0a0' }} />
          Featured (show on homepage - max 4)
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Title (EN)</label>
          <input style={inputStyle} value={form.title?.en || ''} onChange={(e) => setForm({ ...form, title: { ...form.title!, en: e.target.value } })} required />
        </div>
        <div>
          <label style={labelStyle}>Title (DE)</label>
          <input style={inputStyle} value={form.title?.de || ''} onChange={(e) => setForm({ ...form, title: { ...form.title!, de: e.target.value } })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Short Description (EN)</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.description?.en || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, en: e.target.value } })} required />
        </div>
        <div>
          <label style={labelStyle}>Short Description (DE)</label>
          <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.description?.de || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, de: e.target.value } })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Long Description (EN)</label>
          <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.longDescription?.en || ''} onChange={(e) => setForm({ ...form, longDescription: { ...form.longDescription!, en: e.target.value } })} required />
        </div>
        <div>
          <label style={labelStyle}>Long Description (DE)</label>
          <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.longDescription?.de || ''} onChange={(e) => setForm({ ...form, longDescription: { ...form.longDescription!, de: e.target.value } })} required />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Tech Stack (comma separated)</label>
        <input style={inputStyle} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, MySQL" required />
      </div>

      <ImageUploader
        currentPath={form.image || ''}
        onImageSet={(path) => setForm({ ...form, image: path })}
        label="Main Image (upload or type path)"
      />

      <div style={{ marginTop: '0.5rem' }}>
        <label style={labelStyle}>Additional Images</label>
        {additionalImages.map((img, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <ImageUploader
              currentPath={img}
              onImageSet={(path) => {
                const updated = [...additionalImages];
                updated[i] = path;
                setAdditionalImages(updated);
              }}
              label=""
            />
            <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))} style={{ padding: '0.25rem 0.5rem', background: '#f44', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setAdditionalImages([...additionalImages, ''])} style={{ padding: '0.25rem 0.5rem', background: '#555', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
          + Add Image
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
        <div>
          <label style={labelStyle}>GitHub/Source URL</label>
          <input style={inputStyle} value={form.url || ''} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        </div>
        <div>
          <label style={labelStyle}>Live URL (optional)</label>
          <input style={inputStyle} value={form.liveUrl || ''} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Features (EN) - one per line</label>
          <textarea style={{ ...inputStyle, minHeight: '100px' }} value={featuresEnInput} onChange={(e) => setFeaturesEnInput(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
        </div>
        <div>
          <label style={labelStyle}>Features (DE) - one per line</label>
          <textarea style={{ ...inputStyle, minHeight: '100px' }} value={featuresDeInput} onChange={(e) => setFeaturesDeInput(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Medium (EN)</label>
          <input style={inputStyle} value={form.medium?.en || ''} onChange={(e) => setForm({ ...form, medium: { ...form.medium!, en: e.target.value } })} placeholder="Web App" required />
        </div>
        <div>
          <label style={labelStyle}>Medium (DE)</label>
          <input style={inputStyle} value={form.medium?.de || ''} onChange={(e) => setForm({ ...form, medium: { ...form.medium!, de: e.target.value } })} placeholder="Web App" required />
        </div>
        <div>
          <label style={labelStyle}>Grid Span</label>
          <select style={inputStyle} value={form.span || 'col-span-1 row-span-1'} onChange={(e) => setForm({ ...form, span: e.target.value })}>
            <option value="col-span-1 row-span-1">1x1</option>
            <option value="col-span-2 row-span-1">2x1</option>
            <option value="col-span-1 row-span-2">1x2</option>
            <option value="col-span-2 row-span-2">2x2</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0070f3', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
          Save Project
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#666', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
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

  const inputStyle = { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', marginBottom: '0.5rem' };
  const labelStyle = { display: 'block', color: '#aaa', marginBottom: '0.25rem', fontSize: '0.85rem' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>{item ? 'Edit Timeline Entry' : 'Add New Timeline Entry'}</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Year</label>
          <input style={inputStyle} value={form.year || ''} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" required />
        </div>
        <div>
          <label style={labelStyle}>Company</label>
          <input style={inputStyle} value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Role (EN)</label>
          <input style={inputStyle} value={form.role?.en || ''} onChange={(e) => setForm({ ...form, role: { ...form.role!, en: e.target.value } })} required />
        </div>
        <div>
          <label style={labelStyle}>Role (DE)</label>
          <input style={inputStyle} value={form.role?.de || ''} onChange={(e) => setForm({ ...form, role: { ...form.role!, de: e.target.value } })} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Description (EN)</label>
          <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.description?.en || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, en: e.target.value } })} required />
        </div>
        <div>
          <label style={labelStyle}>Description (DE)</label>
          <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.description?.de || ''} onChange={(e) => setForm({ ...form, description: { ...form.description!, de: e.target.value } })} required />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Tech/Skills (comma separated)</label>
        <input style={inputStyle} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Node.js, Leadership" required />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0070f3', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
          Save Entry
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#666', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
