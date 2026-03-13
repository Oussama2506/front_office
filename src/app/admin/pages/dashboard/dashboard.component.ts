import { Component } from '@angular/core';
import { AdminDataService, KpiCard, Alert, Client, Appointment } from '../../services/admin-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  kpiCards: KpiCard[];
  alerts: Alert[];
  clients: Client[];
  todayAppointments: Appointment[];

  constructor(private adminData: AdminDataService) {
    this.kpiCards           = this.adminData.kpiCards;
    this.alerts             = this.adminData.alerts;
    this.clients            = this.adminData.clients;
    this.todayAppointments  = this.adminData.appointments.filter(a => a.day === 'Mon');
  }

  statusColor(status: string): string {
    const map: Record<string, string> = { active: '#7a9e7e', inactive: '#b5aaa5', waitlist: '#c96a3f' };
    return map[status] ?? '#b5aaa5';
  }

  appointmentColor(color: string): string {
    const map: Record<string, string> = {
      green: '#7a9e7e', blue: '#4ab8f0', orange: '#c96a3f', purple: '#a47cf0'
    };
    return map[color] ?? '#c96a3f';
  }
}