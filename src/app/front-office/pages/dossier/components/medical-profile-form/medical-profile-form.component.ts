import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { MedicalProfile } from '../../models/dossier.models';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-medical-profile-form',
  templateUrl: './medical-profile-form.component.html',
  styleUrls: ['./medical-profile-form.component.scss']
})
export class MedicalProfileFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  profile: MedicalProfile = {
    firstName: '', lastName: '', dob: '', gender: '',
    bloodType: '', height: 0,
    allergies: [], conditions: [], medications: [],
    emergencyContact: '', isComplete: false
  };

  newAllergy    = '';
  newCondition  = '';
  newMedication = '';

  bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

  constructor(
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.profile = { ...this.dossierService.profile };
  }

  addAllergy(): void {
    if (this.newAllergy.trim()) {
      this.profile.allergies = [...this.profile.allergies, this.newAllergy.trim()];
      this.newAllergy = '';
    }
  }

  removeAllergy(i: number): void {
    this.profile.allergies = this.profile.allergies.filter((_, idx) => idx !== i);
  }

  addCondition(): void {
    if (this.newCondition.trim()) {
      this.profile.conditions = [...this.profile.conditions, this.newCondition.trim()];
      this.newCondition = '';
    }
  }

  removeCondition(i: number): void {
    this.profile.conditions = this.profile.conditions.filter((_, idx) => idx !== i);
  }

  addMedication(): void {
    if (this.newMedication.trim()) {
      this.profile.medications = [...this.profile.medications, this.newMedication.trim()];
      this.newMedication = '';
    }
  }

  removeMedication(i: number): void {
    this.profile.medications = this.profile.medications.filter((_, idx) => idx !== i);
  }

  save(): void {
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.dob || !this.profile.gender || !this.profile.bloodType || !this.profile.height) {
      this.toastService.show('⚠️ Please fill in all required fields');
      return;
    }
    this.dossierService.saveProfile(this.profile);
    this.toastService.show('✅ Medical profile saved successfully!');
    this.saved.emit();
  }
}