import { Phone, Mail, Trash2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

export const SubmissionsTab = ({
  submissions: initialSubmissions,
  handleDeleteSubmissionClick,
  showNotification,
  openConfirmModal,
}) => {
  const [submissions, setSubmissions] = useState(initialSubmissions || []);
  const [copied, setCopied] = useState(null);

  // Оновлюємо локальний стан, якщо пропс initialSubmissions зміниться
  useEffect(() => {
    setSubmissions(initialSubmissions || []);
  }, [initialSubmissions]);

  const handleCopy = (text, type, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ id, type });
      showNotification(`${type === "phone" ? "Номер" : "Email"} скопійовано!`, "success");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const confirmDelete = (submissionId) => {
    openConfirmModal({
      title: "Видалити заявку?",
      message: "Ви впевнені, що хочете видалити цю заявку? Цю дію не можна буде скасувати.",
      onConfirm: async (close) => {
        try {
          await handleDeleteSubmissionClick(submissionId); // Видаляємо заявку на сервері
          // Оновлюємо локальний стан, видаляючи заявку
          setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
          showNotification("Заявку видалено!", "success");
          close(); // Закриваємо модальне вікно
        } catch (err) {
          showNotification("Помилка при видаленні заявки: " + err.message, "error");
        }
      },
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
                    onClick={() => confirmDelete(submission.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Видалити заявку"
                  >
                    <Trash2 size={28} />
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
                      onClick={() => handleCopy(submission.phone, "phone", submission.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Скопіювати номер"
                    >
                      {copied?.id === submission.id && copied?.type === "phone" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
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
                      onClick={() => handleCopy(submission.email, "email", submission.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Скопіювати email"
                    >
                      {copied?.id === submission.id && copied?.type === "email" ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
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