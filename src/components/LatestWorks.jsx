import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';

const LatestWorks = () => {
  const projects = [
    {
      id: 1,
      title: "Modern Living Room",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Glossy white stretch ceiling with integrated lighting"
    },
    {
      id: 2,
      title: "Contemporary Kitchen",
      image: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Matte finish ceiling with custom LED integration"
    },
    {
      id: 3,
      title: "Luxury Bedroom",
      image: "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Satin texture ceiling with ambient lighting"
    },
    {
      id: 4,
      title: "Office Space",
      image: "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Commercial grade ceiling system with perfect acoustics"
    },
    {
      id: 5,
      title: "Bathroom Renovation",
      image: "https://images.pexels.com/photos/342800/pexels-photo-342800.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Waterproof stretch ceiling with moisture protection"
    },
    {
      id: 6,
      title: "Restaurant Interior",
      category: "commercial",
      image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Fire-resistant ceiling with custom lighting design for dining ambiance",
      date: "2024-03-01"
    }
  ];

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
                  src={project.image} 
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