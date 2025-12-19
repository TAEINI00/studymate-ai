import { Assignment } from '@/types/assignment';
import { differenceInHours, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle } from 'lucide-react';

interface TimelineViewProps {
  assignments: Assignment[];
}

export function TimelineView({ assignments }: TimelineViewProps) {
  const sortedAssignments = [...assignments]
    .filter(a => a.status !== 'completed')
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 5);

  if (sortedAssignments.length === 0) return null;

  const maxHours = Math.max(
    ...sortedAssignments.map(a => differenceInHours(a.deadline, new Date()))
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        마감 타임라인
      </h3>
      <div className="relative bg-card rounded-xl p-4 border border-border/50">
        {/* Timeline bar */}
        <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {sortedAssignments.map((assignment, index) => {
            const hoursLeft = differenceInHours(assignment.deadline, new Date());
            const progress = maxHours > 0 ? (1 - hoursLeft / maxHours) * 100 : 0;
            
            const dotColors = {
              safe: 'bg-status-safe',
              warning: 'bg-status-warning',
              danger: 'bg-status-danger animate-pulse',
            };

            return (
              <div 
                key={assignment.id}
                className="relative flex items-start gap-4 pl-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-6 h-3 w-3 rounded-full z-10 ring-4 ring-card",
                  dotColors[assignment.riskLevel]
                )} />
                
                {/* Content */}
                <div className="flex-1 ml-8 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground truncate text-sm">
                      {assignment.title}
                    </p>
                    <span className={cn(
                      "text-xs font-medium shrink-0",
                      assignment.riskLevel === 'danger' ? 'text-status-danger' :
                      assignment.riskLevel === 'warning' ? 'text-status-warning' :
                      'text-status-safe'
                    )}>
                      {hoursLeft <= 0 ? '마감!' : `${hoursLeft}시간`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(assignment.deadline, 'M월 d일 (EEE) HH:mm', { locale: ko })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Danger warning */}
        {sortedAssignments.some(a => a.riskLevel === 'danger') && (
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-status-danger">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">
              긴급한 과제가 있어요! 지금 바로 확인하세요.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
