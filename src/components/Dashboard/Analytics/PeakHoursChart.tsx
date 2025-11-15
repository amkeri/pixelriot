import { Clock } from 'lucide-react';

interface HourlyData {
  hour: number;
  viewers: number;
  engagement: number;
}

interface PeakHoursChartProps {
  data: HourlyData[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const maxViewers = Math.max(...data.map(d => d.viewers), 1);

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}${ampm}`;
  };

  const getTopHours = () => {
    return [...data]
      .sort((a, b) => b.viewers - a.viewers)
      .slice(0, 3)
      .map(d => formatHour(d.hour))
      .join(', ');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Peak Viewing Hours</h3>
          <p className="text-sm text-slate-400">When your audience is most active</p>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Clock className="text-blue-400" size={24} />
        </div>
      </div>

      <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <p className="text-sm text-slate-400 mb-1">Best times to post</p>
        <p className="text-lg font-semibold text-white">{getTopHours()}</p>
      </div>

      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.hour} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-12">{formatHour(item.hour)}</span>
            <div className="flex-1 h-8 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${(item.viewers / maxViewers) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-300 w-16 text-right">
              {item.viewers.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
