import { useState } from "react";
import { uploadImage } from "../lib/storage";
import { X, Upload } from "lucide-react";

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
        className={`border-dashed border-2 p-5 sm:p-6 rounded-lg mb-2 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Превʼю */}
        {isMain && typeof files === "string" && files ? (
          <div className="relative inline-block">
            <img
              src={files}
              alt="preview"
              className="h-32 mx-auto rounded-lg object-cover mb-2 shadow"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              onClick={() => handleRemove(0)}
              aria-label="Видалити головне фото"
            >
              <X size={14} />
            </button>
          </div>
        ) : !isMain && Array.isArray(files) && files.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {files.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img}
                  alt={`extra-${i}`}
                  className="w-full aspect-square object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                  onClick={() => handleRemove(i)}
                  aria-label={`Видалити фото ${i + 1}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
            <Upload size={28} className="text-blue-500" />
            <p>Перетягніть фото сюди або оберіть файл</p>
          </div>
        )}

        {/* Кнопка вибору */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() =>
              document.getElementById(`file-input-${isMain ? "main" : "extra"}`).click()
            }
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Обрати файл
          </button>
          <input
            id={`file-input-${isMain ? "main" : "extra"}`}
            type="file"
            accept="image/*"
            multiple={!isMain}
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
};