import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ServicesCalculator({ isOpen, onClose, defaultService }) {
  const [service, setService] = useState(defaultService || "");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [lights, setLights] = useState(0);
  const [decor, setDecor] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const services = [
    { name: "MSD Classic", price: 320 },
    { name: "MSD Premium", price: 350 },
    { name: "Bauf та Renolit", price: 450 },
  ];

  const calcResult = () => {
    if (!width || !length || !service) return 0;

    const selected = services.find((s) => s.name === service);
    const area = Number(width) * Number(length);
    const perimeter = (Number(width) + Number(length)) * 2;

    const baseCost = area * selected.price;
    const lightsCost = lights * 300;
    const decorCost = decor ? perimeter * 40 : 0;

    return baseCost + lightsCost + decorCost;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Розрахунок вартості
            </h3>

            {/* Service */}
            <label className="block text-sm font-medium text-gray-700">
              Тип послуги
            </label>
            <select
              className="form-input w-full mb-4"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Оберіть тип послуги</option>
              {services.map((s, i) => (
                <option key={i} value={s.name}>
                  {s.name} — {s.price} грн/м²
                </option>
              ))}
            </select>

            {/* Width */}
            <label className="block text-sm font-medium text-gray-700">
              Ширина (м)
            </label>
            <input
              type="number"
              className="form-input w-full mb-4"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />

            {/* Length */}
            <label className="block text-sm font-medium text-gray-700">
              Довжина (м)
            </label>
            <input
              type="number"
              className="form-input w-full mb-4"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />

            {/* Lights */}
            <label className="block text-sm font-medium text-gray-700">
              Кількість світильників (300 грн/шт)
            </label>
            <input
              type="number"
              className="form-input w-full mb-4"
              value={lights}
              onChange={(e) => setLights(Number(e.target.value))}
            />

            {/* Decor */}
            <div className="flex items-center mb-4 gap-2">
              <input
                type="checkbox"
                checked={decor}
                onChange={(e) => setDecor(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Декоративна вставка (40 грн/пог.м)
              </span>
            </div>

            {/* Result */}
            <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">
                Орієнтовна вартість:
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {calcResult()} грн
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}