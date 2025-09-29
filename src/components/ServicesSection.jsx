import { useState } from "react";
import { Check, Layers, Star, Sparkles, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addSubmission } from "../lib/submissions";

export const ServicesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addSubmission(formData);
      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", projectDetails: "" });
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 1500); // Закривається через 1.5s після успіху
    } catch (err) {
      setError("Щось пішло не так. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: <Layers size={40} />,
      title: "MSD Classic ",
      price: "Від 320 грн/м² під ключ",
      features: [
        "Безкоштовна консультація та заміри",
        "Професійне встановлення",
        "Гарантія 5 років",
        "Обслуговування в день звернення",
        "Індивідуальна інтеграція освітлення",
        "Різні варіанти натяжних стель",
      ],
      popular: false,
    },
    {
      icon: <Star size={40} />,
      title: "MSD Premium",
      price: "Від 350 грн/м² під ключ",
      features: [
        "Проєктне управління включено",
        "Оптові знижки",
        "Матеріали комерційного класу",
        "Гарантія 10 років",
        "Вогнестійкі варіанти",
        "Акустичні рішення",
        "Підтримка 24/7",
      ],
      popular: true,
    },
    {
      icon: <Sparkles size={40} />,
      title: "Bauf та Renolit",
      price: "Від 450 грн/м² під ключ",
      features: [
        "Дизайнерська консультація",
        "Преміальні матеріали",
        "Форми та кольори на замовлення",
        "Розумне освітлення",
        "Пожиттєва гарантія",
        "Пріоритетне обслуговування",
      ],
      popular: false,
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Послуги та ціни
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Обирайте ідеальний пакет для свого проєкту. Усі установки включають
            професійне обслуговування та гарантію якості
          </p>
        </div>

        {/* Карточки послуг */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`card p-8 relative ${
                service.popular ? "ring-4 ring-blue-500" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Popular
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
                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                  <Info size={14} className="text-blue-500" />
                  під ключ = плівка + профіль + монтаж
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check
                      className="text-green-500 mr-2 mt-1 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsModalOpen(true)}
                className={`w-full ${
                  service.popular ? "btn btn-primary" : "btn btn-outline"
                }`}
              >
                Отримати консультацію
              </button>
            </div>
          ))}
        </div>

        {/* Нижній блок */}
        <div className="text-center mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Потрібне індивідуальне рішення?
          </h3>
          <p className="text-gray-600 mb-4">
            Зв’яжіться з нами для спеціалізованих проєктів, унікальних форм або
            індивідуальних вимог
          </p>
          <a href="#contact" className="btn btn-secondary">
            Обговоріть свій проєкт
          </a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Отримати консультацію
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ім’я
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Введіть своє ім’я"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="+380..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Коментар
                  </label>
                  <textarea
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder="Ваше повідомлення..."
                    rows={3}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-500 text-sm">
                    Заявка успішно надіслана!
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? "Надсилаємо..." : "Надіслати"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};