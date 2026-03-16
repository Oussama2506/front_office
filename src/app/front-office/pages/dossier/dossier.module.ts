import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DossierRoutingModule } from './dossier-routing.module';

import { DossierShellComponent }       from './dossier-shell/dossier-shell.component';
import { MedicalProfileFormComponent } from './components/medical-profile-form/medical-profile-form.component';
import { BiometricEntryComponent }     from './components/biometric-entry/biometric-entry.component';
import { HealthDashboardComponent }    from './components/health-dashboard/health-dashboard.component';
import { ProgressChartsComponent }     from './components/progress-charts/progress-charts.component';
import { HealthAlertsComponent }       from './components/health-alerts/health-alerts.component';
import { AiInsightsComponent } from './components/ai-insights/ai-insights.component';
import { GoalTrackingComponent } from './components/goal-tracking/goal-tracking.component';
import { HealthReportComponent } from './components/health-report/health-report.component';
import { FilterBySeverityPipe } from './pipes/filter-severity.pipe';
import { SymptomJournalComponent } from './components/symptom-journal/symptom-journal.component';

@NgModule({
  declarations: [
    DossierShellComponent,
    MedicalProfileFormComponent,
    BiometricEntryComponent,
    HealthDashboardComponent,
    ProgressChartsComponent,
    HealthAlertsComponent,
    AiInsightsComponent,
    GoalTrackingComponent,
    HealthReportComponent,
    FilterBySeverityPipe,
    SymptomJournalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DossierRoutingModule,
  ]
})
export class DossierModule {}