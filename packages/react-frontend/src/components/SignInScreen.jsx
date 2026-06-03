// src/components/SignInScreen.jsx
import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function MarkerIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00002 7L8.73728 5.26274C9.52931 4.47071 9.92533 4.07469 10.382 3.92632C10.7837 3.7958 11.2164 3.7958 11.6181 3.92632C12.0747 4.07469 12.4707 4.47071 13.2628 5.26274L14 6.00012M10 10L14 14M9.50005 18.5002C10.1581 17.8422 16.644 11.3563 20.004 7.99627C21.1086 6.89166 21.1046 5.10475 20.0001 4.0001C18.8954 2.89541 17.1084 2.89137 16.0038 3.99603C12.6437 7.35611 6.15797 13.8419 5.49993 14.4999C3.71534 16.2843 2.64644 20.6464 2.99993 20.9999C3.35341 21.3533 7.66067 20.3396 9.50005 18.5002Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 flex items-center justify-center p-6 min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center size-14 rounded-2xl mb-4 shadow-sm"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
            }}
          >
            <MarkerIcon className="size-8" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {mode === 'signin'
              ? 'Sign in to access your notes and tasks.'
              : 'Get started — it only takes a moment.'}
          </p>
        </div>

        {/* Tab toggle */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className="flex-1 text-sm py-1.5 rounded-lg font-medium transition-all"
              style={
                mode === m
                  ? {
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }
                  : { color: 'var(--muted-foreground)' }
              }
            >
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name — signup only */}
          {mode === 'signup' && (
            <div
              className="flex items-center gap-2 px-3 rounded-xl border transition-shadow"
              style={{
                backgroundColor: 'var(--input-background)',
                borderColor: 'var(--border)',
              }}
            >
              <User
                className="size-4 shrink-0"
                style={{ color: 'var(--muted-foreground)' }}
              />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="flex-1 py-2.5 text-sm bg-transparent outline-none"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
          )}

          {/* Email */}
          <div
            className="flex items-center gap-2 px-3 rounded-xl border transition-shadow"
            style={{
              backgroundColor: 'var(--input-background)',
              borderColor: 'var(--border)',
            }}
          >
            <Mail
              className="size-4 shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="flex-1 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: 'var(--foreground)' }}
            />
          </div>

          {/* Password */}
          <div
            className="flex items-center gap-2 px-3 rounded-xl border transition-shadow"
            style={{
              backgroundColor: 'var(--input-background)',
              borderColor: 'var(--border)',
            }}
          >
            <Lock
              className="size-4 shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              className="flex-1 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: 'var(--foreground)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="transition-colors shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
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
            <p
              className="text-xs rounded-lg px-3 py-2 border"
              style={{
                color: '#ef4444',
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
            }}
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
