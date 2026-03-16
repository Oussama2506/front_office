import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DossierService } from '../../services/dossier.service';
import { ToastService } from '../../../../../shared/services/toast.service';

interface MilestoneResponse {
  id: number;
  label: string;
  targetValue: number;
  reached: boolean;
  reachedDate: string | null;
}

interface HealthGoalResponse {
  id: number;
  metric: string;
  direction: string;
  startValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  active: boolean;
  achieved: boolean;
  achievedDate: string | null;
  createdAt: string;
  milestones: MilestoneResponse[];
}

interface GoalTemplate {
  label: string;
  icon: string;
  metric: string;
  unit: string;
  direction: 'decrease' | 'increase' | 'maintain';
  color: string;
}

@Component({
  selector: 'app-goal-tracking',
  templateUrl: './goal-tracking.component.html',
  styleUrls: ['./goal-tracking.component.scss']
})
export class GoalTrackingComponent implements OnInit {
  private apiBase = 'http://localhost:8090/peakwell/api/goals';

  goals: HealthGoalResponse[] = [];
  showCreateModal = false;
  hasData = false;
  loading = true;

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
    private http: HttpClient,
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dossierService.entries$.subscribe(entries => {
      this.hasData = entries.length > 0;
      if (this.hasData) {
        this.loadGoals();
      } else {
        this.loading = false;
      }
    });
  }

  // ── Data Loading ──────────────────────────────

  loadGoals(): void {
    this.http.get<HealthGoalResponse[]>(this.apiBase).subscribe({
      next: goals => {
        this.goals = goals;
        this.loading = false;
      },
      error: () => {
        this.toastService.show('❌ Failed to load goals');
        this.loading = false;
      }
    });
  }

  // ── Goal Creation ─────────────────────────────

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
      if (template.direction === 'decrease') {
        this.newGoalTarget = Math.round((currentVal * 0.9) * 10) / 10;
      } else if (template.direction === 'increase') {
        this.newGoalTarget = Math.round((currentVal * 1.1) * 10) / 10;
      } else {
        this.newGoalTarget = currentVal;
      }
    }
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

    this.http.post<HealthGoalResponse>(this.apiBase, {
      metric: this.selectedTemplate.metric,
      direction: this.selectedTemplate.direction,
      startValue: currentVal,
      targetValue: this.newGoalTarget,
      unit: this.selectedTemplate.unit,
      deadline: this.newGoalDeadline,
    }).subscribe({
      next: (goal) => {
        this.goals.unshift(goal);
        this.showCreateModal = false;
        this.toastService.show(`🎯 Goal created: ${this.selectedTemplate!.label}`);
      },
      error: () => {
        this.toastService.show('❌ Failed to create goal — is the backend running?');
      }
    });
  }

  deleteGoal(goalId: number): void {
    this.http.delete(`${this.apiBase}/${goalId}`).subscribe({
      next: () => {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.toastService.show('🗑️ Goal removed');
      },
      error: () => this.toastService.show('❌ Failed to delete goal')
    });
  }

  // ── Progress Calculation ──────────────────────

  getProgress(goal: HealthGoalResponse): number {
    const current = this.getMetricValue(goal.metric);
    const start = goal.startValue;
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

  getCurrentValue(goal: HealthGoalResponse): number {
    return this.getMetricValue(goal.metric);
  }

  getRemainingValue(goal: HealthGoalResponse): string {
    const current = this.getMetricValue(goal.metric);
    const diff = Math.abs(Math.round((goal.targetValue - current) * 10) / 10);
    if (this.getProgress(goal) >= 100) return 'Goal reached!';
    return `${diff} ${goal.unit} to go`;
  }

  getDaysRemaining(goal: HealthGoalResponse): number {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }

  getGoalStatus(goal: HealthGoalResponse): { label: string; color: string } {
    if (goal.achieved) return { label: 'Achieved!', color: '#7a9e7e' };
    const progress = this.getProgress(goal);
    const daysLeft = this.getDaysRemaining(goal);
    if (daysLeft === 0) return { label: 'Expired', color: '#b5aaa5' };
    if (progress >= 75) return { label: 'Almost there', color: '#7a9e7e' };
    if (progress >= 40) return { label: 'On track', color: '#e88f68' };
    return { label: 'Needs effort', color: '#c96a3f' };
  }

  getGoalColor(goal: HealthGoalResponse): string {
    const template = this.templates.find(t => t.metric === goal.metric && t.direction === goal.direction);
    return template?.color ?? '#c96a3f';
  }

  getGoalIcon(goal: HealthGoalResponse): string {
    const template = this.templates.find(t => t.metric === goal.metric);
    return template?.icon ?? '🎯';
  }

  getMetricLabel(metric: string): string {
    const map: Record<string, string> = {
      weight: 'Weight', bmi: 'BMI', bodyFat: 'Body Fat',
      muscleMass: 'Muscle Mass', systolic: 'Systolic BP', glucose: 'Glucose'
    };
    return map[metric] ?? metric;
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