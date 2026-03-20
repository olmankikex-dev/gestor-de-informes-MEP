import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { auth, sendEmailVerification, signOut, User } from '../firebase';

interface VerificationPageProps {
  user: User;
  onLogout: () => Promise<void>;
}

export function VerificationPage({ user, onLogout }: VerificationPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await sendEmailVerification(user);
      setSuccessMessage('Se ha reenviado el correo de verificación. Por favor revise su bandeja de entrada.');
    } catch (err: any) {
      console.error('Error resending verification:', err);
      setError('Error al enviar el correo. Intente de nuevo en unos minutos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      // Reload user to get latest verification status
      await user.reload();
      if (user.emailVerified) {
        window.location.reload();
      } else {
        setError('El correo aún no ha sido verificado. Por favor haga clic en el enlace que le enviamos.');
      }
    } catch (err: any) {
      setError('Error al verificar el estado. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6 font-sans selection:bg-blue-100 selection:text-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center text-center flex-grow justify-center"
      >
        {/* Logo MEP Banner */}
        <div className="mb-12 w-full">
          <img 
            src="https://dgth.mep.go.cr/wp-content/uploads/2023/11/Logo_MINISTERIO-DE-EDUCACION-PUBLICA-2-CC_MINISTERIO-DE-EDUCACION-PUBLICA-.png" 
            alt="Ministerio de Educación Pública" 
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-20 h-20 bg-blue-50 text-mep-blue rounded-full flex items-center justify-center mb-8 shadow-inner">
          <Mail size={40} />
        </div>

        <h2 className="text-2xl font-black text-mep-blue mb-4 uppercase tracking-tight">Verifique su correo</h2>
        
        <p className="text-gray-600 mb-2 font-medium">
          Hemos enviado un enlace de activación a:
        </p>
        <p className="font-bold text-mep-blue text-lg mb-8 break-all px-4">
          {user.email}
        </p>
        
        <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
          Por favor, revise su bandeja de entrada (y la carpeta de spam) y haga clic en el enlace para activar su cuenta institucional.
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full py-4 bg-mep-blue text-white rounded-2xl font-black text-lg hover:bg-mep-light transition-all shadow-xl shadow-mep-blue/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <RefreshCw size={20} /> YA LO VERIFIQUÉ
              </>
            )}
          </button>
          
          <button 
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full py-4 bg-gray-50 text-mep-blue border border-gray-200 rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'ENVIANDO...' : 'REENVIAR CORREO'}
          </button>

          <button 
            onClick={onLogout}
            className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition-colors uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> CERRAR SESIÓN
          </button>
        </div>

        <AnimatePresence>
          {(successMessage || error) && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mt-8 w-full"
            >
              <div className={`p-4 rounded-2xl border flex items-start gap-3 text-left ${
                successMessage ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  successMessage ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <p className="text-xs font-bold leading-relaxed">
                  {successMessage || error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Branding */}
      <footer className="w-full mt-12 py-8 text-center border-t border-gray-100 bg-white/50">
        <div className="text-sm font-bold text-gray-400 flex flex-col items-center justify-center gap-1">
          <p className="flex items-center gap-2">
            <span>®</span> Lic. Olman Enrique González aragón
          </p>
          <p className="flex items-center gap-1.5 text-[11px] opacity-70">
            <Mail size={12} className="text-mep-blue" /> soportekikexapss@gmail.com
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Google Ai Studio</p>
        </div>
      </footer>
    </div>
  );
}
