import { useState, useEffect } from 'react';
import { Lock, Eye, Trash2, Plus, Upload, BarChart3, Users, Mail, Calendar } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'residential',
    image: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Load data
    loadProjects();
    loadSubmissions();
  }, []);

  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem('galleryProjects') || '[]');
    setProjects(savedProjects);
  };

  const loadSubmissions = () => {
    const savedSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    setSubmissions(savedSubmissions);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
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

  const handleAddProject = (e) => {
    e.preventDefault();
    const project = {
      ...newProject,
      id: Date.now()
    };
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('galleryProjects', JSON.stringify(updatedProjects));
    setNewProject({
      title: '',
      category: 'residential',
      image: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project });
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id ? editingProject : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('galleryProjects', JSON.stringify(updatedProjects));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('galleryProjects', JSON.stringify(updatedProjects));
    }
  };

  const handleDeleteSubmission = (submissionId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю заявку?')) {
      const updatedSubmissions = submissions.filter(s => s.id !== submissionId);
      setSubmissions(updatedSubmissions);
      localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
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
            <button type="submit" className="btn btn-primary w-full">
              Логін
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Demo Password:</strong> admin123
            </p>
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
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
            >
              Вийти
            </button>
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
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="inline mr-2" size={20} />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Eye className="inline mr-2" size={20} />
                    Управління галереєю
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Mail className="inline mr-2" size={20} />
                    Заявки з контактної форми
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Панель керування</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Всього проєктів</p>
                        <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
                      </div>
                      <Eye className="text-blue-600" size={32} />
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Заявки з контактної форми</p>
                        <p className="text-3xl font-bold text-green-600">{submissions.length}</p>
                      </div>
                      <Mail className="text-green-600" size={32} />
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Недавні заявки</p>
                        <p className="text-3xl font-bold text-amber-600">
                          {submissions.filter(s => 
                            new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ).length}
                        </p>
                      </div>
                      <Calendar className="text-amber-600" size={32} />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Недавня активність</h3>
                  <div className="space-y-4">
                    {submissions.slice(-5).reverse().map((submission) => (
                      <div key={submission.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <Users className="text-blue-600" size={20} />
                        <div>
                          <p className="font-medium">{submission.name}</p>
                          <p className="text-sm text-gray-600">
                            Нова заявка - {new Date(submission.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Управління галереєю</h2>
                  <button 
                    onClick={() => setEditingProject({ title: '', category: 'residential', image: '', description: '', date: new Date().toISOString().split('T')[0] })}
                    className="btn btn-primary"
                  >
                    <Plus className="mr-2" size={20} />
                    Додати проєкт
                  </button>
                </div>

                {editingProject && (
                  <div className="card p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingProject.id ? 'Редагувати проєкт' : 'Добавити новий проєкт'}
                    </h3>
                    
                    <form onSubmit={editingProject.id ? handleUpdateProject : handleAddProject}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Заголовок</label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                            className="form-input"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Категорія</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                            className="form-input"
                          >
                            <option value="residential">Житлова зона</option>
                            <option value="commercial">Комерційна нерухомість</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Посилання на зображення</label>
                          <input
                            type="url"
                            value={editingProject.image}
                            onChange={(e) => setEditingProject({...editingProject, image: e.target.value})}
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Дата</label>
                          <input
                            type="date"
                            value={editingProject.date}
                            onChange={(e) => setEditingProject({...editingProject, date: e.target.value})}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Опис</label>
                        <textarea
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                          className="form-input"
                          rows="3"
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary">
                          {editingProject.id ? 'Оновити' : 'Добавити'} Проєкт
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="card overflow-hidden">
                      <img 
                        src={project.image} 
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
                            onClick={() => handleEditProject(project)}
                            className="btn btn-outline text-sm px-3 py-1"
                          >
                            Редагувати
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
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
            )}

            {activeTab === 'submissions' && (
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
                            <p className="text-gray-600">
                              {new Date(submission.timestamp).toLocaleDateString()} at {new Date(submission.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDeleteSubmission(submission.id)}
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
                            {submission.projectDetails}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;