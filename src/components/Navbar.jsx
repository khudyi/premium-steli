import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Головна', href: '/' },
    { name: 'Галерея', href: '/gallery' },
    { name: 'Контакти', href: '/contacts' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Лого */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="text-xl font-bold text-gray-800">PremiumSteli</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a href="tel:+380979526777" className="btn btn-primary">
              Зателефонуйте зараз!
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none relative z-[60]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.span
                key={isOpen ? 'Закрити' : 'Меню'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
              >
                {isOpen ? 'Закрити' : 'Меню'}
              </motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50"
            >
              {/* Menu items */}
              <div className="px-6 py-6 space-y-4 pt-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <a
                  href="tel:+380979526777"
                  className="w-full block text-center mt-6 btn btn-primary py-3 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Зателефонуйте зараз!
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};