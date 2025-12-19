import { ProductivityStats } from '@/types/assignment';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, CheckCircle2, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  stats: ProductivityStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const scoreColor = stats.todayScore >= 70 
    ? 'text-status-safe' 
    : stats.todayScore >= 40 
      ? 'text-status-warning' 
      : 'text-status-danger';

  const statItems = [
    {
      icon: CheckCircle2,
      label: '오늘 완료',
      value: `${stats.completedToday}개`,
      color: 'text-status-safe',
    },
    {
      icon: Clock,
      label: '남은 과제',
      value: `${stats.totalPending}개`,
      color: 'text-primary',
    },
    {
      icon: Flame,
      label: '연속 달성',
      value: `${stats.streakDays}일`,
      color: 'text-status-warning',
    },
  ];

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-accent/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">오늘의 생산성</p>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-4xl font-bold", scoreColor)}>
                {stats.todayScore}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
          </div>
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center",
            stats.todayScore >= 70 ? 'bg-status-safe-bg' : stats.todayScore >= 40 ? 'bg-status-warning-bg' : 'bg-status-danger-bg'
          )}>
            <TrendingUp className={cn("h-8 w-8", scoreColor)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {statItems.map((item, index) => (
            <div 
              key={index}
              className="text-center p-3 rounded-lg bg-background/50"
            >
              <item.icon className={cn("h-5 w-5 mx-auto mb-2", item.color)} />
              <p className="text-lg font-semibold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
