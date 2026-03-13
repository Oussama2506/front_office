import { Component } from '@angular/core';
import { AdminDataService, Client } from '../../services/admin-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  allClients: Client[];
  filteredClients: Client[];
  searchQuery = '';
  activeStatus = 'all';

  statusFilters = ['all', 'active', 'inactive', 'waitlist'];

  constructor(private adminData: AdminDataService, public toastService: ToastService) {
    this.allClients      = this.adminData.clients;
    this.filteredClients = this.allClients;
  }

  onSearch(): void {
    this.applyFilters();
  }

  setStatus(status: string): void {
    this.activeStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = this.allClients;

    // filter by status
    if (this.activeStatus !== 'all') {
      results = results.filter(c => c.status === this.activeStatus);
    }

    // filter by search query
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      results = results.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.goal.toLowerCase().includes(q)
      );
    }

    this.filteredClients = results;
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      active: '#7a9e7e', inactive: '#b5aaa5', waitlist: '#c96a3f'
    };
    return map[status] ?? '#b5aaa5';
  }

  viewClient(client: Client): void {
    this.toastService.show(`👤 Opening profile: ${client.name}`);
  }

  openMealPlan(client: Client): void {
    this.toastService.show(`📋 Opening meal plan for: ${client.name}`);
  }
}