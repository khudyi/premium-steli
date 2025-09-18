import React, { useState, useEffect } from 'react';
import { Eye, Calendar, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // Load projects from localStorage or use default projects
    const savedProjects = JSON.parse(localStorage.getItem('galleryProjects') || '[]');
    
    if (savedProjects.length === 0) {
      // Default projects if none saved
      const defaultProjects = [
        {
          id: 1,
          title: "Modern Living Room",
          category: "residential",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Glossy white stretch ceiling with integrated LED lighting system",
          date: "2024-01-15"
        },
        {
          id: 2,
          title: "Contemporary Kitchen",
          category: "residential",
          image: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Matte finish ceiling with custom LED integration for perfect task lighting",
          date: "2024-01-20"
        },
        {
          id: 3,
          title: "Luxury Bedroom",
          category: "residential",
          image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Satin texture ceiling with ambient lighting for relaxing atmosphere",
          date: "2024-02-01"
        },
        {
          id: 4,
          title: "Office Space",
          category: "commercial",
          image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Commercial grade ceiling system with perfect acoustics and energy efficiency",
          date: "2024-02-10"
        },
        {
          id: 5,
          title: "Bathroom Renovation",
          category: "residential",
          image: "https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Waterproof stretch ceiling with moisture protection and integrated ventilation",
          date: "2024-02-15"
        },
        {
          id: 6,
          title: "Restaurant Interior",
          category: "commercial",
          image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Fire-resistant ceiling with custom lighting design for dining ambiance",
          date: "2024-03-01"
        },
        {
          id: 7,
          title: "Hotel Lobby",
          category: "commercial",
          image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Premium stretch ceiling with architectural lighting features",
          date: "2024-03-10"
        },
        {
          id: 8,
          title: "Master Suite",
          category: "residential",
          image: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Multi-level ceiling design with color-changing LED system",
          date: "2024-03-15"
        }
      ];
      setProjects(defaultProjects);
      localStorage.setItem('galleryProjects', JSON.stringify(defaultProjects));
    } else {
      setProjects(savedProjects);
    }
  }, []);

  const categories = [
    { id: 'all', name: 'Усі проєкти' },
    { id: 'residential', name: 'Житлові приміщення' },
    { id: 'commercial', name: 'Комерційні приміщення' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const openProject = (project) => {
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <div>
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Наша галерея</h1>
            <p className="text-xl text-blue-100">
              Ознайомтеся з нашим портфоліо вражаючих встановлень натяжних стель.
              Кожен проєкт демонструє нашу відданість якості та інноваціям.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card overflow-hidden group cursor-pointer" onClick={() => openProject(project)}>
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-center">
                        <Eye className="text-white" size={24} />
                        <span className="text-white ml-2 font-medium">Переглянути деталі</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {new Date(project.date).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                      {project.category}
                    </span>
                  </div>
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
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="relative">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={closeProject}
                className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(selectedProject.date).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {selectedProject.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedProject.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;