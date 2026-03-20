/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from 'lucide-react';
import { ReportHeader } from '../types';

interface Props {
  header: ReportHeader;
  onChange: (header: ReportHeader) => void;
}

export const ReportHeaderForm: React.FC<Props> = ({ header, onChange }) => {
  const handleChange = (field: keyof ReportHeader, value: string) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Sección 1: Encabezado */}
      <section className="bg-white rounded-2xl p-6 shadow-mep border border-mep-blue/5">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-mep-blue flex items-center gap-2">
            <User size={16} /> Encabezado
          </h2>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Dirección Regional</label>
          <select 
            value={header.direccionRegional}
            onChange={(e) => handleChange('direccionRegional', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          >
            <option value="">Seleccione una Dirección Regional...</option>
            <option value="Dirección Regional de Educación Aguirre">Dirección Regional de Educación Aguirre</option>
            <option value="Dirección Regional de Educación Alajuela">Dirección Regional de Educación Alajuela</option>
            <option value="Dirección Regional de Educación Cañas">Dirección Regional de Educación Cañas</option>
            <option value="Dirección Regional de Educación Cartago">Dirección Regional de Educación Cartago</option>
            <option value="Dirección Regional de Educación Coto">Dirección Regional de Educación Coto</option>
            <option value="Dirección Regional de Educación Desamparados">Dirección Regional de Educación Desamparados</option>
            <option value="Dirección Regional de Educación Grande de Térraba">Dirección Regional de Educación Grande de Térraba</option>
            <option value="Dirección Regional de Educación Guápiles">Dirección Regional de Educación Guápiles</option>
            <option value="Dirección Regional de Educación Heredia">Dirección Regional de Educación Heredia</option>
            <option value="Dirección Regional de Educación Liberia">Dirección Regional de Educación Liberia</option>
            <option value="Dirección Regional de Educación Limón">Dirección Regional de Educación Limón</option>
            <option value="Dirección Regional de Educación Los Santos">Dirección Regional de Educación Los Santos</option>
            <option value="Dirección Regional de Educación Nicoya">Dirección Regional de Educación Nicoya</option>
            <option value="Dirección Regional de Educación Occidente">Dirección Regional de Educación Occidente</option>
            <option value="Dirección Regional Educación Peninsular">Dirección Regional Educación Peninsular</option>
            <option value="Dirección Regional de Educación Pérez Zeledón">Dirección Regional de Educación Pérez Zeledón</option>
            <option value="Dirección Regional de Educación Puntarenas">Dirección Regional de Educación Puntarenas</option>
            <option value="Dirección Regional de Educación Puriscal">Dirección Regional de Educación Puriscal</option>
            <option value="Dirección Regional de Educación San Carlos">Dirección Regional de Educación San Carlos</option>
            <option value="Dirección Regional Educación San José Norte">Dirección Regional Educación San José Norte</option>
            <option value="Dirección Regional Educación San José Oeste">Dirección Regional Educación San José Oeste</option>
            <option value="Dirección Regional de Educación Santa Cruz">Dirección Regional de Educación Santa Cruz</option>
            <option value="Dirección Regional de Educación Sarapiquí">Dirección Regional de Educación Sarapiquí</option>
            <option value="Dirección Regional Educación Sulá">Dirección Regional Educación Sulá</option>
            <option value="Dirección Regional de Educación Turrialba">Dirección Regional de Educación Turrialba</option>
            <option value="Dirección Regional Educación Zona Norte-Norte">Dirección Regional Educación Zona Norte-Norte</option>
          </select>
        </div>
      </section>

      {/* Sección 2: Información General */}
      <section className="bg-white rounded-2xl p-6 shadow-mep border border-mep-blue/5">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <User size={16} /> Información General
          </h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Centro Educativo</label>
              <input 
                type="text" 
                value={header.centroEducativo}
                maxLength={100}
                onChange={(e) => handleChange('centroEducativo', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Circuito</label>
              <input 
                type="text" 
                value={header.circuito}
                maxLength={50}
                onChange={(e) => handleChange('circuito', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Año</label>
            <input 
              type="text" 
              value={header.año}
              maxLength={4}
              onChange={(e) => handleChange('año', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Fecha</label>
            <input 
              type="date" 
              value={header.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Periodo</label>
            <select 
              value={header.periodo}
              onChange={(e) => handleChange('periodo', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            >
              <option>I PERIODO</option>
              <option>II PERIODO</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Estudiante</label>
            <input 
              type="text" 
              placeholder="Nombre completo"
              value={header.nombreEstudiante}
              maxLength={100}
              onChange={(e) => handleChange('nombreEstudiante', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Nivel</label>
            <select 
              value={header.nivel}
              onChange={(e) => handleChange('nivel', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            >
              <option value="">Seleccione un nivel...</option>
              <option value="INTERACTIVO I">INTERACTIVO I</option>
              <option value="INTERACTIVO II">INTERACTIVO II</option>
              <option value="TRANSICIÓN">TRANSICIÓN</option>
              <option value="PRIMERO">PRIMERO</option>
              <option value="SEGUNDO">SEGUNDO</option>
              <option value="TERCERO">TERCERO</option>
              <option value="CUARTO">CUARTO</option>
              <option value="QUINTO">QUINTO</option>
              <option value="SEXTO">SEXTO</option>
              <option value="SÉTIMO">SÉTIMO</option>
              <option value="OCTAVO">OCTAVO</option>
              <option value="NOVENO">NOVENO</option>
              <option value="DÉCIMO">DÉCIMO</option>
              <option value="UNDÉCIMO">UNDÉCIMO</option>
              <option value="DUODÉCIMO">DUODÉCIMO</option>
              <option value="I NIVEL EPJA">I NIVEL EPJA</option>
              <option value="II NIVEL EPJA">II NIVEL EPJA</option>
              <option value="III NIVEL EPJA">III NIVEL EPJA</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-muted-foreground">Asignatura</label>
            <input 
              type="text" 
              value={header.asignatura}
              maxLength={100}
              onChange={(e) => handleChange('asignatura', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-muted-foreground">Responsable</label>
          <input 
            type="text" 
            value={header.nombreResponsable}
            maxLength={100}
            onChange={(e) => handleChange('nombreResponsable', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
      </div>
    </section>
    </div>
  );
};
