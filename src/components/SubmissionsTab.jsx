import { Mail, Trash2 } from "lucide-react";

export const SubmissionsTab = ({ submissions, handleDeleteSubmissionClick, showNotification }) => (
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
            <div key={submission.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{submission.name}</h3>
                  <p className="text-gray-600">
                    {new Date(submission.timestamp).toLocaleDateString()}{' '}
                    {new Date(submission.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleDeleteSubmissionClick(submission.id);
                    showNotification('Заявку видалено!', 'success');
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <strong>Номер телефону:</strong> {submission.phone}
                </div>
                <div>
                  <strong>Email:</strong> {submission.email}
                </div>
              </div>
              <div>
                <strong>Деталі проєкту:</strong>
                <p className="text-gray-700 mt-2 p-4 bg-gray-50 rounded-lg">
                  {submission.project_details}
                </p>
              </div>
            </div>
          ))
      )}
    </div>
  </div>
);