import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function ServicesCalculator({ isOpen, onClose, defaultService, onRequestQuote }) {
    const [service, setService] = useState(defaultService || "");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [lights, setLights] = useState('');
    const [decor, setDecor] = useState(false);

    // 1 — Пре-заповнення service
    useEffect(() => {
        if (isOpen && defaultService) {
            setService(defaultService);
        }
    }, [isOpen, defaultService]);

    // Блокування скролу
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    const services = [
        { name: "MSD Classic", price: 320 },
        { name: "MSD Premium", price: 350 },
        { name: "Bauf та Renolit", price: 450 },
    ];

    // 7 — Площа та периметр
    const area = useMemo(() => {
        if (!width || !length) return 0;
        return Number(width) * Number(length);
    }, [width, length]);

    const perimeter = useMemo(() => {
        if (!width || !length) return 0;
        return (Number(width) + Number(length)) * 2;
    }, [width, length]);

    const selectedService = useMemo(
        () => services.find((s) => s.name === service),
        [service]
    );

    const calcResult = useMemo(() => {
        if (!area || !selectedService) return 0;

        const baseCost = area * selectedService.price;
        const lightsCost = lights * 300;
        const decorCost = decor ? perimeter * 40 : 0;

        return baseCost + lightsCost + decorCost;
    }, [area, lights, decor, perimeter, selectedService]);

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
                        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
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
                            className={`form-input w-full mb-4 ${!service ? "border-red-500" : ""}`}
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
                            min="1"
                            step="0.1"
                            placeholder="Наприклад: 4.2"
                            className={`form-input w-full mb-4 ${!width ? "border-red-500" : ""}`}
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        />

                        {/* Length */}
                        <label className="block text-sm font-medium text-gray-700">
                            Довжина (м)
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            placeholder="Наприклад: 3.5"
                            className={`form-input w-full mb-4 ${!length ? "border-red-500" : ""}`}
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                        />

                        {/* Lights */}
                        <label className="block text-sm font-medium text-gray-700">
                            Кількість світильників (300 грн/шт)
                        </label>
                        <input
                            type="number"
                            min="0"
                            placeholder="0, якщо не потрібно"
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

                        {/* Live area + perimeter info */}
                        {(area > 0 || perimeter > 0) && (
                            <div className="mb-4 text-gray-700 text-sm">
                                <p>Площа: <span className="font-semibold">{area.toFixed(2)} м²</span></p>
                                <p>Периметр: <span className="font-semibold">{perimeter.toFixed(2)} м</span></p>
                            </div>
                        )}

                        {/* Result */}
                        <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-lg font-semibold text-gray-900">
                                Орієнтовна вартість:
                            </p>

                            <motion.p
                                key={calcResult}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-3xl font-bold text-blue-600 mt-2"
                            >
                                {calcResult} грн
                            </motion.p>
                        </div>
                        {/* 4 — Детальний розрахунок */}
                        {calcResult > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-800">
                                <p><strong>Деталізація:</strong></p>
                                <p>Площа: {area.toFixed(2)} м² × {selectedService.price} грн ={" "}
                                    <strong>{(area * selectedService.price).toFixed(0)} грн</strong>
                                </p>
                                <p>
                                    Світильники:{' '}
                                    {lights === '' ? '—' : <span>{lights} × 300 = <strong>{lights * 300} грн</strong></span>}
                                </p>
                                <p>
                                    Декор:{" "}
                                    {decor ? (
                                        <>
                                            {`${perimeter.toFixed(2)}м × 40 = `}<strong>{(perimeter * 40).toFixed(0)} грн</strong>
                                        </>
                                    ) : "—"}
                                </p>
                            </div>
                        )}

                        {/* 5 — Request quote */}
                        <button
                            className="btn btn-primary w-full mt-6"
                            onClick={() => {
                                onClose();
                                onRequestQuote && onRequestQuote();
                            }}
                        >
                            Отримати точний прорахунок
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}