import { Component, OnInit } from '@angular/core';
import { DossierService } from '../../services/dossier.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { BiometricResponse, MedicalProfileResponse } from '../../services/api.service';

@Component({
  selector: 'app-health-report',
  templateUrl: './health-report.component.html',
  styleUrls: ['./health-report.component.scss']
})
export class HealthReportComponent implements OnInit {
  profile: MedicalProfileResponse | null = null;
  entries: BiometricResponse[] = [];
  hasData = false;
  generating = false;
  reportGenerated = false;

  // Report configuration
  includeSections = {
    profile: true,
    biometrics: true,
    trends: true,
    alerts: true,
    recommendations: true,
  };

  reportPeriod = 'all';
  periods = [
    { value: 'all',      label: 'All time' },
    { value: '3months',  label: 'Last 3 months' },
    { value: '6months',  label: 'Last 6 months' },
    { value: '1year',    label: 'Last year' },
  ];

  constructor(
    private dossierService: DossierService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.dossierService.profile$.subscribe(p => this.profile = p);
    this.dossierService.entries$.subscribe(entries => {
      this.entries = entries;
      this.hasData = entries.length > 0 && !!this.profile;
    });
  }

  get selectedSectionCount(): number {
    return Object.values(this.includeSections).filter(v => v).length;
  }

  get filteredEntries(): BiometricResponse[] {
    if (this.reportPeriod === 'all') return this.entries;
    const now = new Date();
    let cutoff: Date;
    switch (this.reportPeriod) {
      case '3months':  cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); break;
      case '6months':  cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()); break;
      case '1year':    cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
      default:         return this.entries;
    }
    return this.entries.filter(e => new Date(e.recordedAt) >= cutoff);
  }

  generateReport(): void {
    this.generating = true;
    // Simulate generation delay for UX
    setTimeout(() => {
      this.downloadPDF();
      this.generating = false;
      this.reportGenerated = true;
      this.toastService.show('📄 Health report downloaded!');
    }, 1500);
  }

  private downloadPDF(): void {
    const entries = this.filteredEntries;
    const latest = entries.length ? entries[entries.length - 1] : null;
    const bmiCat = latest ? this.dossierService.getBMICategory(latest.bmi) : null;

    // Build HTML content for printing as PDF
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PeakWell Health Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #2d2d2d; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #c96a3f; }
        .header h1 { font-size: 28px; color: #c96a3f; margin-bottom: 4px; }
        .header .subtitle { font-size: 14px; color: #8a7e78; }
        .header .date { font-size: 12px; color: #b5aaa5; margin-top: 8px; }
        .section { margin-bottom: 32px; }
        .section-title { font-size: 18px; font-weight: 600; color: #c96a3f; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #ede8e3; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #f0ebe5; }
        .info-label { font-size: 13px; color: #8a7e78; }
        .info-value { font-size: 13px; font-weight: 600; color: #1e1a16; }
        .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .tag { padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .tag-allergy { background: #fde8d8; color: #a85430; }
        .tag-condition { background: #ede8fe; color: #7a4eb0; }
        .tag-medication { background: #e8f0dd; color: #4a7a4e; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
        th { background: #faf7f4; padding: 10px 8px; text-align: left; font-weight: 600; color: #8a7e78; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ede8e3; }
        td { padding: 8px; border-bottom: 1px solid #f5f1ed; color: #2d2d2d; }
        .metric-card { display: inline-block; background: #faf7f4; border-radius: 12px; padding: 16px 20px; margin: 4px; min-width: 140px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: 700; }
        .metric-label { font-size: 11px; color: #8a7e78; margin-top: 4px; }
        .metric-status { font-size: 10px; font-weight: 600; margin-top: 2px; }
        .alert { padding: 10px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
        .alert-danger { background: rgba(201,106,63,0.08); border-left: 3px solid #c96a3f; }
        .alert-warning { background: rgba(232,143,104,0.08); border-left: 3px solid #e88f68; }
        .alert-info { background: rgba(122,158,126,0.08); border-left: 3px solid #7a9e7e; }
        .recommendation { padding: 8px 0; border-bottom: 1px solid #f5f1ed; font-size: 13px; }
        .recommendation strong { color: #c96a3f; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #ede8e3; text-align: center; font-size: 11px; color: #b5aaa5; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PeakWell Health Report</h1>
        <div class="subtitle">Comprehensive Medical & Biometric Summary</div>
        <div class="date">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>`;

    // Profile Section
    if (this.includeSections.profile && this.profile) {
      const p = this.profile;
      html += `
      <div class="section">
        <div class="section-title">👤 Patient Profile</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${p.firstName} ${p.lastName}</span></div>
          <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${p.dateOfBirth || '—'}</span></div>
          <div class="info-row"><span class="info-label">Gender</span><span class="info-value">${p.gender || '—'}</span></div>
          <div class="info-row"><span class="info-label">Blood Type</span><span class="info-value">${p.bloodType || '—'}</span></div>
          <div class="info-row"><span class="info-label">Height</span><span class="info-value">${p.height ? p.height + ' cm' : '—'}</span></div>
          <div class="info-row"><span class="info-label">Emergency Contact</span><span class="info-value">${p.emergencyContact || '—'}</span></div>
        </div>`;

      if (p.allergies?.length) {
        html += `<div style="margin-top:16px"><strong style="font-size:12px;color:#8a7e78">ALLERGIES</strong><div class="tag-list">${p.allergies.map(a => `<span class="tag tag-allergy">${a}</span>`).join('')}</div></div>`;
      }
      if (p.conditions?.length) {
        html += `<div style="margin-top:12px"><strong style="font-size:12px;color:#8a7e78">CONDITIONS</strong><div class="tag-list">${p.conditions.map(c => `<span class="tag tag-condition">${c}</span>`).join('')}</div></div>`;
      }
      if (p.medications?.length) {
        html += `<div style="margin-top:12px"><strong style="font-size:12px;color:#8a7e78">MEDICATIONS</strong><div class="tag-list">${p.medications.map(m => `<span class="tag tag-medication">${m}</span>`).join('')}</div></div>`;
      }
      html += `</div>`;
    }

    // Current Metrics
    if (this.includeSections.biometrics && latest) {
      html += `
      <div class="section">
        <div class="section-title">📊 Current Biometric Summary</div>
        <div style="text-align:center;margin-bottom:16px">
          <div class="metric-card"><div class="metric-value" style="color:#c96a3f">${latest.weight}</div><div class="metric-label">Weight (kg)</div></div>
          <div class="metric-card"><div class="metric-value" style="color:${bmiCat?.color || '#8a7e78'}">${latest.bmi}</div><div class="metric-label">BMI</div><div class="metric-status" style="color:${bmiCat?.color || '#8a7e78'}">${bmiCat?.label || ''}</div></div>
          <div class="metric-card"><div class="metric-value" style="color:#e88f68">${latest.bodyFat ?? '—'}${latest.bodyFat ? '%' : ''}</div><div class="metric-label">Body Fat</div></div>
          <div class="metric-card"><div class="metric-value" style="color:#7a9e7e">${latest.muscleMass ?? '—'}${latest.muscleMass ? ' kg' : ''}</div><div class="metric-label">Muscle Mass</div></div>
          <div class="metric-card"><div class="metric-value" style="color:#a47cf0">${latest.systolic ? latest.systolic + '/' + latest.diastolic : '—'}</div><div class="metric-label">Blood Pressure</div></div>
          <div class="metric-card"><div class="metric-value" style="color:#4ab8f0">${latest.glucose ?? '—'}${latest.glucose ? ' mg/dL' : ''}</div><div class="metric-label">Glucose</div></div>
        </div>
      </div>`;
    }

    // Measurement History
    if (this.includeSections.trends && entries.length > 1) {
      html += `
      <div class="section">
        <div class="section-title">📈 Measurement History</div>
        <table>
          <thead><tr><th>Date</th><th>Weight</th><th>BMI</th><th>Body Fat</th><th>BP</th><th>Glucose</th></tr></thead>
          <tbody>`;
      for (const e of entries) {
        const date = new Date(e.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        html += `<tr>
          <td>${date}</td>
          <td>${e.weight} kg</td>
          <td>${e.bmi}</td>
          <td>${e.bodyFat ? e.bodyFat + '%' : '—'}</td>
          <td>${e.systolic ? e.systolic + '/' + e.diastolic : '—'}</td>
          <td>${e.glucose ? e.glucose + ' mg/dL' : '—'}</td>
        </tr>`;
      }
      html += `</tbody></table>`;

      // Weight change summary
      const first = entries[0];
      const weightChange = Math.round((latest!.weight - first.weight) * 10) / 10;
      const bmiChange = Math.round((latest!.bmi - first.bmi) * 10) / 10;
      html += `
        <div style="margin-top:16px;padding:12px 18px;background:#faf7f4;border-radius:10px;font-size:13px">
          <strong>Period Summary:</strong>
          Weight change: <strong style="color:${weightChange <= 0 ? '#7a9e7e' : '#c96a3f'}">${weightChange > 0 ? '+' : ''}${weightChange} kg</strong> &nbsp;|&nbsp;
          BMI change: <strong style="color:${bmiChange <= 0 ? '#7a9e7e' : '#c96a3f'}">${bmiChange > 0 ? '+' : ''}${bmiChange}</strong> &nbsp;|&nbsp;
          Measurements recorded: <strong>${entries.length}</strong>
        </div>
      </div>`;
    }

    // Health Alerts
    if (this.includeSections.alerts && latest) {
      html += `<div class="section"><div class="section-title">⚠️ Health Alerts</div>`;
      const alerts = this.generateAlerts(entries);
      for (const alert of alerts) {
        html += `<div class="alert alert-${alert.type}"><strong>${alert.metric}:</strong> ${alert.message} — Current: ${alert.value}</div>`;
      }
      html += `</div>`;
    }

    // Recommendations
    if (this.includeSections.recommendations && latest) {
      html += `<div class="section"><div class="section-title">💡 Personalized Recommendations</div>`;
      const recs = this.generateRecommendations(latest);
      for (const rec of recs) {
        html += `<div class="recommendation"><strong>${rec.area}:</strong> ${rec.text}</div>`;
      }
      html += `</div>`;
    }

    html += `
      <div class="footer">
        <p>This report was generated by PeakWell — Nourish & Bloom Health Platform</p>
        <p>This document is for informational purposes only and does not constitute medical advice.</p>
        <p>Please consult your healthcare provider for medical decisions.</p>
      </div>
    </body></html>`;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  }

  private generateAlerts(entries: BiometricResponse[]): Array<{type: string; metric: string; message: string; value: string}> {
    const alerts: Array<{type: string; metric: string; message: string; value: string}> = [];
    if (!entries.length) return alerts;
    const latest = entries[entries.length - 1];
    const prev = entries.length >= 2 ? entries[entries.length - 2] : null;

    if (prev) {
      const diff = Math.round((latest.weight - prev.weight) * 10) / 10;
      if (diff > 2) alerts.push({ type: 'danger', metric: 'Weight', message: `Rapid gain of +${diff} kg`, value: `${latest.weight} kg` });
      else if (diff < -3) alerts.push({ type: 'warning', metric: 'Weight', message: `Rapid loss of ${diff} kg`, value: `${latest.weight} kg` });
    }
    if (latest.systolic && latest.systolic > 140) alerts.push({ type: 'danger', metric: 'Blood Pressure', message: 'Hypertension range', value: `${latest.systolic}/${latest.diastolic} mmHg` });
    else if (latest.systolic && latest.systolic > 130) alerts.push({ type: 'warning', metric: 'Blood Pressure', message: 'Elevated', value: `${latest.systolic}/${latest.diastolic} mmHg` });
    if (latest.glucose && latest.glucose > 126) alerts.push({ type: 'danger', metric: 'Glucose', message: 'Diabetic range', value: `${latest.glucose} mg/dL` });
    else if (latest.glucose && latest.glucose > 100) alerts.push({ type: 'warning', metric: 'Glucose', message: 'Pre-diabetic range', value: `${latest.glucose} mg/dL` });
    if (!alerts.length) alerts.push({ type: 'info', metric: 'General', message: 'All values within healthy ranges', value: '✓ Normal' });
    return alerts;
  }

  private generateRecommendations(latest: BiometricResponse): Array<{area: string; text: string}> {
    const recs: Array<{area: string; text: string}> = [];
    if (latest.bmi > 25) recs.push({ area: 'Nutrition', text: 'Consider reducing daily caloric intake by 300-500 kcal and increasing fiber-rich foods.' });
    if (latest.bmi < 18.5) recs.push({ area: 'Nutrition', text: 'Increase caloric intake with nutrient-dense foods. Consider consulting a dietitian.' });
    if (latest.systolic && latest.systolic > 130) recs.push({ area: 'Cardiovascular', text: 'Reduce sodium intake, increase potassium-rich foods, and practice stress management.' });
    if (latest.glucose && latest.glucose > 100) recs.push({ area: 'Metabolic', text: 'Adopt a low-glycemic diet, increase fiber intake, and walk 15 minutes after meals.' });
    recs.push({ area: 'Hydration', text: `Aim for ${Math.round(latest.weight * 0.033 * 10) / 10}L of water daily based on your weight.` });
    recs.push({ area: 'Activity', text: 'Maintain at least 150 minutes of moderate-intensity exercise per week.' });
    recs.push({ area: 'Sleep', text: 'Prioritize 7-9 hours of quality sleep per night for optimal recovery and metabolism.' });
    return recs;
  }
}