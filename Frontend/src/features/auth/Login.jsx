import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const api = "http://localhost:8080/auth"
export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const request = {
      email,
      password,
    };

    try {
      const response = await axios.post(`${api}/login`, request);
      const { token, message, user } = response.data;
      setMessage({ text: message, type: "success" });
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        if (onLogin) onLogin(user);
      }, 1000);

    } catch (error) {
      setMessage({
        text: "Either Password or Email is Wrong", type: "error"
      });
    }
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
      <div className="relative mb-2">
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

      {message.text && (
        <p
          className={`text-sm font-medium mb-2 text-center ${message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
        >
          {message.text}
        </p>
      )}

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
