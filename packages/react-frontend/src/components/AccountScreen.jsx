//AccountScreen.jsx
import { LogOut, Mail, Calendar, User } from 'lucide-react';

function formatDate(ms) {
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function avatarColor(str) {
  const colors = [
    '#3b82f6',
    '#ef4444',
    '#22c55e',
    '#eab308',
    '#a855f7',
    '#ec4899',
    '#f97316',
    '#14b8a6',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function AccountScreen({ user, onLogout }) {
  const initials = getInitials(user.name);
  const color = avatarColor(user.email);

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div
            className="size-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg select-none"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account Details
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="flex items-center gap-3 px-5 py-4">
              <User className="size-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Full name</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <Mail className="size-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Email address</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <Calendar className="size-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Member since</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Session
            </h2>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountScreen;
