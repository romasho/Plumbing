import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { JobStore } from './core/job.store';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(JobStore);
  protected readonly sidebarOpen = signal(false);
  protected readonly jobsToday = computed(
    () => this.store.jobs().filter((job) => job.scheduledDate === this.store.today()).length,
  );
  protected readonly syncState = this.store.syncState;
}
