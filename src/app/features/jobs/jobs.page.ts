import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobStore } from '../../core/job.store';
import { Job, JobStatus } from '../../core/models';
import { JobFormComponent } from '../shared/job-form.component';

@Component({
  selector: 'app-jobs-page',
  imports: [CommonModule, JobFormComponent],
  templateUrl: './jobs.page.html',
  styleUrl: './jobs.page.css',
})
export class JobsPage {
  protected readonly store = inject(JobStore);
  protected readonly selected = signal<Job | null>(null);
  protected readonly creating = signal(false);
  protected async setStatus(status: JobStatus): Promise<void> {
    const job = this.selected();
    if (job) this.selected.set(await this.store.changeStatus(job.id, status));
  }
}
