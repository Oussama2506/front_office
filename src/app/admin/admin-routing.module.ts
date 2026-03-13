import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { MealPlansAdminComponent } from './pages/meal-plans-admin/meal-plans-admin.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: DashboardComponent },
      { path: 'clients',    component: ClientsComponent },
      { path: 'meal-plans', component: MealPlansAdminComponent },
      { path: 'schedule',   component: ScheduleComponent },
      { path: 'reports',    component: ReportsComponent },
      { path: 'settings',   component: SettingsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}