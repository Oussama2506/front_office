import { Component, OnInit } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { MetricCard } from '../../models/dossier.models';

@Component({
  selector: 'app-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit {
  metrics: MetricCard[] = [];
  hasData  = false;
  bmiLabel = '';
  bmiColor = '';
  latest: any = null;

  constructor(public dossierService: DossierService) {}

  ngOnInit(): void {
    this.dossierService.entries$.subscribe(() => this.build());
  }

  build(): void {
    const l = this.dossierService.latest;
    const p = this.dossierService.previous;
    this.latest  = l;
    this.hasData = !!l;
    if (!l) return;

    const bmiCat = this.dossierService.getBMICategory(l.bmi);
    this.bmiLabel = bmiCat.label;
    this.bmiColor = bmiCat.color;

    this.metrics = [
      {
        label: 'Weight', icon: '⚖️', color: '#c96a3f',
        value: `${l.weight} kg`, unit: 'kg',
        change: p ? l.weight - p.weight : null,
        good: p ? l.weight <= p.weight : true
      },
      {
        label: 'BMI', icon: '📏', color: bmiCat.color,
        value: `${l.bmi}`, unit: '',
        change: p ? Math.round((l.bmi - p.bmi) * 10) / 10 : null,
        status: bmiCat.label, statusColor: bmiCat.color,
        good: p ? l.bmi <= p.bmi : true
      },
      {
        label: 'Body Fat', icon: '🔬', color: '#e88f68',
        value: l.bodyFat ? `${l.bodyFat}%` : '—', unit: '%',
        change: p && l.bodyFat && p.bodyFat ? l.bodyFat - p.bodyFat : null,
        good: p && l.bodyFat && p.bodyFat ? l.bodyFat <= p.bodyFat : true
      },
      {
        label: 'Muscle Mass', icon: '💪', color: '#7a9e7e',
        value: l.muscleMass ? `${l.muscleMass} kg` : '—', unit: 'kg',
        change: p && l.muscleMass && p.muscleMass ? l.muscleMass - p.muscleMass : null,
        good: p && l.muscleMass && p.muscleMass ? l.muscleMass >= p.muscleMass : true
      },
      {
        label: 'Blood Pressure', icon: '❤️', color: '#a47cf0',
        value: l.systolic ? `${l.systolic}/${l.diastolic}` : '—', unit: 'mmHg',
        change: null,
        status: !l.systolic ? '' : l.systolic > 140 ? 'High' : l.systolic > 130 ? 'Elevated' : 'Normal',
        statusColor: !l.systolic ? '' : l.systolic > 140 ? '#c96a3f' : l.systolic > 130 ? '#e88f68' : '#7a9e7e',
        good: !l.systolic || l.systolic <= 130
      },
      {
        label: 'Glucose', icon: '🩸', color: '#4ab8f0',
        value: l.glucose ? `${l.glucose} mg/dL` : '—', unit: 'mg/dL',
        change: p && l.glucose && p.glucose ? l.glucose - p.glucose : null,
        status: !l.glucose ? '' : l.glucose > 126 ? 'Diabetic' : l.glucose > 100 ? 'Pre-diabetic' : 'Normal',
        statusColor: !l.glucose ? '' : l.glucose > 126 ? '#c96a3f' : l.glucose > 100 ? '#e88f68' : '#7a9e7e',
        good: !l.glucose || l.glucose <= 100
      },
    ];
  }

  changeStr(change: number | null): string {
    if (change === null || change === 0) return '';
    return (change > 0 ? '+' : '') + change;
  }
}