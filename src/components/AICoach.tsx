import { Assignment } from '@/types/assignment';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICoachProps {
  assignments: Assignment[];
}

export function AICoach({ assignments }: AICoachProps) {
  const dangerCount = assignments.filter(a => a.riskLevel === 'danger').length;
  const warningCount = assignments.filter(a => a.riskLevel === 'warning').length;
  const pendingCount = assignments.filter(a => a.status !== 'completed').length;

  const getMessage = (): { message: string; tone: 'danger' | 'warning' | 'safe' | 'celebrate' } => {
    if (pendingCount === 0) {
      return {
        message: "🎉 모든 과제를 완료했어요! 오늘 정말 열심히 했네요. 푹 쉬어도 돼요!",
        tone: 'celebrate',
      };
    }
    
    if (dangerCount > 0) {
      if (dangerCount >= 2) {
        return {
          message: `⚠️ 위험한 과제가 ${dangerCount}개나 있어요. 일단 가장 급한 것부터. 하나씩 해결하면 돼요, 포기하지 마세요!`,
          tone: 'danger',
        };
      }
      return {
        message: "🔥 긴급 과제가 있어요. 지금 당장 시작하면 아직 늦지 않았어요. 할 수 있어요!",
        tone: 'danger',
      };
    }
    
    if (warningCount > 0) {
      return {
        message: `⏰ 주의가 필요한 과제가 ${warningCount}개 있어요. 오늘 조금만 하면 안전해져요. 30분만 투자해볼까요?`,
        tone: 'warning',
      };
    }
    
    return {
      message: `✨ ${pendingCount}개 과제 모두 여유 있어요! 이 여유를 유지하려면 오늘 조금씩 미리 해두는 게 좋아요.`,
      tone: 'safe',
    };
  };

  const { message, tone } = getMessage();

  const bgColors = {
    danger: 'from-status-danger-bg to-status-warning-bg/50 border-status-danger/20',
    warning: 'from-status-warning-bg to-status-safe-bg/50 border-status-warning/20',
    safe: 'from-status-safe-bg to-accent/50 border-status-safe/20',
    celebrate: 'from-accent to-secondary border-primary/20',
  };

  const iconColors = {
    danger: 'text-status-danger bg-status-danger-bg',
    warning: 'text-status-warning bg-status-warning-bg',
    safe: 'text-status-safe bg-status-safe-bg',
    celebrate: 'text-primary bg-accent',
  };

  return (
    <Card className={cn(
      "border bg-gradient-to-r animate-fade-in",
      bgColors[tone]
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
            iconColors[tone]
          )}>
            {tone === 'celebrate' ? (
              <Sparkles className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">AI 코치</span>
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
