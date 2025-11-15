import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SocialSync</h1>
          <p className="text-sm text-slate-400">Multi-platform analytics dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <User size={20} />
            <span className="text-sm">{user?.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
