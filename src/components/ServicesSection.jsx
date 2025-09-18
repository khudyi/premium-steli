import React from 'react';
import { Check, Home, Building2, Wrench } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Home size={40} />,
      title: "Житлові приміщення",
      price: "Від €8/м²",
      features: [
        "Безкоштовна консультація та заміри",
        "Професійне встановлення",
        "Гарантія 5 років",
        "Обслуговування в день звернення",
        "Індивідуальна інтеграція освітлення",
        "Різні варіанти натяжних стель"
      ],
      popular: false
    },
    {
      icon: <Building2 size={40} />,
      title: "Комерційні приміщення",
      price: "Від €12/м²",
      features: [
        "Проєктне управління включено",
        "Оптові знижки",
        "Матеріали комерційного класу",
        "Гарантія 10 років",
        "Вогнестійкі варіанти",
        "Акустичні рішення",
        "Підтримка 24/7"
      ],
      popular: true
    },
    {
      icon: <Wrench size={40} />,
      title: "Преміум",
      price: "Від €16/м²",
      features: [
        "Дизайнерська консультація",
        "Преміальні матеріали",
        "Форми та кольори на замовлення",
        "Розумне освітлення",
        "Пожиттєва гарантія",
        "Пріоритетне обслуговування",
      ],
      popular: false
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Послуги та ціни
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Обирайте ідеальний пакет для свого проєкту. Усі установки включають професійне обслуговування та гарантію якості
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`card p-8 relative ${service.popular ? 'ring-4 ring-blue-500' : ''}`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Найбільш популярний
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <div className="text-3xl font-bold text-blue-600">
                  {service.price}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full ${service.popular ? 'btn btn-primary' : 'btn btn-outline'}`}>
                Отримати консультацію
              </button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Потрібне індивідуальне рішення?
          </h3>
          <p className="text-gray-600 mb-4">
            Зв’яжіться з нами для спеціалізованих проєктів, унікальних форм або індивідуальних вимог
          </p>
          <a href="#contact" className="btn btn-secondary">
            Обговоріть свій проєкт
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;