import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // ⚠️ Placeholder logic — Firebase email login not yet implemented
      alert('Login successful');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google Login Success:', user);
      alert(`Welcome ${user.displayName}`);
      // Optionally redirect here (e.g., navigate('/dashboard'))
    } catch (err) {
      console.error('Google Login Error:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className={`w-full p-2 border rounded focus:outline-none focus:ring ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">or</p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
