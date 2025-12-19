import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick?: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mb-6">
        <BookOpen className="h-10 w-10 text-primary animate-float" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        등록된 과제가 없어요
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        첫 과제를 등록하고 AI의 똑똑한 마감 관리를 경험해보세요!
      </p>
      <Button variant="hero" size="lg" onClick={onAddClick} className="gap-2">
        <Plus className="h-5 w-5" />
        첫 과제 등록하기
      </Button>
    </div>
  );
}
