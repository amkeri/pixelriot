import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ConnectedPlatform {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook';
  platform_username: string | null;
  is_active: boolean;
  last_synced_at: string | null;
}

interface AnalyticsData {
  totalViewers: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgWatchTime: number;
  engagementRate: number;
}

interface HourlyData {
  hour: number;
  viewers: number;
  engagement: number;
}

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

export function useDashboardData() {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViewers: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    avgWatchTime: 0,
    engagementRate: 0,
  });
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlatforms = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('connected_platforms')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (!error && data) {
      setPlatforms(data);
    }
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    const { data: platformsData } = await supabase
      .from('connected_platforms')
      .select('id')
      .eq('user_id', user.id);

    if (!platformsData || platformsData.length === 0) {
      return;
    }

    const connectionIds = platformsData.map(p => p.id);

    const { data: analyticsData } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .in('connection_id', connectionIds)
      .gte('snapshot_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (analyticsData && analyticsData.length > 0) {
      const totals = analyticsData.reduce(
        (acc, curr) => ({
          viewers: acc.viewers + (curr.viewers || 0),
          likes: acc.likes + (curr.likes || 0),
          comments: acc.comments + (curr.comments || 0),
          shares: acc.shares + (curr.shares || 0),
          watchTime: acc.watchTime + (curr.average_watch_time || 0),
          engagementRate: acc.engagementRate + (curr.engagement_rate || 0),
        }),
        { viewers: 0, likes: 0, comments: 0, shares: 0, watchTime: 0, engagementRate: 0 }
      );

      setAnalytics({
        totalViewers: totals.viewers,
        totalLikes: totals.likes,
        totalComments: totals.comments,
        totalShares: totals.shares,
        avgWatchTime: Math.round(totals.watchTime / analyticsData.length),
        engagementRate: totals.engagementRate / analyticsData.length,
      });
    }
  };

  const fetchHourlyData = async () => {
    if (!user) return;

    const { data: platformsData } = await supabase
      .from('connected_platforms')
      .select('id')
      .eq('user_id', user.id);

    if (!platformsData || platformsData.length === 0) {
      const mockData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        viewers: 0,
        engagement: 0,
      }));
      setHourlyData(mockData);
      return;
    }

    const connectionIds = platformsData.map(p => p.id);

    const { data: hourlyAnalytics } = await supabase
      .from('hourly_analytics')
      .select('*')
      .in('connection_id', connectionIds)
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const hourlyMap = new Map<number, { viewers: number; engagement: number }>();

    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, { viewers: 0, engagement: 0 });
    }

    if (hourlyAnalytics) {
      hourlyAnalytics.forEach(item => {
        const current = hourlyMap.get(item.hour) || { viewers: 0, engagement: 0 };
        hourlyMap.set(item.hour, {
          viewers: current.viewers + (item.viewers || 0),
          engagement: current.engagement + (item.engagement_count || 0),
        });
      });
    }

    const result = Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour,
      viewers: data.viewers,
      engagement: data.engagement,
    }));

    setHourlyData(result);
  };

  const fetchRecentPosts = async () => {
    if (!user) return;

    const { data: platformsData } = await supabase
      .from('connected_platforms')
      .select('id')
      .eq('user_id', user.id);

    if (!platformsData || platformsData.length === 0) return;

    const connectionIds = platformsData.map(p => p.id);

    const { data: postsData } = await supabase
      .from('content_posts')
      .select('*')
      .in('connection_id', connectionIds)
      .order('published_at', { ascending: false })
      .limit(10);

    if (postsData) {
      setRecentPosts(postsData);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPlatforms(),
      fetchAnalytics(),
      fetchHourlyData(),
      fetchRecentPosts(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  return {
    platforms,
    analytics,
    hourlyData,
    recentPosts,
    loading,
    refetch: loadData,
  };
}
