import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericApiService } from '../../../shared/services/generic-api.service';
import { User, UserRole, UserStatus } from '../models/user.interface';
import { PaginatedResult, QueryParams } from '../../../shared/models/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = '/api/users';

  constructor(private apiService: GenericApiService) {}

  public getUsers(params?: QueryParams): Observable<PaginatedResult<User>> {
    return this.apiService.getAll<User>(this.endpoint, params);
  }

  public getUserById(id: string): Observable<User> {
    return this.apiService.getById<User>(this.endpoint, id);
  }

  public createUser(user: User): Observable<User> {
    if (!user.name.trim() || !user.email.trim()) {
      throw new Error('Name and Email are required.');
    }
    if (!user.email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    user.lastActive = new Date().toISOString();
    return this.apiService.create<User>(this.endpoint, user);
  }

  public updateUser(id: string, user: User): Observable<User> {
    if (!user.email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    return this.apiService.update<User>(this.endpoint, id, user);
  }

  public deleteUser(id: string): Observable<void> {
    // Custom business rule check
    // e.g., you cannot delete the default admin user with ID 101.
    if (String(id) === '101') {
      throw new Error('Security Error: The default Platform Administrator account cannot be purged.');
    }
    return this.apiService.delete(this.endpoint, id);
  }

  // Feature helpers
  public getRoles(): UserRole[] {
    return ['Platform Admin', 'Technical Manager', 'Operator', 'Guest'];
  }

  public getDepartments(): string[] {
    return ['Infrastructure', 'Operations', 'Field Maintenance', 'Control Room', 'Compliance Office', 'External Audits'];
  }
}
