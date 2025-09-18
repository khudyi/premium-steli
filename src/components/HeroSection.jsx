import React from 'react';
import { ArrowRight, Star, Users, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Star className="text-yellow-400 fill-current" size={20} />
            <Star className="text-yellow-400 fill-current" size={20} />
            <Star className="text-yellow-400 fill-current" size={20} />
            <Star className="text-yellow-400 fill-current" size={20} />
            <Star className="text-yellow-400 fill-current" size={20} />
            <span className="ml-2 text-sm font-medium">Понад 500 задоволених клієнтів</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 fade-in-up">
            Перетворіть свій простір за допомогою 
            <span className="text-yellow-400"> Premium Steli</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 fade-in-up">
            Професійне встановлення сучасних систем натяжних стель.
            Швидко, акуратно та з гарантією покращить будь-який інтер’єр
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
            <a href="#contact" className="btn btn-accent inline-flex items-center text-lg px-8 py-4">
              Отримати безкоштовну консультацію
              <ArrowRight className="ml-2" size={20} />
            </a>
            <a href="tel:+1234567890" className="btn btn-outline text-lg px-8 py-4">
              Телефонуйте (123) 456-7890
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Users className="text-yellow-400" size={32} />
              <div className="text-left">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-200">Проєктів</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="text-yellow-400" size={32} />
              <div className="text-left">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-blue-200">Років досвіду</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Star className="text-yellow-400 fill-current" size={32} />
              <div className="text-left">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-blue-200">Рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;