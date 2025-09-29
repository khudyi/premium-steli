import { Phone, Mail, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

export const SubmissionsTab = ({ submissions, handleDeleteSubmissionClick, showNotification }) => {
  const [copied, setCopied] = useState(null); // зберігаємо що саме скопійовано

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      showNotification(`${type === "phone" ? "Номер" : "Email"} скопійовано!`, "success");
      setTimeout(() => setCopied(null), 2000); // після 2 сек забрати іконку
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Заявки</h2>
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="card p-8 text-center">
            <Mail className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Заявок ще немає.</p>
          </div>
        ) : (
          submissions
            .slice()
            .reverse()
            .map((submission) => (
              <div
                key={submission.id}
                className="card p-6 border-l-4 border-blue-500 shadow-sm"
              >
                {/* Заголовок заявки */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(submission.timestamp).toLocaleString("uk-UA", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Ви впевнені, що хочете видалити цю заявку?")) {
                        handleDeleteSubmissionClick(submission.id);
                        showNotification("Заявку видалено!", "success");
                      }
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Видалити заявку"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Контакти */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-blue-500" />
                    <a
                      href={`tel:${submission.phone}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {submission.phone}
                    </a>
                    <button
                      onClick={() => handleCopy(submission.phone, "phone")}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Скопіювати номер"
                    >
                      {copied === "phone" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-blue-500" />
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {submission.email}
                    </a>
                    <button
                      onClick={() => handleCopy(submission.email, "email")}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Скопіювати email"
                    >
                      {copied === "email" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Деталі проєкту */}
                <div>
                  <strong>Деталі проєкту:</strong>
                  <p className="text-gray-700 mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
                    {submission.project_details}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};