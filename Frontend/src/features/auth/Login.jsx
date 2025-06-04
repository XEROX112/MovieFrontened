import React, { useState } from 'react';

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
  };

  return (
    <form onSubmit={handleLogin} className="p-6 w-96 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <label className="block mb-2 text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded"
        placeholder="Enter your email"
        required
      />

      <label className="block mb-2 text-sm font-medium">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded pr-10"
          placeholder="Enter your password"
          required
        />
        <span
          className="absolute right-3 top-2 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁
        </span>
      </div>

      <button
        type="submit"
        className="w-full mt-6 py-2 bg-blue-200 text-white rounded cursor-pointer"
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
