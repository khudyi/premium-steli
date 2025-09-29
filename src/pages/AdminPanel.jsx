import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Eye, BarChart3, Mail } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { getSubmissions, deleteSubmission } from '../lib/submissions';

import { GalleryTab } from '../components/GalleryTab';
import { ChangePasswordTab } from '../components/ChangePasswordTab';
import { SubmissionsTab } from '../components/SubmissionsTab';
import { DashboardTab } from '../components/DashboardTab';

export const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // слідкуємо за сесією
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // завантаження даних
  useEffect(() => {
    if (session) {
      loadProjects();
      loadSubmissions();
    }
  }, [session]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      showNotification('Помилка при завантаженні проєктів: ' + err.message, 'error');
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      showNotification('Помилка при завантаженні заявок: ' + err.message, 'error');
    }
  };

  // логін
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      showNotification('Помилка входу: ' + error.message, 'error');
    }
  };

  // вихід
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!editingProject.image_url) {
      showNotification('Будь ласка, завантажте зображення проекту', 'error');
      return;
    }
    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
        showNotification('Проєкт оновлено!', 'success');
      } else {
        await addProject(editingProject);
        showNotification('Проєкт додано!', 'success');
      }
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      showNotification('Помилка при збереженні проекту: ' + err.message, 'error');
    }
  };

  const handleDeleteProjectClick = async (projectId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) return;
    try {
      await deleteProject(projectId);
      loadProjects();
      showNotification('Проєкт видалено!', 'success');
    } catch (err) {
      showNotification('Помилка при видаленні проекту: ' + err.message, 'error');
    }
  };

  const handleDeleteSubmissionClick = async (submissionId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю заявку?')) return;
    try {
      await deleteSubmission(submissionId);
      loadSubmissions();
      showNotification('Заявку видалено!', 'success');
    } catch (err) {
      showNotification('Помилка при видаленні заявки: ' + err.message, 'error');
    }
  };

  // форма входу
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900">Адмін Панель</h2>
            <p className="text-gray-600">Увійдіть для доступу</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group mt-4">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-6">Увійти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`transition-transform transform duration-300 px-4 py-2 rounded shadow text-white ${
              n.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Адмін Панель</h1>
            <button onClick={handleLogout} className="btn btn-outline">Вийти</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="card p-6">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <BarChart3 className="inline mr-2" size={20} /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Eye className="inline mr-2" size={20} /> Управління галереєю
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Mail className="inline mr-2" size={20} /> Заявки
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('changePassword')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${activeTab === 'changePassword' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Lock className="inline mr-2" size={20} /> Змінити пароль
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'dashboard' && (
              <DashboardTab projects={projects} submissions={submissions} />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab showNotification={showNotification} />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsTab
                submissions={submissions}
                handleDeleteSubmissionClick={handleDeleteSubmissionClick}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'changePassword' && (
              <ChangePasswordTab showNotification={showNotification} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};