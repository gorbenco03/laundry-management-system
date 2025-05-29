import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { ERROR_MESSAGES } from '../../utils/constants';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulare delay pentru efect mai realist
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = await login(username, password);
      
      if (success) {
        onSuccess();
      } else {
        setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (err) {
      setError('A apărut o eroare. Vă rugăm încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Nume utilizator
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              placeholder="Introduceți numele de utilizator"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Parolă
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
              placeholder="Introduceți parola"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
            <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingSpinner size="small" text="" />
          ) : (
            'Autentificare'
          )}
        </button>
      </form>

      {/* Demo Credentials Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 font-medium mb-2">Credențiale demo:</p>
        <div className="space-y-1 text-sm text-gray-500">
          <p>
            • Angajat: <span className="font-mono bg-gray-200 px-1 rounded">angajat</span> / 
            <span className="font-mono bg-gray-200 px-1 rounded ml-1">angajat</span>
          </p>
          <p>
            • Administrator: <span className="font-mono bg-gray-200 px-1 rounded">admin</span> / 
            <span className="font-mono bg-gray-200 px-1 rounded ml-1">root</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;