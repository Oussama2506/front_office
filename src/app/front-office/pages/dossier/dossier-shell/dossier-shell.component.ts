import { Component, OnInit } from '@angular/core';
import { DossierService } from '../services/dossier.service';
import { MedicalProfile, BiometricEntry } from '../models/dossier.models';

@Component({
  selector: 'app-dossier-shell',
  templateUrl: './dossier-shell.component.html',
  styleUrls: ['./dossier-shell.component.scss']
})
export class DossierShellComponent implements OnInit {
  profile!: MedicalProfile;
  hasEntries = false;
  activeTab = 'dashboard';

  tabs = [
    { value: 'dashboard', label: '📊 My Health',        show: 'always'    },
    { value: 'charts',    label: '📈 Progress',          show: 'hasEntries'},
    { value: 'alerts',    label: '⚠️ Alerts',            show: 'hasEntries'},
    { value: 'add',       label: '➕ Add Measurement',    show: 'always'    },
    { value: 'profile',   label: '👤 Medical Profile',   show: 'always'    },
  ];

  constructor(public dossierService: DossierService) {}

  ngOnInit(): void {
    this.dossierService.profile$.subscribe(p => this.profile = p);
    this.dossierService.entries$.subscribe(e => {
      this.hasEntries = e.length > 0;
      if (!this.hasEntries && this.activeTab === 'charts') this.activeTab = 'dashboard';
    });
  }

  get visibleTabs() {
    return this.tabs.filter(t => t.show === 'always' || (t.show === 'hasEntries' && this.hasEntries));
  }

  get pageSubtitle(): string {
    if (!this.profile.isComplete) return 'Complete your medical profile to get started';
    if (!this.hasEntries) return 'Add your first biometric measurement';
    return `Last updated: ${this.dossierService.latest?.date ?? '—'}`;
  }
}