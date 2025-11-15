import { ExternalLink, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

interface Post {
  id: string;
  title: string | null;
  thumbnail_url: string | null;
  post_url: string | null;
  published_at: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Content</h3>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No content posts yet</p>
            <p className="text-sm mt-1">Connect your platforms to see your content here</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {post.thumbnail_url && (
                <img
                  src={post.thumbnail_url}
                  alt={post.title || 'Post thumbnail'}
                  className="w-32 h-20 object-cover rounded"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-white truncate">
                    {post.title || 'Untitled Post'}
                  </h4>
                  {post.post_url && (
                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {post.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {post.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {post.comments.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 size={14} />
                    {post.shares.toLocaleString()}
                  </span>
                </div>

                {post.published_at && (
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
