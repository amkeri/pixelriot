import { Youtube, Instagram, Music, Twitter, Facebook, MoreVertical } from 'lucide-react';

interface Platform {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook';
  platform_username: string | null;
  is_active: boolean;
  last_synced_at: string | null;
}

interface PlatformCardProps {
  platform: Platform;
  stats?: {
    followers: number;
    engagement: number;
    posts: number;
  };
}

const platformConfig = {
  youtube: { icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10', name: 'YouTube' },
  tiktok: { icon: Music, color: 'text-pink-400', bg: 'bg-pink-500/10', name: 'TikTok' },
  instagram: { icon: Instagram, color: 'text-orange-400', bg: 'bg-orange-500/10', name: 'Instagram' },
  twitter: { icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/10', name: 'Twitter' },
  facebook: { icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/10', name: 'Facebook' },
};

export function PlatformCard({ platform, stats }: PlatformCardProps) {
  const config = platformConfig[platform.platform];
  const Icon = config.icon;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${config.bg} rounded-lg`}>
            <Icon className={config.color} size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">{config.name}</h3>
            <p className="text-sm text-slate-400">
              {platform.platform_username || 'Not connected'}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-300">
          <MoreVertical size={18} />
        </button>
      </div>

      {platform.is_active && stats ? (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-xs text-slate-500 mb-1">Followers</p>
            <p className="text-lg font-semibold text-white">{stats.followers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Engagement</p>
            <p className="text-lg font-semibold text-white">{stats.engagement}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Posts</p>
            <p className="text-lg font-semibold text-white">{stats.posts}</p>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-500">
            {platform.is_active ? 'Loading data...' : 'Platform disconnected'}
          </p>
        </div>
      )}

      {platform.last_synced_at && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Last synced: {new Date(platform.last_synced_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
