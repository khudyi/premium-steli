import { useState, useEffect } from "react";
import { uploadImage } from "../lib/storage";
import { X } from "lucide-react";

export const ProjectForm = ({ project, onClose, onSave, showNotification }) => {
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