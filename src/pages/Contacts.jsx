import { Phone, Mail, MapPin, Clock, Award, Users, Star } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Contacts = () => {
  const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <motion.div {...fadeUp} className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Звʼяжіться з нами!</h1>
            <p className="text-xl text-blue-100">
              Готові перетворити свій простір? Зв’яжіться з нашою експертною командою для безкоштовної консультації та персоналізованої пропозиції.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              { icon: <Phone className="text-blue-600" size={32} />, title: 'Зателефонуйте нам', description: 'Спілкуйтеся безпосередньо з нашими експертами для оперативної допомоги.', contacts: ['tel:+380979526777','tel:+380509526773','tel:+380739526773'], note: 'Пн-Пт: 08:00-16:00' },
              { icon: <Mail className="text-blue-600" size={32} />, title: 'Напишіть нам', description: 'Надішліть нам деталі вашого проєкту, і ми відповімо протягом 24 годин', contacts: ['mailto:info@premiumsteli.com'], note: 'Ми відповідаємо цілодобово' },
              { icon: <MapPin className="text-blue-600" size={32} />, title: 'Де ми працюємо?', description: 'Працюємо по Вінниці та її околицях', contacts: [], note: 'Тільки за попереднім записом' }
            ].map((card, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.2 }} className="card p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                {card.contacts.map((c, idx) => (
                  <div key={idx}>
                    <a href={c} className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors">{c.replace(/^.*:/,'')}</a>
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-2">{card.note}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Business Hours & Service Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <Clock className="text-blue-600 mr-3" size={32} />
                  <h3 className="text-2xl font-bold text-gray-900">Робочий час</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Понеділок - Пʼятниця</span>
                    <span className="text-gray-600">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Субота</span>
                    <span className="text-gray-600">9:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Неділя</span>
                    <span className="text-gray-600">Не працюємо</span>
                  </div>
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between text-red-600 font-medium">
                      <span>Екстрена допомога</span>
                      <span>Доступно 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <MapPin className="text-blue-600 mr-3" size={32} />
                  <h3 className="text-2xl font-bold text-gray-900">Зона обслуговування</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Ми з гордістю обслуговуємо весь обласний регіон та навколишні громади:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Центр міста</li>
                    <li>Приміські райони</li>
                    <li>Бізнес-райони</li>
                    <li>Промислові зони</li>
                  </ul>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-blue-800 font-medium">
                      Безкоштовна оцінка в межах 50 км!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <motion.div className="bg-gray-50 rounded-2xl p-8 mb-16" {...fadeUp} transition={{ duration: 0.7 }}>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Чому обирають PremiumSteli?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Award className="text-white" size={32} />, title: '15+ Років Досвіду', text: 'Понад пʼятнадцять років професійного досвіду встановлення натяжних стель з тисячами задоволених клієнтів.' },
                { icon: <Users className="text-white" size={32} />, title: '500+ Проєктів', text: 'Успішно виконані установки — від невеликих житлових кімнат до великих комерційних приміщень' },
                { icon: <Star className="text-white fill-current" size={32} />, title: 'Рейтинг 4,9/5', text: 'Послідовно визнані найкращим підрядником з встановлення натяжних стель у регіоні з чудовими відгуками клієнтів' },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.2 }} className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  );
};

export default Contacts;
