import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db, collection, query, orderBy, handleFirestoreError, OperationType, doc, updateDoc, limit, onSnapshot, where, startAfter, getDocs } from '../firebase';
import { Users, Mail, Calendar, ArrowLeft, Search } from 'lucide-react';

interface Registration {
  id: string;
  email: string;
  password: string;
  updatedAt: string;
  createdAt: string;
  status?: 'active' | 'disabled';
}

interface AdminPageProps {
  onBack: () => void;
}

export function AdminPage({ onBack }: AdminPageProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    let q;
    
    if (searchTerm) {
      // Optimized search using range queries for email
      const searchLower = searchTerm.toLowerCase();
      q = query(
        collection(db, 'registrations'),
        where('email', '>=', searchLower),
        where('email', '<=', searchLower + '\uf8ff'),
        limit(PAGE_SIZE)
      );
    } else {
      q = query(
        collection(db, 'registrations'),
        orderBy('updatedAt', 'desc'),
        limit(PAGE_SIZE)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const regs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      
      setRegistrations(regs);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching registrations:', error);
      handleFirestoreError(error, OperationType.LIST, 'registrations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchTerm]);

  const loadMore = async () => {
    if (!lastVisible || !hasMore) return;

    let q;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      q = query(
        collection(db, 'registrations'),
        where('email', '>=', searchLower),
        where('email', '<=', searchLower + '\uf8ff'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    } else {
      q = query(
        collection(db, 'registrations'),
        orderBy('updatedAt', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    }

    try {
      const snapshot = await getDocs(q);
      const newRegs = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      
      setRegistrations(prev => [...prev, ...newRegs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error: any) {
      console.error('Error loading more registrations:', error);
      handleFirestoreError(error, OperationType.LIST, 'registrations');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-600 shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-32 md:w-48 mr-4">
              <img 
                src="https://dgth.mep.go.cr/wp-content/uploads/2023/11/Logo_MINISTERIO-DE-EDUCACION-PUBLICA-2-CC_MINISTERIO-DE-EDUCACION-PUBLICA-.png" 
                alt="MEP Logo" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-mep-blue flex items-center gap-2">
                <Users className="text-mep-gold" /> Panel Administrativo
              </h1>
              <p className="text-sm text-gray-500 font-medium">Gestión de usuarios y seguridad del sistema</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Buscar por correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-mep-blue outline-none w-full md:w-64 transition-all"
              />
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Mostrando</span>
              <span className="text-sm font-bold text-mep-blue">{registrations.length}</span>
            </div>
          </div>
        </div>

        {loading && registrations.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mep-blue"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usuario / Correo MEP</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contraseña</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actualización</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {registrations.map((reg) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={reg.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-mep-blue group-hover:bg-mep-blue group-hover:text-white transition-colors">
                            <Mail size={14} />
                          </div>
                          <span className="text-sm font-bold text-gray-700">{reg.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 group-hover:border-mep-blue/20 transition-colors">
                            <code className="text-xs font-mono font-bold text-mep-light">{reg.password}</code>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Calendar size={12} className="text-gray-400" />
                          {new Date(reg.updatedAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            const newStatus = reg.status === 'disabled' ? 'active' : 'disabled';
                            try {
                              await updateDoc(doc(db, 'registrations', reg.id), { 
                                status: newStatus,
                                updatedAt: new Date().toISOString()
                              });
                            } catch (error) {
                              handleFirestoreError(error, OperationType.UPDATE, `registrations/${reg.id}`);
                            }
                          }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                            reg.status === 'disabled' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          }`}
                        >
                          {reg.status === 'disabled' ? 'Deshabilitado' : 'Activo'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="flex justify-center py-6 bg-gray-50/50 border-t border-gray-50">
                <button 
                  onClick={loadMore}
                  className="px-8 py-2.5 bg-white border border-gray-200 text-mep-blue rounded-xl font-bold text-sm hover:bg-blue-50 hover:border-mep-blue/20 transition-all shadow-sm active:scale-95"
                >
                  Cargar más usuarios
                </button>
              </div>
            )}
            
            {registrations.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-gray-400 font-medium">No se encontraron registros.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
