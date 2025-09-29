import { motion } from "framer-motion";

import { HeroSection } from '../components/HeroSection';
import { LatestWorks } from '../components/LatestWorks';
import { ServicesSection } from '../components/ServicesSection';
import { ContactForm } from '../components/ContactForm';


const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const Homepage = () => {
  return (
    <div>
      <HeroSection />

      <motion.div
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <LatestWorks />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeInUp}>
          <ServicesSection />
        </motion.div>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <ContactForm />
      </motion.div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
      </motion.div>
    </div>
  );
};