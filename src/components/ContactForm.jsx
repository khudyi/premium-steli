import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { addSubmission } from '../lib/submissions';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Ім’я обов’язкове';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Номер телефону обов’язковий';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Будь ласка, введіть дійсний номер телефону';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Електронна пошта обов’язкова';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Будь ласка, введіть дійсну електронну адресу';
    }
    if (!formData.projectDetails.trim()) newErrors.projectDetails = 'Деталі проєкту обов’язкові';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await addSubmission(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', projectDetails: '' });
    } catch (err) {
      alert('Сталася помилка при надсиланні заявки: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="text-green-600 mb-4">
                <Send size={48} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Дякуємо за ваш інтерес!
              </h3>
              <p className="text-green-700 mb-4">
                Ми отримали деталі вашого проєкту і зв’яжемося з вами протягом 24 годин.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn btn-primary"
              >
                Надіслати ще одну заявку
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Отримайте безкоштовну консультацію
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Готові перетворити свій простір? Зв’яжіться з нами для безкоштовної консультації.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Зв’яжіться з нами
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Phone className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Номер телефону</h4>
                  <p className="text-gray-600">0 (97) 952 67 77</p>
                  <p className="text-sm text-gray-500">Пн-Сб: 08:00-18:00</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Електронна адреса</h4>
                  <p className="text-gray-600">info@premiumsteli.com</p>
                  <p className="text-sm text-gray-500">Відповідь протягом 24 годин</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Територія обслуговування</h4>
                  <p className="text-gray-600">Вінниця та область</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Отримати безкоштовну консультацію
              </h3>

              <div className="form-group">
                <label className="form-label">Повне імʼя *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введіть повне ім’я"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Номер телефону *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+380..."
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Електронна адреса *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Деталі проєкту *</label>
                <textarea
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleChange}
                  rows="4"
                  className="form-input"
                  placeholder="Розкажіть нам про свій проєкт"
                />
                {errors.projectDetails && <div className="form-error">{errors.projectDetails}</div>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Надсилаємо…' : 'Отримати безкоштовну консультацію'}
                {!isSubmitting && <Send className="ml-2" size={18} />}
              </button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Надсилаючи цю форму, ви погоджуєтеся отримувати від нас повідомлення. Ваші дані захищені.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
