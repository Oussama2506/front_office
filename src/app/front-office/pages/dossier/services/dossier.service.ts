import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MedicalProfile, BiometricEntry, HealthAlert } from '../models/dossier.models';

@Injectable({ providedIn: 'root' })
export class DossierService {

  private defaultProfile: MedicalProfile = {
    firstName: '', lastName: '', dob: '', gender: '',
    bloodType: '', height: 0,
    allergies: [], conditions: [], medications: [],
    emergencyContact: '', isComplete: false
  };

  private profileSubject = new BehaviorSubject<MedicalProfile>({ ...this.defaultProfile });
  private entriesSubject = new BehaviorSubject<BiometricEntry[]>([]);

  profile$ = this.profileSubject.asObservable();
  entries$ = this.entriesSubject.asObservable();

  get profile(): MedicalProfile { return this.profileSubject.getValue(); }
  get entries(): BiometricEntry[] { return this.entriesSubject.getValue(); }
  get latest(): BiometricEntry | null {
    const e = this.entries;
    return e.length ? e[e.length - 1] : null;
  }
  get previous(): BiometricEntry | null {
    const e = this.entries;
    return e.length >= 2 ? e[e.length - 2] : null;
  }

  saveProfile(profile: MedicalProfile): void {
    profile.isComplete = !!(profile.firstName && profile.lastName && profile.dob && profile.gender && profile.bloodType && profile.height);
    this.profileSubject.next({ ...profile });
  }

  addEntry(entry: Omit<BiometricEntry, 'id' | 'date' | 'bmi'>): BiometricEntry {
    const bmi = this.calculateBMI(entry.weight, entry.height);
    const newEntry: BiometricEntry = {
      ...entry, id: Date.now(), bmi,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    this.entriesSubject.next([...this.entries, newEntry]);
    return newEntry;
  }

  calculateBMI(weight: number, height: number): number {
    if (!weight || !height) return 0;
    return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
  }

  getBMICategory(bmi: number): { label: string; color: string } {
    if (bmi < 18.5) return { label: 'Underweight', color: '#4ab8f0' };
    if (bmi < 25)   return { label: 'Normal',      color: '#7a9e7e' };
    if (bmi < 30)   return { label: 'Overweight',  color: '#e88f68' };
    return               { label: 'Obese',         color: '#c96a3f' };
  }

  getAlerts(): HealthAlert[] {
    const alerts: HealthAlert[] = [];
    const l = this.latest;
    const p = this.previous;
    if (!l) return alerts;

    if (p) {
      const diff = l.weight - p.weight;
      if (diff > 2)       alerts.push({ type: 'danger',  metric: 'Weight', message: `Rapid weight gain of +${diff}kg detected`,          value: `${l.weight} kg` });
      else if (diff < -3) alerts.push({ type: 'warning', metric: 'Weight', message: `Rapid weight loss of ${diff}kg detected`,            value: `${l.weight} kg` });
    }
    if (l.systolic && l.systolic > 140) alerts.push({ type: 'danger',  metric: 'Blood Pressure', message: 'Systolic BP above 140 mmHg — hypertension range', value: `${l.systolic}/${l.diastolic} mmHg` });
    else if (l.systolic && l.systolic > 130) alerts.push({ type: 'warning', metric: 'Blood Pressure', message: 'Elevated blood pressure — monitor closely',   value: `${l.systolic}/${l.diastolic} mmHg` });

    if (l.glucose && l.glucose > 126) alerts.push({ type: 'danger',  metric: 'Glucose', message: 'Fasting glucose above 126 mg/dL — diabetic range',  value: `${l.glucose} mg/dL` });
    else if (l.glucose && l.glucose > 100) alerts.push({ type: 'warning', metric: 'Glucose', message: 'Pre-diabetic glucose level detected',          value: `${l.glucose} mg/dL` });

    if (alerts.length === 0) alerts.push({ type: 'info', metric: 'General', message: 'All recorded values are within healthy ranges', value: '✓ Normal' });

    return alerts;
  }
}