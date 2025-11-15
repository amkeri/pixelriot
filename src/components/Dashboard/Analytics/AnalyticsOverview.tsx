import { Eye, Heart, MessageCircle, Share2, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../StatCard';

interface AnalyticsData {
  totalViewers: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgWatchTime: number;
  engagementRate: number;
}

interface AnalyticsOverviewProps {
  data: AnalyticsData;
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const formatWatchTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Viewers"
        value={data.totalViewers}
        icon={Eye}
        trend={{ value: 12.5, isPositive: true }}
        subtitle="Across all platforms"
      />
      <StatCard
        title="Total Likes"
        value={data.totalLikes}
        icon={Heart}
        trend={{ value: 8.3, isPositive: true }}
        subtitle="Total engagement"
      />
      <StatCard
        title="Comments"
        value={data.totalComments}
        icon={MessageCircle}
        trend={{ value: 15.7, isPositive: true }}
        subtitle="Community interaction"
      />
      <StatCard
        title="Shares"
        value={data.totalShares}
        icon={Share2}
        trend={{ value: 5.2, isPositive: true }}
        subtitle="Content virality"
      />
      <StatCard
        title="Avg Watch Time"
        value={formatWatchTime(data.avgWatchTime)}
        icon={Clock}
        subtitle="Per viewer"
      />
      <StatCard
        title="Engagement Rate"
        value={`${data.engagementRate.toFixed(1)}%`}
        icon={TrendingUp}
        trend={{ value: 3.8, isPositive: true }}
        subtitle="Overall performance"
      />
    </div>
  );
}
