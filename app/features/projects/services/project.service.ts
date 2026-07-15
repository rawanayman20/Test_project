import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericApiService } from '../../../shared/services/generic-api.service';
import { Project } from '../models/project.interface';
import { PaginatedResult, QueryParams } from '../../../shared/models/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly endpoint = '/api/projects';

  constructor(private apiService: GenericApiService) {}

  public getProjects(params?: QueryParams): Observable<PaginatedResult<Project>> {
    return this.apiService.getAll<Project>(this.endpoint, params);
  }

  public getProjectById(id: string): Observable<Project> {
    return this.apiService.getById<Project>(this.endpoint, id);
  }

  public createProject(project: Project): Observable<Project> {
    // Business rule validation example
    if (!project.name.trim()) {
      throw new Error('Project Name is required.');
    }
    if (project.budget < 0) {
      throw new Error('Budget cannot be negative.');
    }
    return this.apiService.create<Project>(this.endpoint, project);
  }

  public updateProject(id: string, project: Project): Observable<Project> {
    if (project.budget < 0) {
      throw new Error('Budget cannot be negative.');
    }
    return this.apiService.update<Project>(this.endpoint, id, project);
  }

  public deleteProject(id: string): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  // Feature specific helper
  public getManagers(): string[] {
    return [
      'Rami Al-Harbi',
      'Layla Mansoor',
      'Faris Qawasmeh',
      'Yazan Shatara',
      'Samer Haddad',
      'Ayman Zidan',
      'Samantha Keller'
    ];
  }
}
