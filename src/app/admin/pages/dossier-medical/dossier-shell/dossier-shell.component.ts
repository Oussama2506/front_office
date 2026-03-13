import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierDataService } from '../services/dossier-data.service';
import { DossierClient, BiometricEntry } from '../models/dossier.models';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-dossier-shell',
  templateUrl: './dossier-shell.component.html',
  styleUrls: ['./dossier-shell.component.scss']
})
export class DossierShellComponent implements OnInit {
  client: DossierClient | undefined;
  activeTab = 'dashboard';
  tabs = [
    { value: 'dashboard',  label: '📊 Dashboard'         },
    { value: 'biometrics', label: '📏 Biometric History'  },
    { value: 'charts',     label: '📈 Charts & Trends'    },
    { value: 'alerts',     label: '⚠️ Alerts'             },
    { value: 'notes',      label: '📝 Consultation Notes' },
    { value: 'add',        label: '➕ Add Entry'           },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dossierService: DossierDataService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.client = this.dossierService.getClient(id);
    if (!this.client) this.router.navigate(['/admin/clients']);
  }

  exportPDF(): void {
    this.toastService.show('📄 Generating PDF report…');
  }

  printDossier(): void {
    this.toastService.show('🖨️ Preparing print view…');
  }

  goBack(): void {
    this.router.navigate(['/admin/clients']);
  }
  getEntries() {
  return this.dossierService.getBiometrics(this.client!.id);
}

  getBMIColor(bmi: number): string {
    return this.dossierService.getBMICategory(bmi).color;
}
}