import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import AdminPanel from './pages/AdminPanel';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes({ location }) {
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Homepage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="/contacts" element={<PageWrapper><Contacts /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    console.log(
      `%c💛 Made with love by Ihor Khudyi 💛`,
      'color: #facc15; font-size: 16px; font-weight: bold; text-shadow: 2px 2px #1e40af;'
    );
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutesWrapper />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Окремий компонент для отримання location для AnimateRoutes
import { useLocation, Routes, Route } from 'react-router-dom';
function AnimatedRoutesWrapper() {
  const location = useLocation();
  return <AnimatedRoutes location={location} />;
}

export default App;
