import { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/projects";
import { uploadImage } from "../lib/storage";
import { Trash2, Plus, X, Calendar, Search, ArrowUpDown } from "lucide-react";

export const GalleryTab = ({ showNotification, openConfirmModal }) => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [undoProject, setUndoProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      showNotification("Помилка завантаження проєктів: " + err.message, "error");
    }
  };

  const handleSave = async (project) => {
    setLoading(true);
    try {
      if (project.id) {
        await updateProject(project.id, project);
        showNotification("Проєкт оновлено!", "success");
      } else {
        await addProject(project);
        showNotification("Проєкт додано!", "success");
      }
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      showNotification("Помилка при збереженні проєкту: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const project = projects.find((p) => p.id === id);
    openConfirmModal({
      title: "Видалити проєкт?",
      message:
        "Ви впевнені, що хочете видалити цей проєкт? Цю дію не можна буде скасувати.",
      onConfirm: async (closeModal) => {
        try {
          await deleteProject(id);
          setUndoProject(project || null);
          showNotification("Проєкт видалено! Можна відновити.", "success");
          await loadProjects();
          closeModal();
        } catch (err) {
          showNotification("Помилка при видаленні проєкту: " + err.message, "error");
        }
      },
    });
  };

  const handleUndo = async () => {
    if (!undoProject) return;
    try {
      // attempt to re-create project (may need adjustments depending on your API)
      const projectToRestore = { ...undoProject };
      delete projectToRestore.id; // ensure new id is created
      await addProject(projectToRestore);
      showNotification("Проєкт відновлено!", "success");
      setUndoProject(null);
      await loadProjects();
    } catch (err) {
      showNotification("Не вдалося відновити проєкт", "error");
    }
  };

  // Фільтрація і сортування
  const filteredProjects = (projects || [])
    .filter((p) => (p.title || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold">Галерея</h2>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Пошук..."
              className="form-input pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Пошук проєктів"
            />
          </div>
          <button
            onClick={() => setSort(sort === "date-desc" ? "date-asc" : "date-desc")}
            className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
            aria-pressed={sort === "date-asc"}
            title="Перемкнути сортування за датою"
          >
            <ArrowUpDown size={16} />
            Сортувати
          </button>
          <button
            onClick={() =>
              setEditingProject({
                title: "",
                description: "",
                category: "MSD Classic",
                date: "",
                image_url: "",
                images: [],
              })
            }
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Додати проєкт
          </button>
        </div>
      </div>

      {/* Undo */}
      {undoProject && (
        <div className="bg-yellow-100 p-3 rounded flex justify-between items-center">
          <span>Видалено "{undoProject.title}".</span>
          <div className="flex gap-2">
            <button onClick={handleUndo} className="btn btn-secondary btn-sm">
              Відновити
            </button>
            <button onClick={() => setUndoProject(null)} className="btn btn-ghost btn-sm">
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Список проєктів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-60 rounded-xl" />
            ))
          : filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-52 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${
                      project.category === "MSD Premium"
                        ? "bg-purple-100 text-purple-800"
                        : project.category === "Bauf & Renolit"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {project.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/70 px-2 py-1 rounded text-gray-700 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {project.date ? new Date(project.date).toLocaleDateString() : ""}
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
        <ProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSave}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

// Форма проєкту
const ProjectForm = ({ project, onClose, onSave, showNotification }) => {
  // ensure defaults and react to prop changes
  const defaultProject = {
    title: "",
    description: "",
    category: "MSD Classic",
    date: "",
    image_url: "",
    images: [],
  };
  const [formData, setFormData] = useState({ ...defaultProject, ...(project || {}) });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData({ ...defaultProject, ...(project || {}) });
  }, [project]);

  const handleFileUpload = async (fileList, isMain = false) => {
    // fileList can be FileList or an array or single File
    const files = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    try {
      // upload in parallel
      const urls = await Promise.all(files.map((f) => uploadImage(f)));
      if (isMain) {
        setFormData((prev) => ({ ...prev, image_url: urls[0] }));
        showNotification("Головне фото завантажене!", "success");
      } else {
        setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...urls] }));
        showNotification("Додаткові фото завантажені!", "success");
      }
    } catch (err) {
      showNotification("Помилка при завантаженні фото: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveExtra = (idx) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date) {
      showNotification("Будь ласка, заповніть усі поля.", "error");
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      showNotification("Помилка при збереженні: " + (err?.message || err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Закрити">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">{formData.id ? "Редагувати проєкт" : "Новий проєкт"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Назва</label>
            <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>

          <div>
            <label className="form-label">Категорія</label>
            <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option value="MSD Classic">MSD Classic</option>
              <option value="MSD Premium">MSD Premium</option>
              <option value="Bauf & Renolit">Bauf та Renolit</option>
              <option value="Інше">Інше</option>
            </select>
          </div>

          <div>
            <label className="form-label">Опис</label>
            <textarea className="form-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div>
            <label className="form-label">Дата</label>
            <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>

          {/* Превʼю головного фото */}
          <div>
            <label className="form-label">Головне фото</label>
            {formData.image_url ? (
              <div className="mb-2">
                <img src={formData.image_url} alt="preview" className="h-32 mb-2 rounded object-cover" />
              </div>
            ) : null}
            <input type="file" accept="image/*" className="form-input" onChange={(e) => handleFileUpload(e.target.files, true)} aria-label="Головне фото" />
          </div>

          {/* Превʼю додаткових фото */}
          <div>
            <label className="form-label">Додаткові фото</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images?.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`extra-${i}`} className="h-24 w-24 object-cover rounded" />
                  <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1" onClick={() => handleRemoveExtra(i)} aria-label={`Видалити фото ${i + 1}`}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <input type="file" accept="image/*" multiple className="form-input" onChange={(e) => handleFileUpload(e.target.files, false)} aria-label="Додаткові фото" />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">Скасувати</button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? "Зберігаємо..." : uploading ? "Завантажую фото..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};