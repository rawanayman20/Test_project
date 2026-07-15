import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User, UserRole, UserStatus } from '../../models/user.interface';
import { TableColumn, TableAction, QueryParams } from '../../../../shared/models/crud.interface';

// Reusable Presentational Components
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { SearchableDropdownComponent, DropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    SearchBoxComponent,
    SearchableDropdownComponent,
    DataTableComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    UserFormModalComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;

  // Stats
  adminCount: number = 0;
  pendingCount: number = 0;

  // Option sets
  roles: UserRole[] = [];
  departments: string[] = [];

  // Query configurations
  queryParams: QueryParams = {
    pageIndex: 0,
    pageSize: 5,
    sortKey: 'name',
    sortDir: 'asc',
    search: '',
    role: ''
  };

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Staff Name', sortable: true },
    { key: 'email', header: 'Corporate Email', sortable: true },
    { key: 'role', header: 'System Access Role', sortable: true },
    { key: 'department', header: 'Operating Division', sortable: true },
    {
      key: 'status',
      header: 'Clearance Status',
      sortable: true,
      type: 'badge',
      badgeClassMap: {
        'Active': 'badge-success',
        'Pending': 'badge-warning',
        'Suspended': 'badge-danger'
      }
    }
  ];

  tableActions: TableAction[] = [
    { id: 'view', label: 'View Details', icon: 'view', class: 'btn-view' },
    { id: 'edit', label: 'Modify Credentials', icon: 'edit', class: 'btn-edit' },
    {
      id: 'delete',
      label: 'Revoke License',
      icon: 'delete',
      class: 'btn-delete',
      condition: (row: User) => String(row.id) !== '101' // Security constraint in action condition!
    }
  ];

  roleFilterOptions: DropdownOption[] = [
    { value: '', label: 'Filter Role (All)' },
    { value: 'Platform Admin', label: 'Platform Admin' },
    { value: 'Technical Manager', label: 'Technical Manager' },
    { value: 'Operator', label: 'Operator' },
    { value: 'Guest', label: 'Guest' }
  ];

  // Modals status
  isFormModalOpen = false;
  isViewMode = false;
  selectedUser: User | null = null;

  isConfirmOpen = false;
  userToDelete: User | null = null;

  // Notifications
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  private toastTimeout: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.roles = this.userService.getRoles();
    this.departments = this.userService.getDepartments();
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers(this.queryParams).subscribe({
      next: (result) => {
        this.users = result.data;
        this.totalItems = result.total;
        this.isLoading = false;
        this.calculateStats();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.message || 'Failure listing users.', 'danger');
      }
    });
  }

  calculateStats() {
    this.userService.getUsers({ pageSize: 1000 }).subscribe(res => {
      this.adminCount = res.data.filter(u => u.role === 'Platform Admin').length;
      this.pendingCount = res.data.filter(u => u.status === 'Pending').length;
    });
  }

  onSearch(searchQuery: string) {
    this.queryParams.search = searchQuery;
    this.queryParams.pageIndex = 0;
    this.loadUsers();
  }

  onRoleFilter(role: string) {
    this.queryParams['role'] = role;
    this.queryParams.pageIndex = 0;
    this.loadUsers();
  }

  onSortChange(sort: { key: string, dir: 'asc' | 'desc' }) {
    this.queryParams.sortKey = sort.key;
    this.queryParams.sortDir = sort.dir;
    this.loadUsers();
  }

  onPageChange(page: { pageIndex: number, pageSize: number }) {
    this.queryParams.pageIndex = page.pageIndex;
    this.queryParams.pageSize = page.pageSize;
    this.loadUsers();
  }

  onRowAction(event: { actionId: string, row: any }) {
    const user = event.row as User;
    if (event.actionId === 'view') {
      this.openViewModal(user);
    } else if (event.actionId === 'edit') {
      this.openEditModal(user);
    } else if (event.actionId === 'delete') {
      this.openDeleteConfirmation(user);
    }
  }

  openCreateModal() {
    this.selectedUser = null;
    this.isFormModalOpen = true;
  }

  openViewModal(user: User) {
    this.selectedUser = user;
    this.isViewMode = true;
    this.isFormModalOpen = true;
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.isViewMode = false;
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.selectedUser = null;
    this.isViewMode = false;
    this.isFormModalOpen = false;
  }

  onSaveUser(userData: User) {
    this.isLoading = true;
    this.closeFormModal();

    const request = userData.id
      ? this.userService.updateUser(userData.id, userData)
      : this.userService.createUser(userData);

    request.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showToast(
          userData.id ? `Credentials for "${res.name}" modified successfully.` : `License for "${res.name}" configured and active.`,
          'success'
        );
        this.loadUsers();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.message || 'Error occurred while saving credentials.', 'danger');
        this.selectedUser = userData;
        this.isFormModalOpen = true;
      }
    });
  }

  get deleteConfirmationMessage(): string {
    if (!this.userToDelete) return '';
    return `Are you certain you wish to withdraw security clearances and delete employee profile "${this.userToDelete.name}"? This action suspends API tokens.`;
  }

  openDeleteConfirmation(user: User) {
    this.userToDelete = user;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.userToDelete = null;
    this.isConfirmOpen = false;
  }

  confirmDelete() {
    if (!this.userToDelete || !this.userToDelete.id) return;
    this.isLoading = true;
    const name = this.userToDelete.name;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeConfirm();
        this.showToast(`Employee "${name}" purged from Locap active registry.`, 'success');
        this.loadUsers();
      },
      error: (err) => {
        this.isLoading = false;
        this.closeConfirm();
        this.showToast(err.message || 'Error revoking clearances.', 'danger');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
