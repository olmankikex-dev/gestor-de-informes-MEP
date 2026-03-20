import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  History,
  School,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
import { Report } from '../types';

interface SavedReportsTableProps {
  reports: Report[];
  onLoad: (report: Report) => void;
  onPreview: (report: Report) => void;
  onDelete: (id: string) => Promise<void>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onExport: (report: Report) => void;
  onBulkExport: (reports: Report[]) => void;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function SavedReportsTable({ reports, onLoad, onPreview, onDelete, onBulkDelete, onExport, onBulkExport, onNotification }: SavedReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredReports.length && filteredReports.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReports.map(r => r.id)));
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.header.nombreEstudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.header.asignatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.header.nombreResponsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = filterPeriod === 'all' || report.header.periodo === filterPeriod;
    
    return matchesSearch && matchesPeriod;
  });

  const periods = Array.from(new Set(reports.map(r => r.header.periodo)));

  return (
    <section className="bg-white rounded-2xl p-6 shadow-mep border border-mep-blue/5 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-mep-blue flex items-center gap-2">
            <History className="text-mep-gold" size={24} />
            Registros Guardados
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Historial de informes generados y guardados en su cuenta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar estudiante, asignatura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mep-blue/20 outline-none transition-all text-sm w-full md:w-64"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mep-blue/20 outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="all">Todos los periodos</option>
              {periods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={async () => {
              if (selectedIds.size === 0) {
                onNotification('Por favor, seleccione al menos un registro para eliminar.', 'info');
                return;
              }
              try {
                console.log('Bulk deleting reports:', Array.from(selectedIds));
                await onBulkDelete(Array.from(selectedIds) as string[]);
                setSelectedIds(new Set());
                onNotification('Registros eliminados con éxito.', 'success');
              } catch (err) {
                console.error('Error in bulk delete:', err);
                onNotification('Ocurrió un error al eliminar algunos registros. Por favor refresque la página.', 'error');
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium shadow-sm ${
              selectedIds.size > 0 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Trash2 size={18} />
            Eliminar Seleccionados
          </button>

          <button 
            onClick={() => {
              const reportsToExport = selectedIds.size > 0 
                ? filteredReports.filter(r => selectedIds.has(r.id))
                : filteredReports;

              if (reportsToExport.length === 0) {
                onNotification('No hay registros para exportar.', 'info');
                return;
              }

              onBulkExport(reportsToExport);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium shadow-sm"
          >
            <Download size={18} />
            Exportar PDF (Seleccionados)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2">
                <input 
                  type="checkbox"
                  checked={selectedIds.size === filteredReports.length && filteredReports.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-mep-blue focus:ring-mep-blue cursor-pointer"
                />
              </th>
              <th className="px-4 py-2 text-left">Fecha última actualización</th>
              <th className="px-4 py-2 text-left">Periodo</th>
              <th className="px-4 py-2">Estudiante</th>
              <th className="px-4 py-2">Asignatura</th>
              <th className="px-4 py-2">Nivel</th>
              <th className="px-4 py-2">Centro Educativo</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id} className={`group transition-colors rounded-xl overflow-hidden ${
                  selectedIds.has(report.id) ? 'bg-mep-blue/10' : 'bg-gray-50/50 hover:bg-mep-blue/5'
                }`}>
                  <td className="px-4 py-4 first:rounded-l-xl">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(report.id)}
                      onChange={() => toggleSelect(report.id)}
                      className="w-4 h-4 rounded border-gray-300 text-mep-blue focus:ring-mep-blue cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={14} className="text-mep-blue/60" />
                      {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold px-2 py-1 bg-mep-gold/10 text-mep-gold rounded-lg">
                      {report.header.periodo}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-mep-blue">
                      <User size={14} className="text-mep-blue/60" />
                      {report.header.nombreEstudiante}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={14} className="text-mep-blue/60" />
                      {report.header.asignatura}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap size={14} className="text-mep-blue/60" />
                      {report.header.nivel}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <School size={14} className="text-mep-blue/60" />
                      {report.header.centroEducativo}
                    </div>
                  </td>
                  <td className="px-4 py-4 last:rounded-r-xl text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onPreview(report)}
                        title="Ver Registro"
                        className="p-2 text-mep-blue hover:bg-mep-blue/10 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onLoad(report)}
                        title="Modificar Registro"
                        className="p-2 text-mep-gold hover:bg-mep-gold/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await onDelete(report.id);
                            if (selectedIds.has(report.id)) {
                              const newSelected = new Set(selectedIds);
                              newSelected.delete(report.id);
                              setSelectedIds(newSelected);
                            }
                          } catch (err) {
                            console.error('Error in single delete:', err);
                          }
                        }}
                        title="Eliminar Registro"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                  No se encontraron registros que coincidan con su búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
