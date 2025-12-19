import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Assignment, Difficulty } from '@/types/assignment';
import { calculateRiskLevel, generateAIInsight } from '@/lib/assignments';
import { Plus, BookOpen, Clock, Calendar, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AddAssignmentDialogProps {
  onAdd: (assignment: Assignment) => void;
}

export function AddAssignmentDialog({ onAdd }: AddAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !subject || !estimatedHours || !deadline) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    const deadlineDate = new Date(deadline);
    const hours = parseFloat(estimatedHours);
    const riskLevel = calculateRiskLevel(deadlineDate, hours, difficulty);

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      difficulty,
      estimatedHours: hours,
      deadline: deadlineDate,
      createdAt: new Date(),
      status: 'pending',
      riskLevel,
    };

    newAssignment.aiInsight = generateAIInsight(newAssignment);
    
    onAdd(newAssignment);
    toast.success('과제가 등록되었습니다!', {
      description: newAssignment.aiInsight,
    });
    
    // Reset form
    setTitle('');
    setSubject('');
    setDescription('');
    setDifficulty('medium');
    setEstimatedHours('');
    setDeadline('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          과제 등록하기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            새 과제 등록
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">과제명 *</Label>
            <Input
              id="title"
              placeholder="예: 경제학원론 기말 리포트"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">과목 *</Label>
            <Input
              id="subject"
              placeholder="예: 경제학원론"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명 (선택)</Label>
            <Textarea
              id="description"
              placeholder="과제에 대한 추가 설명..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                난이도 *
              </Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">쉬움</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="hard">어려움</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                예상 시간 *
              </Label>
              <Input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="시간"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              마감일 *
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" variant="hero">
              등록하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
