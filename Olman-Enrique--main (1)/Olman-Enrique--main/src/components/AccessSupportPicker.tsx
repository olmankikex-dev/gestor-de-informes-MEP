import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { APOYO_ACCESO_OPTIONS } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccessSupportPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOptions: string[];
  onToggle: (option: string) => void;
  otherText: string;
  onOtherChange: (text: string) => void;
}

export const AccessSupportPicker: React.FC<AccessSupportPickerProps> = ({
  isOpen,
  onClose,
  selectedOptions,
  onToggle,
  otherText,
  onOtherChange,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Apoyos de Acceso</h2>
                <p className="text-sm text-slate-500 mt-1">Seleccione los apoyos organizativos y materiales</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {APOYO_ACCESO_OPTIONS.reduce((acc, current) => {
                  if (current.endsWith(':')) {
                    acc.push({ header: current, options: [] });
                  } else if (acc.length > 0) {
                    acc[acc.length - 1].options.push(current);
                  }
                  return acc;
                }, [] as { header: string; options: string[] }[]).map((group) => {
                  const isHeaderSelected = selectedOptions.includes(group.header);
                  return (
                    <div key={group.header} className="space-y-3">
                      <div className="pb-2">
                        <button
                          onClick={() => onToggle(group.header)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left group",
                            isHeaderSelected
                              ? "bg-blue-50 text-blue-900"
                              : "text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isHeaderSelected
                              ? "bg-blue-900 border-blue-900 text-white"
                              : "bg-white border-slate-300 group-hover:border-slate-400"
                          )}>
                            {isHeaderSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <h3 className="text-sm font-bold uppercase tracking-wider">{group.header}</h3>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {group.options.map((option) => {
                          const isSelected = selectedOptions.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => onToggle(option)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left group",
                                isSelected
                                  ? "bg-blue-50 border-blue-200 text-blue-900 shadow-sm"
                                  : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                              <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                                isSelected
                                  ? "bg-blue-900 border-blue-900 text-white"
                                  : "bg-white border-slate-300 group-hover:border-slate-400"
                              )}>
                                {isSelected && <Check size={14} strokeWidth={3} />}
                              </div>
                              <span className="text-sm font-medium flex-1 leading-tight">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-slate-100 mt-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Detalle para "Otros (especifique):"
                  </label>
                  <textarea
                    value={otherText}
                    onChange={(e) => onOtherChange(e.target.value)}
                    placeholder="Escriba aquí los detalles adicionales..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Listo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
