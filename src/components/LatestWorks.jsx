import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getProjects } from '../lib/projects';

const LatestWorks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeProject();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Блокуємо скрол фонового контенту при відкритті модалки
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentPhotoIndex(0);
    setDirection(1);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentPhotoIndex(0);
    setDirection(1);
  };

  const photos = selectedProject
    ? [selectedProject.image_url, ...(selectedProject.images || [])]
    : [];

  const prevPhoto = () => {
    setDirection(-1);
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setDirection(1);
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Останні роботи</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ознайомтеся з нашими останніми встановленнями, що демонструють красу та універсальність сучасних систем натяжних стель
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card overflow-hidden group cursor-pointer bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow"
              onClick={() => openProject(project)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center text-white gap-2 font-medium">
                    <Eye size={20} /> Переглянути проєкт
                  </div>
                </div>
              </div>
              <div className="p-6">
                {/* Категорія та дата */}
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                    {project.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <Calendar size={14} /> {new Date(project.date).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
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

      {/* Modal for selected project */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeProject}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeProject}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              aria-label="Закрити модалку"
            >
              <X size={24} />
            </button>

            {/* Carousel */}
            <div className="relative w-full h-96 overflow-hidden">
              {photos.length > 0 && (
                <div
                  className={`absolute w-full h-full flex transition-transform duration-500`}
                  style={{ transform: `translateX(${-currentPhotoIndex * 100}%)` }}
                >
                  {photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Фото ${idx + 1}`}
                      className="w-full h-96 object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Photo indicator */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Project info */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {selectedProject.category}
                </span>
                <div className="flex items-center text-gray-500 text-sm gap-1">
                  <Calendar size={14} /> {new Date(selectedProject.date).toLocaleDateString()}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 text-lg">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestWorks;
