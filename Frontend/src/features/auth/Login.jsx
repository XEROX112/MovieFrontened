import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    onLogin();
  };

  return (
    <form
      className="bg-white p-6 shadow-lg rounded-3xl max-w-md w-full"
      onSubmit={handleLogin}
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <label className="block mb-2 text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 text-sm font-medium">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded pr-10"
          required
        />
        <div
          className="absolute right-3 top-2 text-gray-500 cursor-pointer select-none"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-2 rounded bg-sky-300 text-white hover:bg-sky-400 transition"
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{' '}
        <span
          onClick={onSwitch}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Sign up here
        </span>
      </p>
    </form>
  );
}
