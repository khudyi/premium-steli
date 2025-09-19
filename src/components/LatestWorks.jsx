import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { getProjects } from '../lib/projects';

const LatestWorks = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects(); // отримуємо всі проєкти з Supabase
        const latest6 = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);
        setProjects(latest6);
      } catch (err) {
        console.error('Помилка при завантаженні проєктів:', err.message);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Останні роботи
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ознайомтеся з нашими останніми встановленнями, що демонструють красу та універсальність сучасних систем натяжних стель
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div key={project.id} className="card overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-center">
                      <Eye className="text-white" size={24} />
                      <span className="text-white ml-2 font-medium">Переглянути проєкт</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/gallery" className="btn btn-primary inline-flex items-center text-lg">
            Переглянути всі проєкти
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestWorks;
