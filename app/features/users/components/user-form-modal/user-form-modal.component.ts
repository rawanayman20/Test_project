import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole, UserStatus } from '../../models/user.interface';
import { SearchableDropdownComponent, DropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css'
})
export class UserFormModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() user: User | null = null;
  @Input() roles: UserRole[] = [];
  @Input() departments: string[] = [];
  @Input() isView: boolean = false;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  formModel!: User;
  isEdit = false;
  errorMessage = '';

  roleOptions: DropdownOption[] = [];
  deptOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Pending', label: 'Pending' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.errorMessage = '';
      if (this.user) {
        this.formModel = { ...this.user };
        this.isEdit = true;
      } else {
        this.formModel = {
          name: '',
          email: '',
          role: 'Operator',
          status: 'Active',
          department: this.departments[0] || ''
        };
        this.isEdit = false;
      }
    }
    
    if (changes['roles'] && this.roles) {
      this.roleOptions = this.roles.map(r => ({ value: r, label: String(r) }));
    }

    if (changes['departments'] && this.departments) {
      this.deptOptions = this.departments.map(d => ({ value: d, label: String(d) }));
    }
  }

  onRoleChange(role: UserRole) {
    this.formModel.role = role;
  }

  onDeptChange(dept: string) {
    this.formModel.department = dept;
  }

  onStatusChange(status: UserStatus) {
    this.formModel.status = status;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (!this.formModel.name.trim() || !this.formModel.email.trim()) {
      this.errorMessage = 'Name and corporate email are both mandatory fields.';
      return;
    }
    if (!this.formModel.email.includes('@')) {
      this.errorMessage = 'Please input a valid corporate email pattern.';
      return;
    }
    this.save.emit(this.formModel);
  }
}
