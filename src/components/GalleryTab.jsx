import { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { uploadImage } from '../lib/storage';
import { Trash2, Plus, X } from 'lucide-react';

export const GalleryTab = ({ showNotification }) => {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) return;
    try {
      await deleteProject(id);
      showNotification('Проєкт видалено!', 'success');
      loadProjects();
    } catch (err) {
      showNotification('Помилка при видаленні проєкту: ' + err.message, 'error');
    }
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
              category: 'Житлові',
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
          <div key={project.id} className="card p-4 shadow-md rounded-lg">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.category}</p>
              <p className="text-gray-600 text-sm">{project.description}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
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

      {/* Модальне вікно */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
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
                  <option value="Житлові">Житлові</option>
                  <option value="Комерційні">Комерційні</option>
                  <option value="Громадські">Громадські</option>
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
                <label className="form-label">Головне фото (превʼю)</label>
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
                {editingProject.image_url && (
                  <img
                    src={editingProject.image_url}
                    alt="preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>

              {/* Додаткові фото */}
              <div>
                <label className="form-label">Додаткові фото (галерея)</label>
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

                <div className="flex flex-wrap gap-2 mt-2">
                  {(editingProject.images || []).map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProject({
                            ...editingProject,
                            images: editingProject.images.filter((_, idx) => idx !== i),
                          })
                        }
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
