import { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/projects";
import { Trash2, Plus, Calendar, Search, ArrowUpDown } from "lucide-react";
import { ProjectForm } from "./ProjectForm";

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
      const projectToRestore = { ...undoProject };
      delete projectToRestore.id;
      await addProject(projectToRestore);
      showNotification("Проєкт відновлено!", "success");
      setUndoProject(null);
      await loadProjects();
    } catch (err) {
      showNotification("Не вдалося відновити проєкт", "error");
    }
  };

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
            />
          </div>
          <button
            onClick={() => setSort(sort === "date-desc" ? "date-asc" : "date-desc")}
            className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
            aria-pressed={sort === "date-asc"}
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
                date: new Date().toISOString().split("T")[0],
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