import React, { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends Component<any, any> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    (this as any).setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      let displayMessage = 'Ha ocurrido un error inesperado en la aplicación.';

      if (this.state.error?.message) {
        try {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            if (parsed.error.includes('Missing or insufficient permissions')) {
              displayMessage = 'No tiene permisos suficientes para acceder a esta información.';
            } else {
              displayMessage = `Error de base de datos: ${parsed.error}`;
            }
          }
        } catch (e) {
          // Not a JSON error, use the message directly if it's safe
          displayMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-gray-600 mb-6">
              {displayMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Recargar la página
            </button>
          </div>
        </div>
      );
    }

    return ((this as any).props as any).children;
  }
}
