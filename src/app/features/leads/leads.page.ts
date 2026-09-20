import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobStore } from '../../core/job.store';
import { Lead } from '../../core/models';
import { JobFormComponent } from '../shared/job-form.component';

@Component({
  selector: 'app-leads-page',
  imports: [CommonModule, JobFormComponent],
  templateUrl: './leads.page.html',
  styleUrl: './leads.page.css',
})
export class LeadsPage {
  protected readonly store = inject(JobStore);
  protected readonly selectedLead = signal<Lead | null>(null);
  protected readonly formOpen = signal(false);
}
