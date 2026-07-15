import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectStatus } from '../../models/project.interface';
import { TableColumn, TableAction, QueryParams } from '../../../../shared/models/crud.interface';

// Reusable Presentational Components
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { SearchableDropdownComponent, DropdownOption } from '../../../../shared/components/searchable-dropdown/searchable-dropdown.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProjectFormModalComponent } from '../project-form-modal/project-form-modal.component';

@Component({
  selector: 'app-project-list',
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
    ProjectFormModalComponent
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;

  // Stats
  activeCount: number = 0;
  totalBudget: number = 0;

  // Managers
  managers: string[] = [];

  // Page configuration
  queryParams: QueryParams = {
    pageIndex: 0,
    pageSize: 5,
    sortKey: 'name',
    sortDir: 'asc',
    search: '',
    status: ''
  };

  // Reusable configuration definitions
  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Project Title', sortable: true },
    { key: 'manager', header: 'Assigned Manager', sortable: true },
    { key: 'budget', header: 'Budget (USD)', sortable: true, type: 'currency' },
    { key: 'endDate', header: 'Target End Date', sortable: true, type: 'date' },
    {
      key: 'status',
      header: 'Milestone Status',
      sortable: true,
      type: 'badge',
      badgeClassMap: {
        'Active': 'badge-success',
        'On Hold': 'badge-warning',
        'Completed': 'badge-default',
        'Archived': 'badge-danger'
      }
    }
  ];

  tableActions: TableAction[] = [
    { id: 'view', label: 'View Details', icon: 'view', class: 'btn-view' },
    { id: 'edit', label: 'Modify Record', icon: 'edit', class: 'btn-edit' },
    {
      id: 'delete',
      label: 'Destroy Record',
      icon: 'delete',
      class: 'btn-delete'
    }
  ];

  statusFilterOptions: DropdownOption[] = [
    { value: '', label: 'Filter status (All)' },
    { value: 'Active', label: 'Active' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Archived', label: 'Archived' }
  ];

  // Modals state
  isFormModalOpen = false;
  isViewMode = false;
  selectedProject: Project | null = null;

  isConfirmOpen = false;
  projectToDelete: Project | null = null;

  // Notifications
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  private toastTimeout: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.managers = this.projectService.getManagers();
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.projectService.getProjects(this.queryParams).subscribe({
      next: (result) => {
        this.projects = result.data;
        this.totalItems = result.total;
        this.isLoading = false;
        this.calculateStats();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.message || 'Failure loading projects data.', 'danger');
      }
    });
  }

  calculateStats() {
    // Note: In real applications, overall stats are calculated using endpoints, but for the Smart Component dashboard representation:
    // We query the projects from database store
    this.projectService.getProjects({ pageSize: 1000 }).subscribe(res => {
      this.activeCount = res.data.filter(p => p.status === 'Active').length;
      this.totalBudget = res.data.reduce((sum, p) => sum + (p.budget || 0), 0);
    });
  }

  onSearch(searchQuery: string) {
    this.queryParams.search = searchQuery;
    this.queryParams.pageIndex = 0; // reset to first page
    this.loadProjects();
  }

  onStatusFilter(status: string) {
    this.queryParams['status'] = status;
    this.queryParams.pageIndex = 0; // reset to first page
    this.loadProjects();
  }

  onSortChange(sort: { key: string, dir: 'asc' | 'desc' }) {
    this.queryParams.sortKey = sort.key;
    this.queryParams.sortDir = sort.dir;
    this.loadProjects();
  }

  onPageChange(page: { pageIndex: number, pageSize: number }) {
    this.queryParams.pageIndex = page.pageIndex;
    this.queryParams.pageSize = page.pageSize;
    this.loadProjects();
  }

  // Row Action dispatcher
  onRowAction(event: { actionId: string, row: any }) {
    const project = event.row as Project;
    if (event.actionId === 'view') {
      this.openViewModal(project);
    } else if (event.actionId === 'edit') {
      this.openEditModal(project);
    } else if (event.actionId === 'delete') {
      this.openDeleteConfirmation(project);
    }
  }

  // Edit / Form Dialog triggers
  openCreateModal() {
    this.selectedProject = null;
    this.isFormModalOpen = true;
  }

  openViewModal(project: Project) {
    this.selectedProject = project;
    this.isViewMode = true;
    this.isFormModalOpen = true;
  }

  openEditModal(project: Project) {
    this.selectedProject = project;
    this.isViewMode = false;
    this.isFormModalOpen = true;
  }

  closeFormModal() {
    this.selectedProject = null;
    this.isViewMode = false;
    this.isFormModalOpen = false;
  }

  onSaveProject(projectData: Project) {
    this.isLoading = true;
    this.closeFormModal();

    const request = projectData.id
      ? this.projectService.updateProject(projectData.id, projectData)
      : this.projectService.createProject(projectData);

    request.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showToast(
          projectData.id ? `Project "${res.name}" modified successfully.` : `Project "${res.name}" initiated successfully.`,
          'success'
        );
        this.loadProjects();
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.message || 'Error saving project data.', 'danger');
        // reopen form
        this.selectedProject = projectData;
        this.isFormModalOpen = true;
      }
    });
  }

  // Delete Confirmation Dialog flows
  get deleteConfirmationMessage(): string {
    if (!this.projectToDelete) return '';
    return `Are you certain you wish to purge project "${this.projectToDelete.name}"? This action removes all historical cost statements.`;
  }

  openDeleteConfirmation(project: Project) {
    this.projectToDelete = project;
    this.isConfirmOpen = true;
  }

  closeConfirm() {
    this.projectToDelete = null;
    this.isConfirmOpen = false;
  }

  confirmDelete() {
    if (!this.projectToDelete || !this.projectToDelete.id) return;
    this.isLoading = true;
    const name = this.projectToDelete.name;
    this.projectService.deleteProject(this.projectToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeConfirm();
        this.showToast(`Project "${name}" permanently deleted.`, 'success');
        this.loadProjects();
      },
      error: (err) => {
        this.isLoading = false;
        this.closeConfirm();
        this.showToast(err.message || 'Error occurred while deleting project.', 'danger');
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
