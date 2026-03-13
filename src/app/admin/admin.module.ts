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
import { DossierShellComponent } from './pages/dossier-medical/dossier-shell/dossier-shell.component';
import { BiometricFormComponent } from './pages/dossier-medical/components/biometric-form/biometric-form.component';
import { HealthDashboardComponent } from './pages/dossier-medical/components/health-dashboard/health-dashboard.component';
import { BiometricChartsComponent } from './pages/dossier-medical/components/biometric-charts/biometric-charts.component';
import { AlertsPanelComponent } from './pages/dossier-medical/components/alerts-panel/alerts-panel.component';
import { ConsultationNotesComponent } from './pages/dossier-medical/components/consultation-notes/consultation-notes.component';

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
    DossierShellComponent,
    BiometricFormComponent,
    HealthDashboardComponent,
    BiometricChartsComponent,
    AlertsPanelComponent,
    ConsultationNotesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
  ]
})
export class AdminModule {}