/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ReportRow } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  row: ReportRow;
  index: number;
  onUpdate: (id: string, field: keyof ReportRow, value: any) => void;
  onRemove: (id: string) => void;
  onOpenPicker: (id: string) => void;
  onOpenMethodologyPicker: (id: string) => void;
  onOpenEvaluationPicker: (id: string) => void;
  onOpenAccessPicker: (id: string) => void;
}

export const ReportRowEditor: React.FC<Props> = ({ 
  row, 
  index, 
  onUpdate, 
  onRemove, 
  onOpenPicker,
  onOpenMethodologyPicker,
  onOpenEvaluationPicker,
  onOpenAccessPicker
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Descripción del funcionamiento del estudiante</label>
          <textarea 
            value={row.descripcionFuncionamiento}
            maxLength={1000}
            onChange={(e) => onUpdate(row.id, 'descripcionFuncionamiento', e.target.value)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Apoyo Personal</label>
          <div 
            onClick={() => onOpenPicker(row.id)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all overflow-y-auto"
          >
            {row.apoyoPersonal.length > 0 ? (
              <ul className="text-xs space-y-0.5">
                {row.apoyoPersonal.map(opt => {
                  const isHeader = opt.endsWith(':');
                  return (
                    <li 
                      key={opt} 
                      className={cn(
                        "text-xs",
                        isHeader ? "font-bold mt-2 first:mt-0 list-none text-blue-900" : "list-disc list-inside ml-2"
                      )}
                    >
                      {opt === "Otros (especifique):" ? (row.apoyoPersonalOtros || opt) : opt}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-xs text-muted-foreground italic">Haga clic para seleccionar apoyos...</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Metodología</label>
          <div 
            onClick={() => onOpenMethodologyPicker(row.id)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all overflow-y-auto"
          >
            {row.metodologia.length > 0 ? (
              <ul className="text-xs space-y-0.5">
                {row.metodologia.map(opt => {
                  const isHeader = opt.endsWith(':');
                  return (
                    <li 
                      key={opt} 
                      className={cn(
                        "text-xs",
                        isHeader ? "font-bold mt-2 first:mt-0 list-none text-blue-900" : "list-disc list-inside ml-2"
                      )}
                    >
                      {opt === "Otros (especifique):" ? (row.metodologiaOtros || opt) : opt}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-xs text-muted-foreground italic">Haga clic para seleccionar apoyos metodológicos...</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Evaluación</label>
          <div 
            onClick={() => onOpenEvaluationPicker(row.id)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all overflow-y-auto"
          >
            {row.evaluacion.length > 0 ? (
              <ul className="text-xs space-y-0.5">
                {row.evaluacion.map(opt => {
                  const isHeader = opt.endsWith(':');
                  return (
                    <li 
                      key={opt} 
                      className={cn(
                        "text-xs",
                        isHeader ? "font-bold mt-2 first:mt-0 list-none text-blue-900" : "list-disc list-inside ml-2"
                      )}
                    >
                      {opt === "Otros (especifique)" ? (row.evaluacionOtros || opt) : opt}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-xs text-muted-foreground italic">Haga clic para seleccionar apoyos de evaluación...</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">De Acceso</label>
          <div 
            onClick={() => onOpenAccessPicker(row.id)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all overflow-y-auto"
          >
            {row.deAcceso.length > 0 ? (
              <ul className="list-disc list-inside text-xs space-y-0.5">
                {row.deAcceso.map(opt => {
                  const isHeader = opt.endsWith(':');
                  return (
                    <li 
                      key={opt} 
                      className={cn(
                        "text-xs space-y-0.5",
                        isHeader ? "font-bold mt-2 first:mt-0 list-none text-blue-900" : "list-disc list-inside ml-2"
                      )}
                    >
                      {opt === "Otros (especifique):" ? (row.deAccesoOtros || opt) : opt}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-xs text-muted-foreground italic">Haga clic para seleccionar apoyos de acceso...</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Resultados</label>
          <textarea 
            value={row.resultados}
            maxLength={1000}
            onChange={(e) => onUpdate(row.id, 'resultados', e.target.value)}
            className="w-full h-20 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
          />
        </div>
    </motion.div>
  );
};
