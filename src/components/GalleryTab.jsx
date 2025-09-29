import { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { uploadImage } from '../lib/storage';
import { Trash2, Plus, X, Calendar } from 'lucide-react';

export const GalleryTab = ({ showNotification, openConfirmModal }) => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      showNotification('Помилка завантаження проєктів: ' + err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      showNotification('Помилка при збереженні проєкту: ' + err.message, 'error');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
  openConfirmModal({
    title: 'Видалити проєкт?',
    message: 'Ви впевнені, що хочете видалити цей проєкт? Цю дію не можна буде скасувати.',
    onConfirm: async (closeModal) => {
      try {
        await deleteProject(id);
        showNotification('Проєкт видалено!', 'success');
        loadProjects();
        closeModal();
      } catch (err) {
        showNotification('Помилка при видаленні проєкту: ' + err.message, 'error');
      }
    },
  });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Галерея</h2>
        <button
          onClick={() =>
            setEditingProject({
              title: '',
              description: '',
              category: 'MSD Classic',
              date: '',
              image_url: '',
              images: [],
            })
          }
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Додати проєкт
        </button>
      </div>

      {/* Список проєктів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="relative">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-52 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {project.category}
              </div>
              <div className="absolute top-3 right-3 bg-white/70 px-2 py-1 rounded text-gray-700 text-xs flex items-center gap-1">
                <Calendar size={12} /> {new Date(project.date).toLocaleDateString()}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
            </div>
            <div className="flex justify-end gap-2 p-4 pt-0">
              <button
                onClick={() => setEditingProject(project)}
                className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition flex items-center gap-1"
              >
                <Trash2 size={16} /> Видалити
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальне вікно редагування */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingProject.id ? 'Редагувати проєкт' : 'Новий проєкт'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Назва</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Категорія</label>
                <select
                  className="form-input"
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category: e.target.value })
                  }
                >
                  <option value="MSD Classic">MSD Classic</option>
                  <option value="MSD Premium">MSD Premium</option>
                  <option value="Bauf & Renolit">Bauf та Renolit</option>
                  <option value="Інше">Інше</option>
                </select>
              </div>
              <div>
                <label className="form-label">Опис</label>
                <textarea
                  className="form-input"
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Дата</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingProject.date}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, date: e.target.value })
                  }
                  required
                />
              </div>

              {/* Головне фото */}
              <div>
                <label className="form-label">Головне фото</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const url = await uploadImage(file);
                      setEditingProject({ ...editingProject, image_url: url });
                      showNotification('Головне фото завантажене!', 'success');
                    } catch (err) {
                      showNotification('Помилка при завантаженні фото: ' + err.message, 'error');
                    }
                  }}
                />
              </div>

              {/* Додаткові фото */}
              <div>
                <label className="form-label">Додаткові фото</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-input"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    try {
                      const urls = [];
                      for (const file of files) {
                        const url = await uploadImage(file);
                        urls.push(url);
                      }
                      setEditingProject({
                        ...editingProject,
                        images: [...(editingProject.images || []), ...urls],
                      });
                      showNotification('Додаткові фото завантажені!', 'success');
                    } catch (err) {
                      showNotification('Помилка при завантаженні фото: ' + err.message, 'error');
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn btn-secondary"
                >
                  Скасувати
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Збереження...' : 'Зберегти'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};