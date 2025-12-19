import { Assignment } from '@/types/assignment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getRiskLabel, 
  getDifficultyLabel, 
  getDeadlineText,
  generateFutureScenario 
} from '@/lib/assignments';
import { Clock, BookOpen, Play, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  onClick?: () => void;
  onStart?: () => void;
  compact?: boolean;
}

export function AssignmentCard({ assignment, onClick, onStart, compact = false }: AssignmentCardProps) {
  const riskColors = {
    safe: 'border-l-status-safe bg-gradient-to-r from-status-safe-bg/50 to-transparent',
    warning: 'border-l-status-warning bg-gradient-to-r from-status-warning-bg/50 to-transparent',
    danger: 'border-l-status-danger bg-gradient-to-r from-status-danger-bg/50 to-transparent',
  };

  const iconColors = {
    safe: 'text-status-safe',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
  };

  if (compact) {
    return (
      <Card 
        className={cn(
          "cursor-pointer border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]",
          riskColors[assignment.riskLevel]
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={assignment.riskLevel} className="text-[10px]">
                  {getRiskLabel(assignment.riskLevel)}
                </Badge>
                <span className="text-xs text-muted-foreground truncate">
                  {assignment.subject}
                </span>
              </div>
              <h3 className="font-semibold text-foreground truncate">{assignment.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Clock className={cn("h-4 w-4", iconColors[assignment.riskLevel])} />
              <span className="font-medium">{getDeadlineText(assignment.deadline)}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "border-l-4 transition-all duration-300 hover:shadow-lg animate-slide-up",
        riskColors[assignment.riskLevel]
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={assignment.riskLevel}>
                {getRiskLabel(assignment.riskLevel)}
              </Badge>
              <Badge variant={assignment.difficulty as 'easy' | 'medium' | 'hard'}>
                {getDifficultyLabel(assignment.difficulty)}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">{assignment.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{assignment.subject}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-2xl font-bold",
              iconColors[assignment.riskLevel]
            )}>
              {getDeadlineText(assignment.deadline)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              예상 {assignment.estimatedHours}시간 소요
            </div>
          </div>
        </div>

        {/* AI Insight */}
        {assignment.aiInsight && (
          <div className="bg-accent/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              {assignment.riskLevel === 'danger' ? (
                <AlertTriangle className="h-5 w-5 text-status-danger shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[assignment.riskLevel])} />
              )}
              <p className="text-sm text-foreground leading-relaxed">
                {assignment.aiInsight}
              </p>
            </div>
          </div>
        )}

        {/* Future Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-status-danger-bg/30 rounded-lg p-3 border border-status-danger/10">
            <p className="text-xs text-muted-foreground">
              {generateFutureScenario(assignment, 'delay')}
            </p>
          </div>
          <div className="bg-status-safe-bg/30 rounded-lg p-3 border border-status-safe/10">
            <p className="text-xs text-muted-foreground">
              {generateFutureScenario(assignment, 'start')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClick}
          >
            상세 보기
          </Button>
          <Button 
            variant={assignment.riskLevel}
            size="lg"
            onClick={onStart}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            지금 시작하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
