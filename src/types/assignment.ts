export type RiskLevel = 'safe' | 'warning' | 'danger';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AssignmentStatus = 'pending' | 'in-progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description?: string;
  difficulty: Difficulty;
  estimatedHours: number;
  deadline: Date;
  createdAt: Date;
  completedAt?: Date;
  status: AssignmentStatus;
  riskLevel: RiskLevel;
  aiInsight?: string;
  scheduledBlocks?: ScheduleBlock[];
}

export interface ScheduleBlock {
  id: string;
  assignmentId: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
}

export interface ProductivityStats {
  todayScore: number;
  completedToday: number;
  totalPending: number;
  averageCompletion: number;
  streakDays: number;
}
