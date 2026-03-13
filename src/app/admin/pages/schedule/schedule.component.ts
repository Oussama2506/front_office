import { Component } from '@angular/core';
import { AdminDataService, Appointment } from '../../services/admin-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
  days: string[];
  timeSlots: string[];

  constructor(private adminData: AdminDataService, public toastService: ToastService) {
    this.days      = this.adminData.days;
    this.timeSlots = this.adminData.timeSlots;
  }

  getAppointments(day: string, time: string): Appointment[] {
    return this.adminData.getAppointmentsForSlot(day, time);
  }

  aptBg(color: string): string {
    const map: Record<string, string> = {
      green: 'rgba(122,158,126,0.15)', blue: 'rgba(74,184,240,0.15)',
      orange: 'rgba(201,106,63,0.15)', purple: 'rgba(164,124,240,0.15)'
    };
    return map[color] ?? 'rgba(201,106,63,0.15)';
  }

  aptBorder(color: string): string {
    const map: Record<string, string> = {
      green: '#7a9e7e', blue: '#4ab8f0', orange: '#c96a3f', purple: '#a47cf0'
    };
    return map[color] ?? '#c96a3f';
  }
}