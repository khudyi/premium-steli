import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Eye, Trash2, Plus, BarChart3, Mail, Calendar } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { getSubmissions, deleteSubmission } from '../lib/submissions';
import { uploadImage } from '../lib/storage';

const AdminPanel = () => {
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
              <GalleryTab
                projects={projects}
                editingProject={editingProject}
                setEditingProject={setEditingProject}
                handleSaveProject={handleSaveProject}
                handleDeleteProjectClick={handleDeleteProjectClick}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsTab
                submissions={submissions}
                handleDeleteSubmissionClick={handleDeleteSubmissionClick}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'changePassword' && (
              <ChangePasswordTab session={session} showNotification={showNotification} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

// --- Components ---

const DashboardTab = ({ projects, submissions }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Панель керування</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Всього проєктів" value={projects.length} icon={<Eye size={32} className="text-blue-600" />} />
      <Card title="Заявки" value={submissions.length} icon={<Mail size={32} className="text-green-600" />} />
      <Card
        title="Недавні заявки"
        value={submissions.filter(s => new Date(s.timestamp) > new Date(Date.now() - 7*24*60*60*1000)).length}
        icon={<Calendar size={32} className="text-amber-600" />}
      />
    </div>
  </div>
);

const Card = ({ title, value, icon }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

// --- GalleryTab, SubmissionsTab і ChangePasswordTab залишаються такими ж, тільки передається showNotification і замість alert() викликається showNotification ---

// --- GalleryTab ---
export const GalleryTab = ({ projects, editingProject, setEditingProject, handleSaveProject, handleDeleteProjectClick, showNotification }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Управління галереєю</h2>
      <button
        onClick={() =>
          setEditingProject({
            title: '',
            category: 'residential',
            image_url: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
          })
        }
        className="btn btn-primary"
      >
        <Plus className="mr-2" size={20} /> Додати проєкт
      </button>
    </div>

    {editingProject && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingProject.id ? 'Редагувати проєкт' : 'Додати новий проєкт'}
          </h3>
          <form onSubmit={handleSaveProject}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Заголовок</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Категорія</label>
                <select
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category: e.target.value })
                  }
                  className="form-input"
                >
                  <option value="residential">Житлова зона</option>
                  <option value="commercial">Комерційна нерухомість</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Фото</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const url = await uploadImage(file);
                        setEditingProject({ ...editingProject, image_url: url });
                        showNotification('Зображення завантажено!', 'success');
                      } catch (err) {
                        showNotification('Помилка при завантаженні зображення: ' + err.message, 'error');
                      }
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Дата</label>
                <input
                  type="date"
                  value={editingProject.date}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, date: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Опис</label>
              <textarea
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, description: e.target.value })
                }
                className="form-input"
                rows="3"
                required
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button type="submit" className="btn btn-primary">
                {editingProject.id ? 'Оновити' : 'Додати'} Проєкт
              </button>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="btn btn-outline"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="card overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{project.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                {project.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProject(project)}
                className="btn btn-outline text-sm px-3 py-1"
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDeleteProjectClick(project.id)}
                className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- SubmissionsTab ---
export const SubmissionsTab = ({ submissions, handleDeleteSubmissionClick, showNotification }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Заявки</h2>
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <div className="card p-8 text-center">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Заявок ще немає.</p>
        </div>
      ) : (
        submissions
          .slice()
          .reverse()
          .map((submission) => (
            <div key={submission.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                  <p className="text-gray-600">
                    {new Date(submission.timestamp).toLocaleDateString()}{' '}
                    {new Date(submission.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleDeleteSubmissionClick(submission.id);
                    showNotification('Заявку видалено!', 'success');
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Номер телефону:</strong> {submission.phone}
                </div>
                <div>
                  <strong>Email:</strong> {submission.email}
                </div>
              </div>
              <div>
                <strong>Деталі проєкту:</strong>
                <p className="text-gray-700 mt-2 p-4 bg-gray-50 rounded-lg">
                  {submission.project_details}
                </p>
              </div>
            </div>
          ))
      )}
    </div>
  </div>
);

// --- ChangePasswordTab ---
export const ChangePasswordTab = ({ session, showNotification }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Новий пароль і підтвердження не співпадають!', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showNotification('Пароль успішно змінено!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showNotification('Помилка при зміні пароля: ' + err.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="card p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Змінити пароль</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group mb-4">
          <label className="form-label">Поточний пароль</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label">Новий пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label">Підтвердити новий пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Змінюємо...' : 'Змінити пароль'}
        </button>
      </form>
    </div>
  );
};