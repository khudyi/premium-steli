import { useState, useEffect, useRef } from "react";
import { ImageUploader } from "./ImageUploader";
import { X } from "lucide-react";

const defaultProject = {
  title: "",
  description: "",
  category: "MSD Classic",
  date: new Date().toISOString().split("T")[0],
  image_url: "",
  images: [],
};

export const ProjectForm = ({ project, onClose, onSave, showNotification }) => {
  const [formData, setFormData] = useState({ ...defaultProject, ...(project || {}) });
  const [status, setStatus] = useState("idle"); // idle | saving
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    setFormData({ ...defaultProject, ...(project || {}) });
    setErrors({});
  }, [project]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Назва обов'язкова";
    if (!formData.description.trim()) newErrors.description = "Опис обов'язковий";
    if (!formData.date) newErrors.date = "Дата обов'язкова";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("saving");
    try {
      const projectToSave = {
        ...formData,
        image_url: formData.image_url || "",
        images: Array.isArray(formData.images) ? formData.images : [],
      };
      await onSave(projectToSave);
      setFormData({ ...defaultProject });
    } catch (err) {
      showNotification("Помилка при збереженні: " + (err?.message || err), "error");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto" ref={modalRef}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Закрити">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {formData.id ? "Редагувати проєкт" : "Новий проєкт"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Назва</label>
            <input
              type="text"
              className={`form-input ${errors.title ? "border-red-500" : ""}`}
              value={formData.title}
              onChange={handleChange("title")}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="form-label">Категорія</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={handleChange("category")}
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
              className={`form-input ${errors.description ? "border-red-500" : ""}`}
              value={formData.description}
              onChange={handleChange("description")}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="form-label">Дата</label>
            <input
              type="date"
              className={`form-input ${errors.date ? "border-red-500" : ""}`}
              value={formData.date}
              onChange={handleChange("date")}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <ImageUploader
            label="Головне фото"
            files={formData.image_url || ""}
            setFiles={(url) => setFormData((prev) => ({ ...prev, image_url: url || "" }))}
            isMain
            showNotification={showNotification}
          />

          <ImageUploader
            label="Додаткові фото"
            files={Array.isArray(formData.images) ? formData.images : []}
            setFiles={(imgs) => setFormData((prev) => ({ ...prev, images: Array.isArray(imgs) ? imgs : [] }))}
            showNotification={showNotification}
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">Скасувати</button>
            <button type="submit" className="btn btn-primary" disabled={status !== "idle"} title={status !== "idle" ? "Будь ласка, зачекайте..." : ""}>
              {status === "saving" ? "Зберігаємо..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};