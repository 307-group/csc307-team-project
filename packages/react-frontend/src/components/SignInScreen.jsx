// src/components/SignInScreen.jsx
import { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';

function SignInScreen({ loginUser, signupUser, message }) {
  const [creds, setCreds] = useState({
    username: '',
    password: '',
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setCreds({ ...creds, [name]: value });
  }
  function handleLogin() {
    loginUser(creds);
  }
  function handleSignup() {
    signupUser(creds);
  }
  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-400 mt-1">
              Please enter your info.
            </p>
          </div>

          <form className="flex flex-col gap-4">
            {/*<form className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </label>
              <div className="mt-1.5 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <Mail size={16} className="text-gray-300" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>
           */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Username
              </label>
              <div className="mt-1.5 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <User size={16} className="text-gray-300" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={creds.username}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="mt-1.5 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <Lock size={16} className="text-gray-300" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={creds.password}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-300"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogIn size={16} />
              Sign In
            </button>

            <button
              type="button"
              onClick={handleSignup}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Account
            </button>

            {message && <p className="text-sm text-gray-500">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInScreen;
