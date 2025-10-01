import { useState, useEffect, useRef } from "react";
import { uploadImage } from "../lib/storage";
import { X } from "lucide-react";

export const ProjectForm = ({ project, onClose, onSave, showNotification }) => {
  const defaultProject = {
    title: "",
    description: "",
    category: "MSD Classic",
    date: new Date().toISOString().split("T")[0],
    image_url: "",
    images: [],
  };

  const [formData, setFormData] = useState({ ...defaultProject, ...(project || {}) });
  const [status, setStatus] = useState("idle"); // idle | saving | uploading
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    setFormData({ ...defaultProject, ...(project || {}) });
    setErrors({});
  }, [project]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = async (fileList, isMain = false) => {
    const files = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
    if (!files.length) return;

    setStatus("uploading");
    try {
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
      setStatus("idle");
    }
  };

  const handleRemoveExtra = (idx) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
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
      // Надсилаємо лише URL фото, без File обʼєктів
      const projectToSave = {
        ...formData,
        image_url: formData.image_url,
        images: formData.images || [],
      };

      await onSave(projectToSave);

      setFormData({ ...defaultProject });
    } catch (err) {
      showNotification("Помилка при збереженні: " + (err?.message || err), "error");
    } finally {
      setStatus("idle");
    }
  };

  const handleDrop = (e, isMain = false) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFileUpload(files, isMain);
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto"
      ref={modalRef}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Закрити"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {formData.id ? "Редагувати проєкт" : "Новий проєкт"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Назва */}
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

          {/* Категорія */}
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

          {/* Опис */}
          <div>
            <label className="form-label">Опис</label>
            <textarea
              className={`form-input ${errors.description ? "border-red-500" : ""}`}
              value={formData.description}
              onChange={handleChange("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Дата */}
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

          {/* Головне фото */}
          <div>
            <label className="form-label">Головне фото</label>
            <div
              className="border-dashed border-2 border-gray-300 p-4 rounded text-center cursor-pointer mb-2"
              onDrop={(e) => handleDrop(e, true)}
              onDragOver={handleDragOver}
            >
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="preview"
                  className="h-32 mx-auto rounded object-cover mb-2"
                />
              ) : (
                <p>Перетягніть фото сюди або оберіть файл</p>
              )}
              <input
                type="file"
                accept="image/*"
                className="form-input w-full mt-2"
                onChange={(e) => handleFileUpload(e.target.files, true)}
              />
            </div>
          </div>

          {/* Додаткові фото */}
          <div>
            <label className="form-label">Додаткові фото</label>
            <div
              className="border-dashed border-2 border-gray-300 p-4 rounded mb-2 flex flex-wrap gap-2"
              onDrop={(e) => handleDrop(e, false)}
              onDragOver={handleDragOver}
            >
              {formData.images?.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`extra-${i}`}
                    className="h-24 w-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                    onClick={() => handleRemoveExtra(i)}
                    aria-label={`Видалити фото ${i + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-input w-full mt-2"
                onChange={(e) => handleFileUpload(e.target.files, false)}
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Скасувати
            </button>
            <button type="submit" className="btn btn-primary" disabled={status !== "idle"}>
              {status === "saving"
                ? "Зберігаємо..."
                : status === "uploading"
                ? "Завантажую фото..."
                : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};