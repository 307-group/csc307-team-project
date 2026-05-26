// src/components/SignInScreen.jsx
import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';

const API = 'http://localhost:8000';

export function SignInScreen({ onAuth }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const validate = () => {
    if (mode === 'signup' && !name.trim()) return 'Please enter your name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/signup' : '/login';
      const body =
        mode === 'signup'
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password };

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      if (!res.ok) {
        setError(text || `Error ${res.status}`);
        return;
      }

      const payload = JSON.parse(text);
      onAuth(payload.token, payload.user);
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // Flex wrapper approach — icons always perfectly centered with input text
  const wrapperClass =
    'flex items-center gap-2 px-3 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-shadow';
  const inputClass =
    'flex-1 py-2.5 text-sm bg-transparent text-gray-700 placeholder-gray-300 outline-none';
  const iconClass = 'size-4 shrink-0 text-gray-300';

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 min-h-screen">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gray-900 text-white mb-4 text-2xl font-bold">
            N
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your notes and tasks.'
              : 'Get started — it only takes a moment.'}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name — signup only */}
          {mode === 'signup' && (
            <div className={wrapperClass}>
              <User className={iconClass} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </div>
          )}

          {/* Email */}
          <div className={wrapperClass}>
            <Mail className={iconClass} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className={wrapperClass}>
            <Lock className={iconClass} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-300 hover:text-gray-600 transition-colors shrink-0"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInScreen;
