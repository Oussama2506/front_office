import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { MealPlansAdminComponent } from './pages/meal-plans-admin/meal-plans-admin.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [
    AdminShellComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    ClientsComponent,
    MealPlansAdminComponent,
    ScheduleComponent,
    ReportsComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,        // ← add this
    AdminRoutingModule,
  ]
})
export class AdminModule {}