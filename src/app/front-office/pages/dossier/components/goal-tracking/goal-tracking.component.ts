import { Component, OnInit } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { ToastService } from '../../../../../shared/services/toast.service';

interface HealthGoal {
  id: number;
  metric: string;
  icon: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  direction: 'decrease' | 'increase' | 'maintain';
  deadline: string;
  createdAt: string;
  milestones: Milestone[];
  color: string;
}

interface Milestone {
  label: string;
  value: number;
  reached: boolean;
  reachedDate?: string;
}

interface GoalTemplate {
  label: string;
  icon: string;
  metric: string;
  unit: string;
  direction: 'decrease' | 'increase' | 'maintain';
  color: string;
  suggestedTarget?: number;
}

@Component({
  selector: 'app-goal-tracking',
  templateUrl: './goal-tracking.component.html',
  styleUrls: ['./goal-tracking.component.scss']
})
export class GoalTrackingComponent implements OnInit {
  goals: HealthGoal[] = [];
  showCreateModal = false;
  hasData = false;

  // Create form
  selectedTemplate: GoalTemplate | null = null;
  newGoalTarget = 0;
  newGoalDeadline = '';

  readonly templates: GoalTemplate[] = [
    { label: 'Lose Weight',         icon: '⚖️', metric: 'weight',     unit: 'kg',    direction: 'decrease', color: '#c96a3f' },
    { label: 'Gain Weight',         icon: '⚖️', metric: 'weight',     unit: 'kg',    direction: 'increase', color: '#7a9e7e' },
    { label: 'Lower BMI',           icon: '📏', metric: 'bmi',        unit: '',      direction: 'decrease', color: '#e88f68' },
    { label: 'Reduce Body Fat',     icon: '🔬', metric: 'bodyFat',    unit: '%',     direction: 'decrease', color: '#e88f68' },
    { label: 'Build Muscle Mass',   icon: '💪', metric: 'muscleMass', unit: 'kg',    direction: 'increase', color: '#7a9e7e' },
    { label: 'Lower Blood Pressure',icon: '❤️', metric: 'systolic',   unit: 'mmHg',  direction: 'decrease', color: '#a47cf0' },
    { label: 'Lower Glucose',       icon: '🩸', metric: 'glucose',    unit: 'mg/dL', direction: 'decrease', color: '#4ab8f0' },
  ];

  constructor(
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dossierService.entries$.subscribe(entries => {
      this.hasData = entries.length > 0;
      if (this.hasData) {
        this.loadGoals();
        this.updateGoalProgress();
      }
    });
  }

  // ── Goal CRUD ─────────────────────────────────

  openCreate(): void {
    this.selectedTemplate = null;
    this.newGoalTarget = 0;
    this.newGoalDeadline = '';
    this.showCreateModal = true;
  }

  selectTemplate(template: GoalTemplate): void {
    this.selectedTemplate = template;
    const latest = this.dossierService.latest;
    if (latest && template.metric) {
      const currentVal = this.getMetricValue(template.metric);
      // Suggest a reasonable target
      if (template.direction === 'decrease') {
        this.newGoalTarget = Math.round((currentVal * 0.9) * 10) / 10;
      } else if (template.direction === 'increase') {
        this.newGoalTarget = Math.round((currentVal * 1.1) * 10) / 10;
      } else {
        this.newGoalTarget = currentVal;
      }
    }
    // Default deadline: 3 months from now
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + 3);
    this.newGoalDeadline = deadline.toISOString().split('T')[0];
  }

  createGoal(): void {
    if (!this.selectedTemplate || !this.newGoalTarget || !this.newGoalDeadline) {
      this.toastService.show('⚠️ Please fill in all fields');
      return;
    }

    const currentVal = this.getMetricValue(this.selectedTemplate.metric);
    const milestones = this.generateMilestones(currentVal, this.newGoalTarget, this.selectedTemplate.direction);

    const goal: HealthGoal = {
      id: Date.now(),
      metric: this.selectedTemplate.metric,
      icon: this.selectedTemplate.icon,
      currentValue: currentVal,
      targetValue: this.newGoalTarget,
      unit: this.selectedTemplate.unit,
      direction: this.selectedTemplate.direction,
      deadline: this.newGoalDeadline,
      createdAt: new Date().toISOString(),
      milestones,
      color: this.selectedTemplate.color,
    };

    this.goals.push(goal);
    this.saveGoals();
    this.showCreateModal = false;
    this.toastService.show(`🎯 Goal created: ${this.selectedTemplate.label}`);
  }

  deleteGoal(goalId: number): void {
    this.goals = this.goals.filter(g => g.id !== goalId);
    this.saveGoals();
    this.toastService.show('🗑️ Goal removed');
  }

  // ── Progress Calculation ──────────────────────

  getProgress(goal: HealthGoal): number {
    const current = this.getMetricValue(goal.metric);
    const start = goal.currentValue;
    const target = goal.targetValue;

    if (goal.direction === 'decrease') {
      if (current <= target) return 100;
      if (current >= start) return 0;
      return Math.round(((start - current) / (start - target)) * 100);
    } else {
      if (current >= target) return 100;
      if (current <= start) return 0;
      return Math.round(((current - start) / (target - start)) * 100);
    }
  }

  getCurrentValue(goal: HealthGoal): number {
    return this.getMetricValue(goal.metric);
  }

  getRemainingValue(goal: HealthGoal): string {
    const current = this.getMetricValue(goal.metric);
    const diff = Math.abs(Math.round((goal.targetValue - current) * 10) / 10);
    if (this.getProgress(goal) >= 100) return 'Goal reached!';
    return `${diff} ${goal.unit} to go`;
  }

  getDaysRemaining(goal: HealthGoal): number {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  getGoalStatus(goal: HealthGoal): { label: string; color: string } {
    const progress = this.getProgress(goal);
    const daysLeft = this.getDaysRemaining(goal);

    if (progress >= 100) return { label: 'Achieved!', color: '#7a9e7e' };
    if (daysLeft === 0) return { label: 'Expired', color: '#b5aaa5' };
    if (progress >= 75) return { label: 'Almost there', color: '#7a9e7e' };
    if (progress >= 40) return { label: 'On track', color: '#e88f68' };
    return { label: 'Needs effort', color: '#c96a3f' };
  }

  getMetricLabel(metric: string): string {
    const map: Record<string, string> = {
      weight: 'Weight', bmi: 'BMI', bodyFat: 'Body Fat',
      muscleMass: 'Muscle Mass', systolic: 'Systolic BP', glucose: 'Glucose'
    };
    return map[metric] ?? metric;
  }

  // ── Milestones ────────────────────────────────

  private generateMilestones(start: number, target: number, direction: string): Milestone[] {
    const milestones: Milestone[] = [];
    const diff = target - start;
    const steps = [0.25, 0.5, 0.75, 1.0];
    const labels = ['25% milestone', '50% — halfway!', '75% milestone', 'Goal reached!'];

    for (let i = 0; i < steps.length; i++) {
      milestones.push({
        label: labels[i],
        value: Math.round((start + diff * steps[i]) * 10) / 10,
        reached: false
      });
    }
    return milestones;
  }

  private updateGoalProgress(): void {
    for (const goal of this.goals) {
      for (const m of goal.milestones) {
        const current = this.getMetricValue(goal.metric);
        if (goal.direction === 'decrease') {
          m.reached = current <= m.value;
        } else {
          m.reached = current >= m.value;
        }
        if (m.reached && !m.reachedDate) {
          m.reachedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
    }
    this.saveGoals();
  }

  // ── Persistence (localStorage) ────────────────

  private saveGoals(): void {
    try {
      localStorage.setItem('peakwell_goals', JSON.stringify(this.goals));
    } catch (e) { /* silently fail in case of no localStorage */ }
  }

  private loadGoals(): void {
    try {
      const raw = localStorage.getItem('peakwell_goals');
      if (raw) {
        this.goals = JSON.parse(raw);
      }
    } catch (e) {
      this.goals = [];
    }
  }

  // ── Helpers ───────────────────────────────────

  private getMetricValue(metric: string): number {
    const latest = this.dossierService.latest;
    if (!latest) return 0;
    const map: Record<string, number> = {
      weight: latest.weight ?? 0,
      bmi: latest.bmi ?? 0,
      bodyFat: latest.bodyFat ?? 0,
      muscleMass: latest.muscleMass ?? 0,
      systolic: latest.systolic ?? 0,
      glucose: latest.glucose ?? 0,
    };
    return map[metric] ?? 0;
  }
}