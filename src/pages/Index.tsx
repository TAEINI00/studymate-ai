import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AssignmentCard } from '@/components/AssignmentCard';
import { StatsCard } from '@/components/StatsCard';
import { AddAssignmentDialog } from '@/components/AddAssignmentDialog';
import { EmptyState } from '@/components/EmptyState';
import { TimelineView } from '@/components/TimelineView';
import { AICoach } from '@/components/AICoach';
import { Assignment } from '@/types/assignment';
import { createMockAssignments, calculateProductivityStats, calculateRiskLevel, generateAIInsight } from '@/lib/assignments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ListTodo, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load mock data on first render
    setAssignments(createMockAssignments());
  }, []);

  // Update risk levels periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAssignments(prev => prev.map(a => ({
        ...a,
        riskLevel: a.status === 'completed' ? a.riskLevel : calculateRiskLevel(a.deadline, a.estimatedHours, a.difficulty),
        aiInsight: a.status === 'completed' ? a.aiInsight : generateAIInsight(a),
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const handleStartAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'in-progress' as const } : a
    ));
    toast.success('화이팅! 시작이 반이에요 💪');
  };

  const handleCompleteAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'completed' as const, completedAt: new Date() } : a
    ));
    toast.success('🎉 과제 완료! 대단해요!');
  };

  const stats = calculateProductivityStats(assignments);
  
  const filteredAssignments = assignments.filter(a => {
    if (activeTab === 'all') return a.status !== 'completed';
    if (activeTab === 'danger') return a.riskLevel === 'danger' && a.status !== 'completed';
    if (activeTab === 'completed') return a.status === 'completed';
    return true;
  });

  const dangerCount = assignments.filter(a => a.riskLevel === 'danger' && a.status !== 'completed').length;
  const pendingCount = assignments.filter(a => a.status !== 'completed').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                오늘의 과제
              </h2>
              <p className="text-muted-foreground">
                {pendingCount > 0 
                  ? `${pendingCount}개의 과제가 기다리고 있어요`
                  : '모든 과제를 완료했어요!'
                }
              </p>
            </div>
            <AddAssignmentDialog onAdd={handleAddAssignment} />
          </div>

          {/* AI Coach Message */}
          <AICoach assignments={assignments} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  전체 ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="danger" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  긴급 ({dangerCount})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  완료 ({completedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredAssignments.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-4">
                    {filteredAssignments.map((assignment, index) => (
                      <div 
                        key={assignment.id}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <AssignmentCard
                          assignment={assignment}
                          onStart={() => handleStartAssignment(assignment.id)}
                          onClick={() => {
                            if (assignment.status !== 'completed') {
                              handleCompleteAssignment(assignment.id);
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsCard stats={stats} />
            <TimelineView assignments={assignments} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            마감지킴이 - AI 기반 과제 관리 서비스 📚
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
