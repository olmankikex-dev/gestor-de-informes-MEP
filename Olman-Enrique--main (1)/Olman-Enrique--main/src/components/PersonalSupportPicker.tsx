/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APOYO_PERSONAL_OPTIONS } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  rowId: string | null;
  selectedOptions: string[];
  otherText: string;
  onToggle: (option: string) => void;
  onOtherChange: (text: string) => void;
  onClose: () => void;
}

export const PersonalSupportPicker: React.FC<Props> = ({ 
  rowId, 
  selectedOptions, 
  otherText, 
  onToggle, 
  onOtherChange, 
  onClose 
}) => {
  return (
    <AnimatePresence>
      {rowId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Seleccionar Apoyo Personal</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
              {APOYO_PERSONAL_OPTIONS.map(option => {
                const isSelected = selectedOptions.includes(option);
                const isHeader = option.endsWith(':');
                
                return (
                  <div 
                    key={option}
                    onClick={() => onToggle(option)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                      isSelected 
                        ? "bg-blue-50 border-blue-200 text-blue-900" 
                        : "hover:bg-gray-50 border-transparent",
                      isHeader && "mt-4 first:mt-0"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isHeader && "font-bold uppercase tracking-wider text-slate-400"
                    )}>
                      {option}
                    </span>
                  </div>
                );
              })}

              {selectedOptions.includes("Otros (especifique):") && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <input 
                    type="text"
                    placeholder="Especifique otros apoyos..."
                    value={otherText}
                    onChange={(e) => onOtherChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
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
