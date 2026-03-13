import { Component, EventEmitter, Output } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-biometric-entry',
  templateUrl: './biometric-entry.component.html',
  styleUrls: ['./biometric-entry.component.scss']
})
export class BiometricEntryComponent {
  @Output() saved = new EventEmitter<void>();

  weight     = 0;
  height     = 0;
  bodyFat    = 0;
  muscleMass = 0;
  systolic   = 0;
  diastolic  = 0;
  glucose    = 0;
  notes      = '';

  bmi       = 0;
  bmiLabel  = '';
  bmiColor  = '';

  constructor(
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  onMeasureChange(): void {
    if (this.weight > 0 && this.height > 0) {
      this.bmi = this.dossierService.calculateBMI(this.weight, this.height);
      const cat = this.dossierService.getBMICategory(this.bmi);
      this.bmiLabel = cat.label;
      this.bmiColor = cat.color;
    }
  }

  submit(): void {
    if (!this.weight || !this.height) {
      this.toastService.show('⚠️ Weight and height are required');
      return;
    }
    this.dossierService.addEntry({
      weight: this.weight, height: this.height,
      bodyFat:    this.bodyFat    || null,
      muscleMass: this.muscleMass || null,
      systolic:   this.systolic   || null,
      diastolic:  this.diastolic  || null,
      glucose:    this.glucose    || null,
      notes: this.notes
    });
    this.toastService.show('✅ Measurement saved!');
    this.saved.emit();
  }
  scaleWidth(bmi: number): string {
  return Math.min((bmi / 40) * 100, 100) + '%';
}
}