import React from 'react';
import HeroSection from '../components/HeroSection';
import LatestWorks from '../components/LatestWorks';
import ServicesSection from '../components/ServicesSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <LatestWorks />
      <ServicesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Homepage;