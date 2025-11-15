import { useState } from 'react';
import { Youtube, Instagram, Music, Twitter, Facebook, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const platforms = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

interface ConnectPlatformProps {
  onConnected: () => void;
}

export function ConnectPlatform({ onConnected }: ConnectPlatformProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!selectedPlatform || !username || !user) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('connected_platforms')
        .insert({
          user_id: user.id,
          platform: selectedPlatform as any,
          platform_username: username,
          is_active: true,
        });

      if (insertError) throw insertError;

      setIsOpen(false);
      setSelectedPlatform(null);
      setUsername('');
      onConnected();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect platform');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        <Plus size={20} />
        <span>Connect Platform</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Connect Platform</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedPlatform(null);
                  setUsername('');
                  setError('');
                }}
                className="text-slate-400 hover:text-slate-300"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {!selectedPlatform ? (
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className="flex flex-col items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className={`p-3 ${platform.bg} rounded-lg`}>
                        <Icon className={platform.color} size={28} />
                      </div>
                      <span className="text-white font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  {(() => {
                    const platform = platforms.find(p => p.id === selectedPlatform);
                    if (!platform) return null;
                    const Icon = platform.icon;
                    return (
                      <>
                        <div className={`p-2 ${platform.bg} rounded-lg`}>
                          <Icon className={platform.color} size={24} />
                        </div>
                        <span className="text-white font-medium">{platform.name}</span>
                      </>
                    );
                  })()}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Username or Channel ID
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your username or channel identifier
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedPlatform(null);
                      setUsername('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={loading || !username}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Note: This is a demo connection. In production, you would authenticate via OAuth.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
