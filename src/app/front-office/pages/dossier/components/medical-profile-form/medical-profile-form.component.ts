import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-medical-profile-form',
  templateUrl: './medical-profile-form.component.html',
  styleUrls: ['./medical-profile-form.component.scss']
})
export class MedicalProfileFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  profile = {
    firstName: '', lastName: '', dob: '', gender: '' as any,
    bloodType: '', height: 0,
    allergies: [] as string[], conditions: [] as string[], medications: [] as string[],
    emergencyContact: '', isComplete: false
  };

  newAllergy    = '';
  newCondition  = '';
  newMedication = '';
  saving        = false;

  bloodTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];

  constructor(
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Pre-fill form if profile already exists in backend
    const existing = this.dossierService.profile;
    if (existing) {
      this.profile.firstName      = existing.firstName     ?? '';
      this.profile.lastName       = existing.lastName      ?? '';
      this.profile.dob            = existing.dateOfBirth   ?? '';
      this.profile.gender         = existing.gender        ?? '';
      this.profile.bloodType      = existing.bloodType     ?? '';
      this.profile.height         = existing.height        ?? 0;
      this.profile.emergencyContact = existing.emergencyContact ?? '';
      this.profile.allergies      = [...(existing.allergies   ?? [])];
      this.profile.conditions     = [...(existing.conditions  ?? [])];
      this.profile.medications    = [...(existing.medications ?? [])];
    }
  }

  addAllergy():    void { if (this.newAllergy.trim())    { this.profile.allergies    = [...this.profile.allergies,    this.newAllergy.trim()];    this.newAllergy    = ''; } }
  removeAllergy(i: number):    void { this.profile.allergies    = this.profile.allergies.filter((_,idx) => idx !== i); }
  addCondition():  void { if (this.newCondition.trim())  { this.profile.conditions   = [...this.profile.conditions,   this.newCondition.trim()];  this.newCondition  = ''; } }
  removeCondition(i: number):  void { this.profile.conditions   = this.profile.conditions.filter((_,idx) => idx !== i); }
  addMedication(): void { if (this.newMedication.trim()) { this.profile.medications  = [...this.profile.medications,  this.newMedication.trim()]; this.newMedication = ''; } }
  removeMedication(i: number): void { this.profile.medications  = this.profile.medications.filter((_,idx) => idx !== i); }

save(): void {
  if (!this.profile.firstName || !this.profile.lastName || !this.profile.dob ||
      !this.profile.gender || !this.profile.bloodType || !this.profile.height) {
    this.toastService.show('⚠️ Please fill in all required fields');
    return;
  }

  this.saving = true;
  this.dossierService.saveProfile({
    firstName:        this.profile.firstName,
    lastName:         this.profile.lastName,
    dateOfBirth:      this.profile.dob,
    gender:           this.profile.gender,
    bloodType:        this.profile.bloodType,
    height:           this.profile.height,
    emergencyContact: this.profile.emergencyContact,
    allergies:        this.profile.allergies,
    conditions:       this.profile.conditions,
    medications:      this.profile.medications,
  }).subscribe({
    next: () => {
      this.toastService.show('✅ Medical profile saved! Now add your first measurement.');
      this.saving = false;
      this.saved.emit();
    },
    error: () => {
      this.toastService.show('❌ Failed to save profile. Is the backend running?');
      this.saving = false;
    }
  });
}
}