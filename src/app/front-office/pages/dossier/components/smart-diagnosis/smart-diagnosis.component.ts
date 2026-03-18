import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../../shared/services/toast.service';

interface SymptomPrediction {
  symptom: string;
  predictedSeverity: number;
  severityLabel: string;
  confidence: number;
  probabilities: Record<string, number>;
}

interface PredictionResult {
  overallSeverity: number;
  overallSeverityLabel: string;
  averageSeverity: number;
  averageConfidence: number;
  symptomCount: number;
  worstSymptom: string;
  worstSeverity: number;
  worstSeverityLabel: string;
  predictions: SymptomPrediction[];
  modelType: string;
  riskFactors: string[];
  multiSymptomWarning: string | null;
}

@Component({
  selector: 'app-smart-diagnosis',
  templateUrl: './smart-diagnosis.component.html',
  styleUrls: ['./smart-diagnosis.component.scss']
})
export class SmartDiagnosisComponent implements OnInit {
  private apiBase = 'http://localhost:8090/peakwell/api/predict';

  modelLoaded = false;
  loading = false;
  predicted = false;
  result: PredictionResult | null = null;

  // Multi-symptom selection
  selectedSymptoms: string[] = [];
  stressLevel = 3;
  mood = 3;
  energyLevel = 3;
  sleepHours = 7;
  waterIntakeMl = 2000;
  timeOfDay = 'morning';
  triggers: string[] = [];
  age = 30;
  bmi = 24;
  hasChronicCondition = false;
  exerciseHoursWeekly = 3;
  caffeineCupsDaily = 2;

  symptoms = [
    'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Insomnia',
    'Bloating', 'Joint Pain', 'Muscle Pain', 'Anxiety', 'Brain Fog',
    'Chest Tightness', 'Shortness of Breath', 'Back Pain', 'Stomach Pain',
    'Heartburn', 'Cramps', 'Numbness', 'Skin Rash'
  ];

  timesOfDay = [
    { value: 'morning', label: '🌅 Morning' },
    { value: 'afternoon', label: '☀️ Afternoon' },
    { value: 'evening', label: '🌇 Evening' },
    { value: 'night', label: '🌙 Night' },
  ];

  commonTriggers = [
    'Caffeine', 'Poor sleep', 'Stress', 'Skipped meal', 'Exercise',
    'Dehydration', 'Screen time', 'Alcohol', 'Weather', 'Medication'
  ];

  constructor(private http: HttpClient, private toastService: ToastService) {}

  ngOnInit(): void {
    this.http.get<any>(`${this.apiBase}/status`).subscribe({
      next: res => this.modelLoaded = res.modelLoaded,
      error: () => this.modelLoaded = false
    });
  }

  toggleSymptom(symptom: string): void {
    const idx = this.selectedSymptoms.indexOf(symptom);
    if (idx >= 0) this.selectedSymptoms.splice(idx, 1);
    else this.selectedSymptoms.push(symptom);
  }

  toggleTrigger(trigger: string): void {
    const idx = this.triggers.indexOf(trigger);
    if (idx >= 0) this.triggers.splice(idx, 1);
    else this.triggers.push(trigger);
  }

  predict(): void {
    if (this.selectedSymptoms.length === 0) {
      this.toastService.show('⚠️ Select at least one symptom');
      return;
    }

    this.loading = true;
    this.http.post<PredictionResult>(`${this.apiBase}/severity`, {
      stressLevel: this.stressLevel,
      mood: this.mood,
      energyLevel: this.energyLevel,
      sleepHours: this.sleepHours,
      waterIntakeMl: this.waterIntakeMl,
      timeOfDay: this.timeOfDay,
      symptoms: this.selectedSymptoms,
      triggers: this.triggers,
      age: this.age,
      bmi: this.bmi,
      hasChronicCondition: this.hasChronicCondition,
      exerciseHoursWeekly: this.exerciseHoursWeekly,
      caffeineCupsDaily: this.caffeineCupsDaily,
    }).subscribe({
      next: res => { this.result = res; this.predicted = true; this.loading = false; },
      error: () => { this.toastService.show('❌ Prediction failed'); this.loading = false; }
    });
  }

  reset(): void { this.predicted = false; this.result = null; }

  severityColor(sev: number): string {
    const map: Record<number, string> = { 1: '#7a9e7e', 2: '#a8c5ac', 3: '#e88f68', 4: '#c96a3f', 5: '#a8532c' };
    return map[sev] ?? '#8a7e78';
  }

  moodEmoji(val: number): string {
    const map: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };
    return map[val] ?? '😐';
  }

  scaleLabel(val: number): string {
    const map: Record<number, string> = { 1: 'Very Low', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Very High' };
    return map[val] ?? '';
  }

  getProbEntries(probs: Record<string, number>): { label: string; value: number; color: string }[] {
    const cm: Record<string, string> = {
      'Mild': '#7a9e7e', 'Light': '#a8c5ac', 'Moderate': '#e88f68', 'Severe': '#c96a3f', 'Very Severe': '#a8532c'
    };
    return Object.entries(probs).map(([label, value]) => ({ label, value, color: cm[label] ?? '#8a7e78' }));
  }
}