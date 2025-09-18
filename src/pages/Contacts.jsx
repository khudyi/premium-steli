import { Phone, Mail, MapPin, Clock, Award, Users, Star } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Contacts = () => {
  return (
    <div>
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Звʼяжіться з нами!</h1>
            <p className="text-xl text-blue-100">
              Готові перетворити свій простір? Зв’яжіться з нашою експертною командою для безкоштовної консультації та персоналізованої пропозиції.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Cards */}
            <div className="card p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Зателефонуйте нам</h3>
              <p className="text-gray-600 mb-4">
                Спілкуйтеся безпосередньо з нашими експертами для оперативної допомоги.
              </p>
              <a href="tel:+1234567890" className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors">
                (123) 456-7890
              </a>
              <p className="text-sm text-gray-500 mt-2">Пн-Пт: 08:00-16:00</p>
            </div>

            <div className="card p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Напишіть нам</h3>
              <p className="text-gray-600 mb-4">
                Надішліть нам деталі вашого проєкту, і ми відповімо протягом 24 годин
              </p>
              <a href="mailto:info@stretchceilingpro.com" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                info@stretchceilingpro.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Ми відповідаємо цілодобово</p>
            </div>

            <div className="card p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Де ми працюємо?</h3>
              <p className="text-gray-600 mb-4">
                Працюємо по Вінниці та її околицях
              </p>
              <p className="text-sm text-gray-500 mt-2">Тільки за попереднім записом</p>
            </div>
          </div>

          {/* Business Hours & Service Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
                    Безкоштовна оцінка в межах 50км!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Чому обирають PremiumSteli?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">15+ Років Досвіду</h4>
                <p className="text-gray-600">
                  Понад пʼятнадцять років професійного досвіду встановлення натяжних стель з тисячами задоволених клієнтів.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">500+ Проєктів</h4>
                <p className="text-gray-600">
                  Успішно виконані установки — від невеликих житлових кімнат до великих комерційних приміщень
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white fill-current" size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Рейтинг 4,9/5</h4>
                <p className="text-gray-600">
                  Послідовно визнані найкращим підрядником з встановлення натяжних стель у регіоні з чудовими відгуками клієнтів
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  );
};

export default Contacts;