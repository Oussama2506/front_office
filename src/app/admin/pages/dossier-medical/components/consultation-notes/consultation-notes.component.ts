import { Component, Input, OnInit } from '@angular/core';
import { DossierDataService } from '../../services/dossier-data.service';
import { ConsultationNote } from '../../models/dossier.models';

@Component({
  selector: 'app-consultation-notes',
  templateUrl: './consultation-notes.component.html',
  styleUrls: ['./consultation-notes.component.scss']
})
export class ConsultationNotesComponent implements OnInit {
  @Input() clientId!: number;
  notes: ConsultationNote[] = [];
  expanded: number | null = null;

  constructor(private dossierService: DossierDataService) {}

  ngOnInit(): void {
    this.notes = this.dossierService.getNotes(this.clientId);
  }

  toggle(id: number): void {
    this.expanded = this.expanded === id ? null : id;
  }

  typeColor(type: string): string {
    const map: Record<string, string> = {
      'Initial Consultation': '#7a9e7e',
      'Follow-up':            '#c96a3f',
      'Progress Review':      '#a47cf0',
      'Urgent Review':        '#e88f68',
    };
    return map[type] ?? '#b5aaa5';
  }
}