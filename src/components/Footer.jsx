import { Phone, Mail, Instagram } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <motion.footer
      ref={ref}
      className="bg-gray-900 text-white"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
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
                <a href="/" className="text-gray-400 hover:text-white transition-colors">Головна</a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-white transition-colors">Галерея</a>
              </li>
              <li>
                <a href="/contacts" className="text-gray-400 hover:text-white transition-colors">Контакти</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Про нас</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Послуги</a>
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
                <ul>
                  <li>
                    <a href="tel:+380979526777" className="text-gray-400 hover:text-white transition-colors">0 (97) 952 67 77</a>
                  </li>
                  <li>
                    <a href="tel:+380509526773" className="text-gray-400 hover:text-white transition-colors">0 (50) 952 67 73</a>
                  </li>
                  <li>
                    <a href="tel:+380739526773" className="text-gray-400 hover:text-white transition-colors">0 (73) 952 67 73</a>
                  </li>
                </ul>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-400">info@premiumsteli.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} PremiumSteli. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};