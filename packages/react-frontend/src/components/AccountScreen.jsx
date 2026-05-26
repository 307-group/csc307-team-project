// src/components/AccountScreen.jsx
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
    <div
      className="flex-1 h-full overflow-y-auto"
      style={{ backgroundColor: 'var(--background)' }}
    >
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
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--foreground)' }}
            >
              {user.name}
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {user.email}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="px-5 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Account Details
            </h2>
          </div>
          <div>
            {[
              { Icon: User, label: 'Full name', value: user.name },
              { Icon: Mail, label: 'Email address', value: user.email },
              {
                Icon: Calendar,
                label: 'Member since',
                value: formatDate(user.createdAt),
              },
            ].map(({ Icon, label, value }, i, arr) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-4"
                style={
                  i < arr.length - 1
                    ? { borderBottom: '1px solid var(--border)' }
                    : {}
                }
              >
                <Icon
                  className="size-4 shrink-0"
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs mb-0.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out card */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="px-5 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Session
            </h2>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: '#ef4444', border: '1px solid var(--border)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--surface)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
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
