import { Component, OnInit } from '@angular/core';
import { DossierService } from '../services/dossier.service';

@Component({
  selector: 'app-dossier-shell',
  templateUrl: './dossier-shell.component.html',
  styleUrls: ['./dossier-shell.component.scss']
})
export class DossierShellComponent implements OnInit {
  profile: any = null;
  hasEntries = false;
  activeTab = 'dashboard';
  loading = true;

  tabs = [
    { value: 'dashboard', label: '📊 My Health',       show: 'always'     },
    { value: 'charts',    label: '📈 Progress',         show: 'hasEntries' },
    { value: 'alerts',    label: '⚠️ Alerts',           show: 'hasEntries' },
    { value: 'add',       label: '➕ Add Measurement',   show: 'always'     },
    { value: 'profile',   label: '👤 Medical Profile',  show: 'always'     },
  ];

  constructor(public dossierService: DossierService) {}

  ngOnInit(): void {
    // Load both profile and biometrics from backend on page load
    this.dossierService.loadProfile();
    this.dossierService.loadBiometrics();

    this.dossierService.profile$.subscribe(p => {
      this.profile  = p;
      this.loading  = false;
    });

    this.dossierService.entries$.subscribe(e => {
      this.hasEntries = e.length > 0;
      if (!this.hasEntries && this.activeTab === 'charts') {
        this.activeTab = 'dashboard';
      }
    });
  }

  get visibleTabs() {
    return this.tabs.filter(t =>
      t.show === 'always' || (t.show === 'hasEntries' && this.hasEntries)
    );
  }

get pageSubtitle(): string {
  if (this.loading) return 'Loading your health data…';
  if (!this.profile || !this.profile.complete) return 'Complete your medical profile to get started';
  if (!this.hasEntries) return 'Add your first biometric measurement';
  return `Last updated: ${this.dossierService.latest?.recordedAt
    ? new Date(this.dossierService.latest.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'}`;
}
get isProfileComplete(): boolean {
  return this.profile?.complete ?? false;
}

get profileInitials(): string {
  if (!this.profile) return '';
  return (this.profile.firstName?.[0] ?? '') + (this.profile.lastName?.[0] ?? '');
}

get profileFullName(): string {
  if (!this.profile) return '';
  return `${this.profile.firstName ?? ''} ${this.profile.lastName ?? ''}`.trim();
}

get profileBloodType(): string { return this.profile?.bloodType ?? ''; }
get profileGender(): string    { return this.profile?.gender ?? ''; }
  
}