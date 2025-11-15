import { Header } from '../components/Dashboard/Header';
import { ConnectPlatform } from '../components/Dashboard/ConnectPlatform';
import { PlatformCard } from '../components/Dashboard/PlatformCard';
import { AnalyticsOverview } from '../components/Dashboard/Analytics/AnalyticsOverview';
import { PeakHoursChart } from '../components/Dashboard/Analytics/PeakHoursChart';
import { RecentPosts } from '../components/Dashboard/Analytics/RecentPosts';
import { useDashboardData } from '../hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { platforms, analytics, hourlyData, recentPosts, loading, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="animate-spin text-blue-400" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h2>
            <p className="text-slate-400">Track your performance across all platforms</p>
          </div>
          <ConnectPlatform onConnected={refetch} />
        </div>

        {platforms.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Get Started</h3>
            <p className="text-slate-400 mb-6">
              Connect your first social media platform to start tracking your analytics
            </p>
            <ConnectPlatform onConnected={refetch} />
          </div>
        ) : (
          <>
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Analytics Overview</h3>
              <AnalyticsOverview data={analytics} />
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Connected Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PeakHoursChart data={hourlyData} />
              <RecentPosts posts={recentPosts} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
