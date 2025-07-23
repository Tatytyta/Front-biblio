import { useState } from 'react';

interface UseApiOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
}

export const useApi = (options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const execute = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await apiCall();
      
      if (options.showSuccessMessage) {
        setSuccess(options.successMessage || 'Operación realizada con éxito');
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Ha ocurrido un error inesperado';
      setError(errorMessage);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    execute,
    clearMessages,
  };
};
