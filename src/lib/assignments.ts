import { Assignment, RiskLevel, Difficulty, ProductivityStats, AssignmentStatus } from '@/types/assignment';
import { differenceInHours, differenceInDays, isToday, isTomorrow, addHours } from 'date-fns';

export function calculateRiskLevel(deadline: Date, estimatedHours: number, difficulty: Difficulty): RiskLevel {
  const hoursUntilDeadline = differenceInHours(deadline, new Date());
  const difficultyMultiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1;
  const requiredHours = estimatedHours * difficultyMultiplier;
  const bufferHours = requiredHours * 0.5; // 50% buffer for safety
  
  if (hoursUntilDeadline < requiredHours) {
    return 'danger';
  } else if (hoursUntilDeadline < requiredHours + bufferHours) {
    return 'warning';
  }
  return 'safe';
}

export function generateAIInsight(assignment: Assignment): string {
  const hoursLeft = differenceInHours(assignment.deadline, new Date());
  const daysLeft = differenceInDays(assignment.deadline, new Date());
  
  const insights = {
    danger: [
      `⚠️ ${hoursLeft}시간 남음. 지금 시작해도 빡빡해요. 딴 거 다 제쳐두고 이것부터!`,
      `🔥 마감까지 ${hoursLeft}시간. 솔직히 말해서, 지금 안 하면 밤샘 확정이에요.`,
      `😰 ${assignment.estimatedHours}시간 필요한데 ${hoursLeft}시간밖에 없어요. 수학적으로 봐도 위험해요.`,
    ],
    warning: [
      `⏰ ${daysLeft}일 남았어요. 오늘 ${Math.ceil(assignment.estimatedHours / (daysLeft + 1))}시간만 하면 여유롭게 끝나요.`,
      `📊 지금 시작하면 하루 ${Math.ceil(assignment.estimatedHours / (daysLeft + 1))}시간씩, 충분히 가능해요.`,
      `💡 오늘 30분만 시작해봐요. 시작이 반이라고, 진짜예요.`,
    ],
    safe: [
      `✨ 여유 있어요! 그래도 미리 시작하면 완성도가 확 올라가요.`,
      `🎯 시간 여유 충분해요. 이번엔 퀄리티 높은 결과물 내볼까요?`,
      `🌟 아직 ${daysLeft}일 남았네요. 조금씩 하면 스트레스 없이 끝나요.`,
    ],
  };
  
  const levelInsights = insights[assignment.riskLevel];
  return levelInsights[Math.floor(Math.random() * levelInsights.length)];
}

export function generateFutureScenario(assignment: Assignment, action: 'delay' | 'start'): string {
  const hoursLeft = differenceInHours(assignment.deadline, new Date());
  const daysLeft = differenceInDays(assignment.deadline, new Date());
  
  if (action === 'delay') {
    if (assignment.riskLevel === 'danger') {
      return `❌ 내일로 미루면: 밤샘 각오해야 해요. 수면 부족 → 다른 과제도 영향받음 → 악순환 시작`;
    } else if (assignment.riskLevel === 'warning') {
      return `⚠️ 내일로 미루면: 위험 단계로 진입해요. 주말 약속? 취소해야 할 수도...`;
    }
    return `📝 내일로 미루면: 아직 괜찮지만, 계속 미루면 결국 급해져요`;
  } else {
    if (assignment.riskLevel === 'danger') {
      return `✅ 지금 시작하면: 최소한 제출은 할 수 있어요. 완벽 못해도 0점보단 낫잖아요!`;
    } else if (assignment.riskLevel === 'warning') {
      return `✅ 지금 시작하면: 내일 ${Math.max(1, assignment.estimatedHours - 2)}시간만 더 하면 끝! 주말 자유`;
    }
    return `✅ 지금 시작하면: 여유롭게 끝내고, 퀄리티도 챙길 수 있어요. 교수님 인상 좋아질 듯?`;
  }
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };
  return labels[difficulty];
}

export function getRiskLabel(risk: RiskLevel): string {
  const labels = {
    safe: '안전',
    warning: '주의',
    danger: '위험',
  };
  return labels[risk];
}

export function getDeadlineText(deadline: Date): string {
  if (isToday(deadline)) {
    const hours = differenceInHours(deadline, new Date());
    return hours <= 0 ? '마감 지남!' : `오늘 ${hours}시간 후`;
  }
  if (isTomorrow(deadline)) {
    return '내일';
  }
  const days = differenceInDays(deadline, new Date());
  return `${days}일 후`;
}

export function createMockAssignments(): Assignment[] {
  const now = new Date();
  
  const mockData: Assignment[] = [
    {
      id: '1',
      title: '경제학원론 기말 리포트',
      subject: '경제학원론',
      description: '수요와 공급의 균형점에 대한 분석 리포트',
      difficulty: 'hard' as Difficulty,
      estimatedHours: 8,
      deadline: addHours(now, 18),
      createdAt: addHours(now, -48),
      status: 'in-progress' as AssignmentStatus,
      riskLevel: 'danger' as RiskLevel,
    },
    {
      id: '2',
      title: '프로그래밍 과제 #5',
      subject: '컴퓨터공학개론',
      description: '재귀함수를 활용한 알고리즘 구현',
      difficulty: 'medium' as Difficulty,
      estimatedHours: 4,
      deadline: addHours(now, 72),
      createdAt: addHours(now, -24),
      status: 'pending' as AssignmentStatus,
      riskLevel: 'warning' as RiskLevel,
    },
    {
      id: '3',
      title: '영문학 에세이',
      subject: '영미문학개론',
      description: '셰익스피어 햄릿 분석 에세이',
      difficulty: 'medium' as Difficulty,
      estimatedHours: 5,
      deadline: addHours(now, 168),
      createdAt: addHours(now, -12),
      status: 'pending' as AssignmentStatus,
      riskLevel: 'safe' as RiskLevel,
    },
  ];
  
  return mockData.map(a => ({
    ...a,
    aiInsight: generateAIInsight(a),
  }));
}

export function calculateProductivityStats(assignments: Assignment[]): ProductivityStats {
  const completedToday = assignments.filter(
    a => a.completedAt && isToday(a.completedAt)
  ).length;
  
  const totalCompleted = assignments.filter(a => a.status === 'completed').length;
  const totalPending = assignments.filter(a => a.status !== 'completed').length;
  
  return {
    todayScore: Math.min(100, completedToday * 25 + 20),
    completedToday,
    totalPending,
    averageCompletion: totalCompleted > 0 ? Math.round((totalCompleted / assignments.length) * 100) : 0,
    streakDays: 3, // Mock value
  };
}
