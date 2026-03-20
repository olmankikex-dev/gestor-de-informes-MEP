import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronRight, Shield, Clock, Download, UserPlus, LogIn, Settings, Eye, EyeOff, Mail } from 'lucide-react';
import { db, doc, setDoc, getDoc, updateDoc, handleFirestoreError, OperationType, signInWithEmailAndPassword, createUserWithEmailAndPassword, auth, getDocs, query, where, collection, signOut, sendPasswordResetEmail, sendEmailVerification } from '../firebase';

  // Remove hashPassword function as it's no longer needed

interface LandingPageProps {
  onEnter: () => void;
  onAdminEnter: () => void;
}

export function LandingPage({ onEnter, onAdminEnter }: LandingPageProps) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load saved credentials on mount and auto-login if rememberMe
  useEffect(() => {
    // Firebase Auth handles persistence automatically, so we don't need to manually
    // save/load credentials from localStorage anymore.
    setIsCheckingAuth(false);
  }, []);

  const handleAction = async () => {
    if (isForgotPassword) {
      if (!email) {
        setError('Por favor ingrese su correo institucional');
        return;
      }
    } else if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Password validation for registration
    if (isRegistering) {
      if (password.length !== 10) {
        setError('La contraseña debe tener exactamente 10 caracteres.');
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(password)) {
        setError('La contraseña no debe contener caracteres especiales.');
        setLoading(false);
        return;
      }
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      if (!hasUpper || !hasLower) {
        setError('La contraseña debe tener letras mayúsculas y minúsculas.');
        setLoading(false);
        return;
      }
      const digitCount = (password.match(/[0-9]/g) || []).length;
      if (digitCount !== 4) {
        setError('La contraseña debe tener exactamente 4 números.');
        setLoading(false);
        return;
      }
      // Check for consecutive numbers
      for (let i = 0; i < password.length - 1; i++) {
        if (/[0-9]/.test(password[i]) && /[0-9]/.test(password[i+1])) {
          setError('Los números no pueden ser consecutivos.');
          setLoading(false);
          return;
        }
      }
    }

    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('Se ha enviado un enlace de recuperación a su correo.');
        setLoading(false);
        return;
      }

      if (isRegistering) {
        const normalizedEmail = email.toLowerCase();
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);
        
        // Save to Firestore so Admin can see it
        try {
          await setDoc(doc(db, 'registrations', normalizedEmail), {
            email: normalizedEmail,
            password: password, // Note: Stored for admin visibility per requirements
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: 'active'
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `registrations/${normalizedEmail}`);
        }
        
        console.log('[Registration] User created successfully, verification sent:', normalizedEmail);
      } else {
        // Login logic
        const normalizedEmail = email.toLowerCase();
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
        
        // Check status and self-heal missing documents
        let regDoc;
        try {
          regDoc = await getDoc(doc(db, 'registrations', normalizedEmail));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `registrations/${normalizedEmail}`);
        }

        if (regDoc && regDoc.exists()) {
            const regData = regDoc.data();
            if (regData.status === 'disabled') {
                await signOut(auth);
                throw new Error('Usuario Inhabilitado');
            }
            // Update password in db just in case it changed (self-healing)
            if (regData.password !== password) {
                try {
                  await updateDoc(doc(db, 'registrations', normalizedEmail), {
                      password: password,
                      updatedAt: new Date().toISOString()
                  });
                } catch (error) {
                  handleFirestoreError(error, OperationType.UPDATE, `registrations/${normalizedEmail}`);
                }
            }
        } else {
            // Self-healing: create the missing document for accounts created without it
            try {
              await setDoc(doc(db, 'registrations', normalizedEmail), {
                  email: normalizedEmail,
                  password: password,
                  updatedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  status: 'active'
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `registrations/${normalizedEmail}`);
            }
        }
        
        onEnter();
      }
    } catch (err: any) {
      // Only log unexpected errors to avoid cluttering the console with user-driven errors
      const isExpectedError = 
        err.code?.startsWith('auth/') || 
        err.message === 'Usuario Inhabilitado' || 
        err.message?.includes('Acceso denegado') ||
        err.message?.includes('Correo institucional o contraseña incorrectos');
      
      if (!isExpectedError) {
        console.error('Unexpected error in handleAction:', err);
      }
      
      let displayError = 'Error al procesar la solicitud. Intente de nuevo.';
      
      if (err.code === 'auth/email-already-in-use') {
        displayError = 'Esta cuenta ya está registrada. Por favor, intente iniciar sesión.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        displayError = 'Correo institucional o contraseña incorrectos.';
      } else if (err.code === 'auth/weak-password') {
        displayError = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        displayError = 'El formato del correo institucional no es válido.';
      } else if (err.code === 'auth/too-many-requests') {
        displayError = 'Demasiados intentos fallidos. Su cuenta ha sido bloqueada temporalmente. Intente más tarde.';
      } else if (err.message === 'Usuario Inhabilitado') {
        displayError = 'Su cuenta ha sido inhabilitada por el administrador. Contacte a soporte si cree que es un error.';
      } else if (err.message) {
        displayError = parseFirestoreError(err);
      }
      
      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  const parseFirestoreError = (err: any): string => {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.error.includes('Missing or insufficient permissions')) {
        return 'Acceso denegado. No tiene permisos para realizar esta acción.';
      }
      return parsed.error;
    } catch {
      return err.message || 'Error al procesar la solicitud.';
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-mep-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-mep-blue font-semibold animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-6 font-sans selection:bg-blue-100 selection:text-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center flex-grow justify-center"
      >
        {/* Logo MEP Banner */}
        <div className="mb-12 w-full">
          <img 
            src="https://dgth.mep.go.cr/wp-content/uploads/2023/11/Logo_MINISTERIO-DE-EDUCACION-PUBLICA-2-CC_MINISTERIO-DE-EDUCACION-PUBLICA-.png" 
            alt="Ministerio de Educación Pública" 
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Titles */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-black text-mep-blue leading-tight">
            REGISTRO DE APOYOS EDUCATIVOS
            <br />
            <span className="text-lg md:text-xl font-bold text-mep-gold block mt-2">
              circular DVM-AC-003-2013
            </span>
          </h1>
        </div>

        {/* Login/Register Toggle */}
        {!isForgotPassword && (
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-full max-w-[280px]">
            <button 
              onClick={() => { setIsRegistering(false); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${!isRegistering ? 'bg-white text-mep-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LogIn size={14} /> INGRESAR
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isRegistering ? 'bg-white text-mep-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <UserPlus size={14} /> REGISTRARSE
            </button>
          </div>
        )}

        {isForgotPassword && (
          <div className="text-center mb-8">
            <h2 className="text-lg font-black text-mep-blue uppercase tracking-wider">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-500 mt-1">Ingrese su correo institucional para recibir sus credenciales</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="w-full space-y-5 mb-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Correo Institucional</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@mep.go.cr"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-mep-blue focus:border-transparent outline-none transition-all text-gray-800"
            />
          </div>
          
          {!isForgotPassword && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-mep-blue focus:border-transparent outline-none transition-all text-gray-800 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-mep-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isRegistering && (
                <p className="text-[10px] text-gray-500 mt-1.5 px-1 leading-tight">
                  Requisitos: 10 caracteres, letras mayúsculas y minúsculas, cuatro números no consecutivos, sin caracteres especiales.
                </p>
              )}
            </div>
          )}
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <p className="text-xs text-red-600 font-bold">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-xs text-emerald-600 font-bold">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isRegistering && !isForgotPassword && (
            <div className="flex items-center justify-between px-1">
              {/* Remember me is handled by Firebase Auth automatically */}
              <button 
                onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMessage(null); }}
                className="text-sm text-mep-light font-semibold hover:text-mep-blue transition-colors"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
          )}

          {isForgotPassword && (
            <button 
              onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
              className="text-sm text-mep-light font-bold hover:text-mep-blue transition-colors flex items-center gap-2"
            >
              <ChevronRight size={14} className="rotate-180" /> Volver al ingreso
            </button>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAction}
          disabled={loading}
          className="w-full py-4 bg-mep-blue text-white rounded-2xl font-black text-lg hover:bg-mep-light transition-all shadow-xl shadow-mep-blue/20 active:scale-[0.98] uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            isForgotPassword ? 'ENVIAR CONTRASEÑA' : (isRegistering ? 'CREAR CUENTA' : 'INGRESAR')
          )}
        </button>

        {/* Admin Access (Hidden but accessible for the owner) */}
        <button 
          onClick={async () => {
            try {
              setError(null);
              setLoading(true);
              await onAdminEnter();
            } catch (err: any) {
              let displayError = 'Error al acceder al panel administrativo.';
              if (err.message === 'Usuario Inhabilitado') {
                displayError = 'Su cuenta ha sido inhabilitada por el administrador.';
              } else if (err.message) {
                displayError = parseFirestoreError(err);
              }
              setError(displayError);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="mt-8 text-[10px] font-black text-gray-300 hover:text-mep-gold transition-colors uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"
        >
          <Settings size={12} /> Acceso Administrativo
        </button>
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
