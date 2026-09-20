import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Job, JobStatus, Lead } from './models';

const apiUrl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class JobStore {
  private readonly http = inject(HttpClient);
  readonly jobs = signal<Job[]>([]);
  readonly syncState = signal<'syncing' | 'synced' | 'offline'>('syncing');
  readonly leads = signal<Lead[]>([
    {
      id: 'LEAD-208',
      name: 'Emily Wilson',
      phone: '(555) 782-1910',
      source: 'Phone',
      type: 'Pipe Leak',
      note: 'Water appearing near basement wall.',
    },
    {
      id: 'LEAD-207',
      name: 'David Brooks',
      phone: '(555) 337-2008',
      source: 'Google Ads',
      type: 'Drain Cleaning',
      note: 'Kitchen drain is completely blocked.',
    },
    {
      id: 'LEAD-206',
      name: 'Nina Adams',
      phone: '(555) 520-0084',
      source: 'Walk-in',
      type: 'Inspection',
      note: 'Wants a quote before purchasing a home.',
    },
  ]);
  readonly activeCount = computed(
    () => this.jobs().filter((job) => job.status === 'New' || job.status === 'In Progress').length,
  );

  constructor() {
    void this.refresh();
    window.setInterval(() => void this.refresh(), 5000);
  }

  today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  async refresh(): Promise<void> {
    try {
      const jobs = await firstValueFrom(this.http.get<Job[]>(`${apiUrl}/jobs`));
      this.jobs.set(jobs);
      this.syncState.set('synced');
    } catch {
      this.syncState.set('offline');
    }
  }

  async create(job: Omit<Job, 'id' | 'status' | 'activities'>): Promise<Job> {
    const created = await firstValueFrom(this.http.post<Job>(`${apiUrl}/jobs`, job));
    this.jobs.update((jobs) => [...jobs, created]);
    return created;
  }

  async changeStatus(id: string, status: JobStatus): Promise<Job> {
    const changed = await firstValueFrom(
      this.http.patch<Job>(`${apiUrl}/jobs/${id}/status`, { status }),
    );
    this.jobs.update((jobs) => jobs.map((job) => (job.id === id ? changed : job)));
    return changed;
  }
}
