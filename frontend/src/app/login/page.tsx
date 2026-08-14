'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard/' + data.user.role;
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">🎓 Login</h2>
        {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-500" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-500" required />
        <button type="submit" disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="text-center mt-4 text-gray-600">Don&apos;t have an account? <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link></p>
      </form>
    </div>
  );
}
