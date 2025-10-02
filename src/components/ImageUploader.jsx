import { useState } from "react";
import { uploadImage } from "../lib/storage";
import { X } from "lucide-react";

export const ImageUploader = ({ label, files, setFiles, isMain = false, showNotification }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (fileList) => {
    const fileArray = Array.isArray(fileList) ? fileList : Array.from(fileList || []);
    if (!fileArray.length) return;

    try {
      const urls = await Promise.all(fileArray.map((f) => uploadImage(f)));

      if (isMain) {
        setFiles(urls[0] || "");
        showNotification("Головне фото завантажене!", "success");
      } else {
        setFiles((prev) => [...(Array.isArray(prev) ? prev : []), ...urls]);
        showNotification("Додаткові фото завантажені!", "success");
      }
    } catch (err) {
      showNotification("Помилка при завантаженні фото: " + (err.message || err), "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = (idx) => {
    if (isMain) {
      setFiles("");
    } else {
      setFiles((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== idx) : []));
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div
        className={`border-dashed border-2 p-4 rounded mb-2 text-center cursor-pointer ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Головне фото */}
        {isMain && typeof files === "string" && files ? (
          <div className="relative inline-block">
            <img src={files} alt="preview" className="h-32 mx-auto rounded object-cover mb-2" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
              onClick={() => handleRemove(0)}
              aria-label="Видалити головне фото"
            >
              <X size={14} />
            </button>
          </div>
        ) : 
        /* Додаткові фото */
        !isMain && Array.isArray(files) && files.length ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`extra-${i}`} className="h-24 w-24 object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  onClick={() => handleRemove(i)}
                  aria-label={`Видалити фото ${i + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Перетягніть фото сюди або оберіть файл</p>
        )}

        <input
          type="file"
          accept="image/*"
          multiple={!isMain}
          className="form-input w-full mt-2"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>
    </div>
  );
};