import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { JobsPage } from './features/jobs/jobs.page';
import { LeadsPage } from './features/leads/leads.page';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPage },
  { path: 'leads', component: LeadsPage },
  { path: 'jobs', component: JobsPage },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];
