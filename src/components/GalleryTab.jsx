import { useState, useEffect, useCallback, useMemo } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/projects";
import { Trash2, Plus, Calendar, Search, ArrowUpDown } from "lucide-react";
import { ProjectForm } from "./ProjectForm";

export const GalleryTab = ({ showNotification, openConfirmModal }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("date-desc");

  const [undoProject, setUndoProject] = useState(null);
  const [undoTimerId, setUndoTimerId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    let mounted = true;
    try {
      const data = await getProjects();
      if (mounted) setProjects(data || []);
    } catch (err) {
      showNotification("Помилка завантаження проєктів: " + (err?.message || err), "error");
    } finally {
      if (mounted) setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [showNotification]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        if (!cancelled) setProjects(data || []);
      } catch (err) {
        showNotification("Помилка завантаження проєктів: " + (err?.message || err), "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [showNotification]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const filteredProjects = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    let arr = (projects || []).filter((p) =>
      (p.title || "").toLowerCase().includes(q)
    );

    arr.sort((a, b) => {
      if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
      return 0;
    });

    return arr;
  }, [projects, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, page]);

  const handleSave = useCallback(
    async (project) => {
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
        // reload
        const data = await getProjects();
        setProjects(data || []);
      } catch (err) {
        showNotification("Помилка при збереженні проєкту: " + (err?.message || err), "error");
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  const handleDelete = useCallback(
    (id) => {
      const project = projects.find((p) => p.id === id);
      openConfirmModal({
        title: "Видалити проєкт?",
        message: "Ви впевнені, що хочете видалити цей проєкт?",
        onConfirm: async (closeModal) => {
          try {
            setDeletingId(id);
            await deleteProject(id);
            setUndoProject(project || null);

            const data = await getProjects();
            setProjects(data || []);

            showNotification("Проєкт видалено! Можна відновити.", "success");
            closeModal();

            if (undoTimerId) clearTimeout(undoTimerId);
            const t = setTimeout(() => setUndoProject(null), 6000);
            setUndoTimerId(t);
          } catch (err) {
            showNotification("Помилка при видаленні проєкту: " + (err?.message || err), "error");
          } finally {
            setDeletingId(null);
          }
        },
      });
    },
    [openConfirmModal, projects, showNotification, undoTimerId]
  );

  const handleUndo = useCallback(async () => {
    if (!undoProject) return;
    try {
      const projectToRestore = { ...undoProject };
      delete projectToRestore.id; // create new
      await addProject(projectToRestore);
      showNotification("Проєкт відновлено!", "success");
      setUndoProject(null);
      if (undoTimerId) {
        clearTimeout(undoTimerId);
        setUndoTimerId(null);
      }
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      showNotification("Не вдалося відновити проєкт", "error");
    }
  }, [undoProject, showNotification, undoTimerId]);

  useEffect(() => {
    return () => {
      if (undoTimerId) clearTimeout(undoTimerId);
    };
  }, [undoTimerId]);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Header + actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Галерея</h2>
          <span className="text-sm text-gray-500">{projects.length} проєктів</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none" aria-hidden="false">
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Пошук..."
              aria-label="Пошук проєктів"
              className="form-input pl-8 w-full text-sm sm:text-base"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSort(sort === "date-desc" ? "date-asc" : "date-desc")}
            className="btn btn-secondary flex items-center gap-2 text-sm sm:text-base"
            aria-pressed={sort === "date-asc"}
            aria-label="Перемкнути сортування за датою"
            title="Перемкнути сортування за датою"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">Сортувати</span>
          </button>

          {/* Add */}
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
            className="btn btn-primary flex items-center gap-2 text-sm sm:text-base"
            aria-label="Додати проєкт"
          >
            <Plus size={18} /> <span>Додати</span>
          </button>
        </div>
      </div>

      {/* Undo */}
      {undoProject && (
        <div className="bg-yellow-100 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-sm sm:text-base">Видалено «{undoProject.title}».</span>
          <div className="flex gap-2">
            <button onClick={handleUndo} className="btn btn-secondary btn-sm" aria-label="Відновити проєкт">
              Відновити
            </button>
            <button onClick={() => setUndoProject(null)} className="btn btn-ghost btn-sm" aria-label="Закрити повідомлення">
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-40 sm:h-48 md:h-52 xl:h-56 rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 bg-white rounded-lg text-center">
            <p className="text-lg font-medium">Нічого не знайдено</p>
            <p className="text-sm text-gray-500 mt-2">Спробуйте змінити параметри пошуку або додати новий проєкт.</p>
            <div className="mt-4 flex justify-center">
              <button onClick={() => setSearch("")} className="btn btn-secondary">Очистити пошук</button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {paginatedProjects.map((project) => (
                <article
                  key={project.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={project.image_url}
                      alt={project.title || "Проєкт"}
                      className="w-full h-40 sm:h-48 md:h-52 xl:h-56 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className={`absolute top-3 left-3 text-xs md:text-sm px-2 py-1 rounded-full ${
                        project.category === "MSD Premium"
                          ? "bg-purple-100 text-purple-800"
                          : project.category === "Bauf & Renolit"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {project.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/70 px-2 py-1 rounded text-gray-700 text-xs md:text-sm flex items-center gap-1">
                      <Calendar size={12} /> {project.date ? formatDate(project.date) : ""}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-5">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1">{project.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 p-3 sm:p-4 md:p-5 pt-0">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="px-3 py-1 text-xs sm:text-sm md:text-base rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                      aria-label={`Редагувати ${project.title}`}
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className={`px-3 py-1 text-xs sm:text-sm md:text-base rounded bg-red-100 text-red-700 hover:bg-red-200 transition flex items-center gap-1`}
                      aria-label={`Видалити ${project.title}`}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? "Видаляємо..." : <><Trash2 size={14} /> Видалити</>}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Показано {Math.min((page - 1) * PAGE_SIZE + 1, filteredProjects.length)}–{Math.min(page * PAGE_SIZE, filteredProjects.length)} з {filteredProjects.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-ghost btn-sm"
                  aria-label="Попередня сторінка"
                >
                  Попередня
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-ghost btn-sm"
                  aria-label="Наступна сторінка"
                >
                  Наступна
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project form modal */}
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