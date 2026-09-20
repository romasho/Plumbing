export type JobStatus = 'New' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Activity {
  id: string;
  text: string;
  at: string;
}
export interface Job {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  source: string;
  type: string;
  description: string;
  address: string;
  city: string;
  zip: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  technician: string;
  status: JobStatus;
  activities: Activity[];
}
export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  type: string;
  note: string;
}
