import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectStatus } from '../../models/project.interface';
import { SearchableDropdownComponent, DropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-project-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent],
  templateUrl: './project-form-modal.component.html',
  styleUrl: './project-form-modal.component.css'
})
export class ProjectFormModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() project: Project | null = null;
  @Input() managers: string[] = [];
  @Input() isView: boolean = false;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  formModel!: Project;
  isEdit = false;
  errorMessage = '';

  managerOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [
    { value: 'Active', label: 'Active' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Archived', label: 'Archived' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.errorMessage = '';
      if (this.project) {
        this.formModel = { ...this.project };
        this.isEdit = true;
      } else {
        this.formModel = {
          name: '',
          description: '',
          status: 'Active',
          budget: 0,
          manager: this.managers[0] || '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: ''
        };
        this.isEdit = false;
      }
    }
    if (changes['managers'] && this.managers) {
      this.managerOptions = this.managers.map(m => ({ value: m, label: m }));
    }
  }

  onManagerChange(manager: string) {
    this.formModel.manager = manager;
  }

  onStatusChange(status: ProjectStatus) {
    this.formModel.status = status;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (!this.formModel.name.trim()) {
      this.errorMessage = 'Project Title is mandatory.';
      return;
    }
    if (this.formModel.budget < 0) {
      this.errorMessage = 'Budget cannot be a negative value.';
      return;
    }
    this.save.emit(this.formModel);
  }
}
