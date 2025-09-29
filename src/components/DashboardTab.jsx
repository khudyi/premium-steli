import { Calendar, Eye, Mail } from "lucide-react";

export const DashboardTab = ({ projects, submissions }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Панель керування</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Всього проєктів" value={projects.length} icon={<Eye size={32} className="text-blue-600" />} />
      <Card title="Заявки" value={submissions.length} icon={<Mail size={32} className="text-green-600" />} />
      <Card
        title="Недавні заявки"
        value={submissions.filter(s => new Date(s.timestamp) > new Date(Date.now() - 7*24*60*60*1000)).length}
        icon={<Calendar size={32} className="text-amber-600" />}
      />
    </div>
  </div>
);

const Card = ({ title, value, icon }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);