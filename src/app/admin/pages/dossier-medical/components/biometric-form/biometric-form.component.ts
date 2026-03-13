import { Component, Input } from '@angular/core';
import { DossierDataService } from '../../services/dossier-data.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-biometric-form',
  templateUrl: './biometric-form.component.html',
  styleUrls: ['./biometric-form.component.scss']
})
export class BiometricFormComponent {
  @Input() clientId!: number;

  weight    = 0;
  height    = 0;
  bodyFat   = 0;
  muscleMass = 0;
  systolic  = 0;
  diastolic = 0;
  glucose   = 0;
  notes     = '';

  bmi       = 0;
  bmiLabel  = '';
  bmiColor  = '';

  constructor(
    private toastService: ToastService,
    private dossierService: DossierDataService
  ) {}

  onWeightOrHeightChange(): void {
    if (this.weight > 0 && this.height > 0) {
      this.bmi      = this.dossierService.calculateBMI(this.weight, this.height);
      const cat     = this.dossierService.getBMICategory(this.bmi);
      this.bmiLabel = cat.label;
      this.bmiColor = cat.color;
    }
  }

  submit(): void {
    if (!this.weight || !this.height) {
      this.toastService.show('⚠️ Weight and height are required');
      return;
    }
    this.toastService.show('✅ Biometric entry saved successfully!');
    this.reset();
  }

  reset(): void {
    this.weight = 0; this.height = 0; this.bodyFat = 0;
    this.muscleMass = 0; this.systolic = 0; this.diastolic = 0;
    this.glucose = 0; this.notes = ''; this.bmi = 0;
  }
}