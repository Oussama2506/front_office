import { Component, OnInit } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { HealthAlert } from '../../models/dossier.models';

@Component({
  selector: 'app-health-alerts',
  templateUrl: './health-alerts.component.html',
  styleUrls: ['./health-alerts.component.scss']
})
export class HealthAlertsComponent implements OnInit {
  alerts: HealthAlert[] = [];

  constructor(private dossierService: DossierService) {}
  ngOnInit(): void { this.alerts = this.dossierService.getAlerts(); }

  color(type: string): string {
    return { danger: '#c96a3f', warning: '#e88f68', info: '#7a9e7e' }[type] ?? '#b5aaa5';
  }
  bg(type: string): string {
    return { danger: 'rgba(201,106,63,0.06)', warning: 'rgba(232,143,104,0.06)', info: 'rgba(122,158,126,0.06)' }[type] ?? '#faf7f4';
  }
  icon(type: string): string {
    return { danger: '🚨', warning: '⚠️', info: '✅' }[type] ?? 'ℹ️';
  }
  get dangerCount()  { return this.alerts.filter(a => a.type === 'danger').length; }
  get warningCount() { return this.alerts.filter(a => a.type === 'warning').length; }
  get infoCount()    { return this.alerts.filter(a => a.type === 'info').length; }
}