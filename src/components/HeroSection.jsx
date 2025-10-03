import { ArrowRight, Star, Users, Award } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';

const AnimatedNumber = ({ value, duration = 2.3, decimals = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      onUpdate(v) {
        setNum(v);
      },
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  const formatted = decimals > 0 ? Number(num).toFixed(decimals) : Math.floor(num);
  return <span ref={ref}>{formatted}</span>;
};

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Статичний фон */}
      <div
        className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="container mx-auto px-4 py-20 relative z-10 text-center">
        {/* Зірочки + підпис */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex justify-center items-center space-x-2 mb-6"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Star className="text-yellow-400 fill-current" size={20} />
            </motion.div>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="ml-2 text-sm font-medium"
          >
            Понад 500 задоволених клієнтів
          </motion.span>
        </motion.div>

        {/* Заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Перетворіть свій простір за допомогою
          <br />
          <span className="text-yellow-400">Premium Steli</span>
        </motion.h1>

        {/* Підзаголовок */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-xl md:text-2xl mb-8 text-blue-100"
        >
          Професійне встановлення сучасних систем натяжних стель.
          Швидко, акуратно та з гарантією — покращуємо будь-який інтер’єр.
        </motion.p>

        {/* Кнопки */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-12"
        >
          <a
            href="#contact"
            className="btn btn-accent inline-flex items-center text-lg px-8 py-4"
          >
            Отримати безкоштовну консультацію
            <ArrowRight className="ml-2" size={20} />
          </a>

          <a
            href="tel:+380979526777"
            className="btn btn-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-700"
          >
            Телефонуйте 0 (97) 952 67 77
          </a>
        </motion.div>

        {/* Блоки Проєкти / Роки досвіду / Рейтинг */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="flex flex-col sm:flex-row justify-center items-center gap-12"
        >
          {/* Проєкти */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Users className="text-yellow-400" size={32} />
            <div className="text-2xl font-bold mt-1">
              <AnimatedNumber value={4000} />+
            </div>
            <div className="text-blue-200 text-sm">Проєктів</div>
          </motion.div>

          {/* Роки досвіду */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Award className="text-yellow-400" size={32} />
            <div className="text-2xl font-bold mt-1">
              <AnimatedNumber value={15} />+
            </div>
            <div className="text-blue-200 text-sm">Років досвіду</div>
          </motion.div>

          {/* Рейтинг */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <Star className="text-yellow-400 fill-current" size={32} />
            <div className="text-2xl font-bold mt-1">
              <AnimatedNumber value={4.9} decimals={1} />
            </div>
            <div className="text-blue-200 text-sm">Рейтинг</div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};