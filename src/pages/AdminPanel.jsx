import { useState, useEffect } from 'react';
import { Lock, Eye, Trash2, Plus, BarChart3, Users, Mail, Calendar } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { getSubmissions, deleteSubmission } from '../lib/submissions';
import { uploadImage } from '../lib/storage';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') setIsAuthenticated(true);

    if (isAuthenticated) {
      loadProjects();
      loadSubmissions();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      alert('Помилка при завантаженні проєктів: ' + err.message);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      alert('Помилка при завантаженні заявок: ' + err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPassword('');
    } else {
      alert('Невірний пароль!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();

    if (!editingProject.image_url) {
      alert('Будь ласка, завантажте зображення проекту');
      return;
    }

    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
      } else {
        await addProject(editingProject);
      }
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      alert('Помилка при збереженні проекту: ' + err.message);
    }
  };

  const handleDeleteProjectClick = async (projectId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) return;
    try {
      await deleteProject(projectId);
      loadProjects();
    } catch (err) {
      alert('Помилка при видаленні проекту: ' + err.message);
    }
  };

  const handleDeleteSubmissionClick = async (submissionId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю заявку?')) return;
    try {
      await deleteSubmission(submissionId);
      loadSubmissions();
    } catch (err) {
      alert('Помилка при видаленні заявки: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900">Адмін Панель</h2>
            <p className="text-gray-600">Введіть пароль для доступу</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Введіть пароль"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Логін</button>
          </form>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800"><strong>Demo Password:</strong> admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
                    <Mail className="inline mr-2" size={20} /> Заявки з контактної форми
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
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsTab submissions={submissions} handleDeleteSubmissionClick={handleDeleteSubmissionClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

// --- Components for readability ---

const DashboardTab = ({ projects, submissions }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Панель керування</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Всього проєктів" value={projects.length} icon={<Eye size={32} className="text-blue-600" />} />
      <Card title="Заявки з контактної форми" value={submissions.length} icon={<Mail size={32} className="text-green-600" />} />
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

const GalleryTab = ({ projects, editingProject, setEditingProject, handleSaveProject, handleDeleteProjectClick }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Управління галереєю</h2>
      <button
        onClick={() => setEditingProject({ title: '', category: 'residential', image_url: '', description: '', date: new Date().toISOString().split('T')[0] })}
        className="btn btn-primary"
      >
        <Plus className="mr-2" size={20} /> Додати проєкт
      </button>
    </div>

    {/* Модальне вікно */}
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
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Категорія</label>
                <select
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
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
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const url = await uploadImage(file);
                        setEditingProject({ ...editingProject, image_url: url });
                      } catch (err) {
                        alert('Помилка при завантаженні зображення: ' + err.message);
                      }
                    }
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Дата</label>
                <input
                  type="date"
                  value={editingProject.date}
                  onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Опис</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="form-input"
                rows="3"
                required
              />
            </div>

            <div className="flex space-x-4 mt-4">
              <button type="submit" className="btn btn-primary">{editingProject.id ? 'Оновити' : 'Додати'} Проєкт</button>
              <button type="button" onClick={() => setEditingProject(null)} className="btn btn-outline">Скасувати</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Сітка проєктів */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="card overflow-hidden">
          <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{project.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">{project.category}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            <div className="flex space-x-2">
              <button onClick={() => setEditingProject(project)} className="btn btn-outline text-sm px-3 py-1">Редагувати</button>
              <button onClick={() => handleDeleteProjectClick(project.id)} className="btn bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


const SubmissionsTab = ({ submissions, handleDeleteSubmissionClick }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Заявки</h2>
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <div className="card p-8 text-center">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Заявок ще немає.</p>
        </div>
      ) : (
        submissions.reverse().map((submission) => (
          <div key={submission.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                <p className="text-gray-600">{new Date(submission.timestamp).toLocaleDateString()} at {new Date(submission.timestamp).toLocaleTimeString()}</p>
              </div>
              <button onClick={() => handleDeleteSubmissionClick(submission.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><strong>Номер телефону:</strong> {submission.phone}</div>
              <div><strong>Email:</strong> {submission.email}</div>
            </div>
            <div>
              <strong>Деталі проєкту:</strong>
              <p className="text-gray-700 mt-2 p-4 bg-gray-50 rounded-lg">{submission.project_details}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
