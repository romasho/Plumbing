import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobStore } from '../../core/job.store';
import { Lead } from '../../core/models';

@Component({
  selector: 'app-job-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent {
  @Input() lead: Lead | null = null;
  @Output() closed = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(JobStore);
  protected saving = false;
  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    source: ['Phone'],
    type: ['Pipe Leak', Validators.required],
    description: [''],
    address: ['', Validators.required],
    city: ['Austin'],
    zip: [''],
    scheduledDate: [this.store.today(), Validators.required],
    startTime: ['09:00', Validators.required],
    endTime: ['10:30', Validators.required],
    technician: ['Mike Torres', Validators.required],
  });
  ngOnInit(): void {
    if (this.lead) {
      const [firstName, ...rest] = this.lead.name.split(' ');
      this.form.patchValue({
        firstName,
        lastName: rest.join(' '),
        phone: this.lead.phone,
        source: this.lead.source,
        type: this.lead.type,
        description: this.lead.note,
      });
    }
  }
  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.form.getRawValue();
    try {
      await this.store.create({
        customerName: `${value.firstName} ${value.lastName}`,
        phone: value.phone,
        email: value.email,
        source: value.source,
        type: value.type,
        description: value.description,
        address: value.address,
        city: value.city,
        zip: value.zip,
        scheduledDate: value.scheduledDate,
        startTime: value.startTime,
        endTime: value.endTime,
        technician: value.technician,
      });
      this.closed.emit();
    } finally {
      this.saving = false;
    }
  }
}
