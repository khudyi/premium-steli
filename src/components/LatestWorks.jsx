import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getProjects } from '../lib/projects';
import { motion, AnimatePresence } from 'framer-motion';

export const LatestWorks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        const latest6 = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);
        setProjects(latest6);
      } catch (err) {
        setError('Не вдалося завантажити проєкти. Спробуйте пізніше.');
        console.error('Помилка при завантаженні проєктів:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Закриття по Esc + навігація по стрілках
  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === 'Escape') closeProject();
      if (e.key === 'ArrowLeft' && selectedProject) prevPhoto();
      if (e.key === 'ArrowRight' && selectedProject) nextPhoto();
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [selectedProject, currentPhotoIndex]);

  // Блокування скролу при відкритті модалки
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    if (selectedProject && modalRef.current) {
      modalRef.current.focus();
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

  // Анімація для фото в слайдері
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
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

        {/* Loading & Error states */}
        {loading && <p className="text-center text-gray-500">Завантаження...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
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
                    loading="lazy"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center text-white gap-2 font-medium">
                      <Eye size={20} /> Переглянути проєкт
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-gray-500 text-sm gap-1">
                      <Calendar size={14} /> {new Date(project.date).toLocaleDateString('uk-UA')}
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link
            to="/gallery"
            className="btn btn-primary inline-flex items-center text-lg"
          >
            Переглянути всі проєкти
            <ArrowRight className="ml-2" size={20} />
          </Link>

          <a
            href="https://www.instagram.com/premiumsteli/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline inline-flex items-center text-lg"
          >
            Instagram
            <ArrowRight className="ml-2" size={20} />
          </a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeProject}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Перегляд проєкту ${selectedProject.title}`}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              ref={modalRef}
            >
              <button
                onClick={closeProject}
                className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                aria-label="Закрити модалку"
              >
                <X size={24} />
              </button>

              <div className="relative w-full h-96 overflow-hidden flex items-center justify-center">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.img
                    key={currentPhotoIndex}
                    src={photos[currentPhotoIndex]}
                    alt={`${selectedProject.title} - фото ${currentPhotoIndex + 1}`}
                    loading="lazy"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="absolute w-full h-96 object-cover"
                  />
                </AnimatePresence>

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                      aria-label="Попереднє фото"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                      aria-label="Наступне фото"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                    {selectedProject.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <Calendar size={14} /> {new Date(selectedProject.date).toLocaleDateString('uk-UA')}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
                <p className="text-gray-600 text-lg">{selectedProject.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};