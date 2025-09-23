import { useState, useEffect } from 'react';
import { Eye, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import { getProjects } from '../lib/projects';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fade, setFade] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const projectsPerPage = 9;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        const sortedProjects = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProjects(sortedProjects);
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

  const categories = [
    { id: 'all', name: 'Усі проєкти' },
    { id: 'Житлові', name: 'Житлові приміщення' },
    { id: 'Комерційні', name: 'Комерційні приміщення' },
    { id: 'Громадські', name: 'Громадські приміщення' },
    { id: 'Інше', name: 'Інше' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const goToPage = (pageNumber) => {
    setFade(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setFade(false);
    }, 200);
  };

  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentPhotoIndex(0);
    setModalVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setModalVisible(false);
    setTimeout(() => {
      setSelectedProject(null);
      setCurrentPhotoIndex(0);
      document.body.style.overflow = '';
    }, 300); // чекаємо анімацію
  };

  const photos = selectedProject
    ? [selectedProject.image_url, ...(selectedProject.images || [])]
    : [];

  const prevPhoto = () => {
    setSlideDirection(-1);
    setCurrentPhotoIndex(prev => prev === 0 ? photos.length - 1 : prev - 1);
  };

  const nextPhoto = () => {
    setSlideDirection(1);
    setCurrentPhotoIndex(prev => prev === photos.length - 1 ? 0 : prev + 1);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Наша галерея</h1>
          <p className="text-xl text-blue-100">
            Ознайомтеся з нашим портфоліо вражаючих встановлень натяжних стель.
            Кожен проєкт демонструє нашу відданість якості та інноваціям.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-12 flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => { setSelectedCategory(category.id); setCurrentPage(1); }}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
            {currentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
                onClick={() => openProject(project)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {project.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/70 px-2 py-1 rounded text-gray-700 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {new Date(project.date).toLocaleDateString()}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center text-white gap-2 font-medium">
                      <Eye size={20} /> Переглянути деталі
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Попередня
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Наступна
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Project Modal with Sliding Carousel + Animation */}
      {selectedProject && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            modalVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeProject}
        >
          <div
            className={`bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-full overflow-hidden relative transition-all duration-300 transform ${
              modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeProject}
              className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
              aria-label="Закрити модалку"
            >
              <X size={24} />
            </button>

            {/* Sliding Carousel */}
            <div className="relative w-full h-96 overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentPhotoIndex * 100}%)` }}
              >
                {photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Фото ${idx + 1}`}
                    className="w-full flex-shrink-0 object-cover h-96"
                  />
                ))}
              </div>

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

              {/* Photo Indicator */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {new Date(selectedProject.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {selectedProject.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
              <p className="text-gray-600 text-lg">{selectedProject.description}</p>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 overflow-x-auto">
                  {photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Прев'ю ${idx + 1}`}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        idx === currentPhotoIndex ? 'border-blue-600' : 'border-transparent'
                      } hover:opacity-80 transition-opacity`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
