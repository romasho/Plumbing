import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobStore } from '../../core/job.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  protected readonly store = inject(JobStore);
  protected readonly inProgress = computed(
    () => this.store.jobs().filter((j) => j.status === 'In Progress').length,
  );
  protected readonly completed = computed(
    () => this.store.jobs().filter((j) => j.status === 'Completed').length,
  );
}
