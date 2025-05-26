import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AuthForm({ isRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/auth/${isRegister ? 'register' : 'login'}`;
      await axios.post(url, formData);
      navigate('/projects');
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {isRegister ? 'Create Account' : 'Sign In'}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
          <p className="text-center text-gray-600">
            {isRegister ? 'Already have an account? ' : 'Need an account? '}
            <Link
              to={isRegister ? '/login' : '/register'}
              className="text-blue-600 hover:underline"
            >
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}