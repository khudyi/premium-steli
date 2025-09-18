import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <span className="text-xl font-bold">PremiumSteli</span>
            </div>
            <p className="text-gray-400 mb-4">
              Преміальні послуги з встановлення натяжних стель з понад 15-річним досвідом.
              Перетворіть свій простір за допомогою наших професійних та гарантованих рішень
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Швидкі Посилання</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Головна
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Галерея
                </a>
              </li>
              <li>
                <a href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакти
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Про нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Послуги
                </a>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-bold mb-4">Наші послуги</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Встановлення для житлових приміщень</li>
              <li className="text-gray-400">Комерційні проєкти</li>
              <li className="text-gray-400">Інтеграція індивідуального освітлення</li>
              <li className="text-gray-400">Ремонт та обслуговування</li>
              <li className="text-gray-400">Екстрена допомога</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4">Контактна інформація</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-400">(123) 456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-400">info@premiumsteli.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} PremiumSteli. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;