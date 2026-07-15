import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { InMemoryDbService } from './in-memory-db.service';
import { PaginatedResult, QueryParams } from '../models/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class GenericApiService {
  constructor(private db: InMemoryDbService) {}

  /**
   * GET - Retrieve items matching endpoint, supporting search, sorting, and pagination
   */
  public getAll<T>(endpoint: string, params?: QueryParams): Observable<PaginatedResult<T>> {
    return of(null).pipe(
      delay(400), // Simulate network latency to test standard Loading Spinners
      map(() => {
        const storeName = this.getStoreNameFromEndpoint(endpoint);
        let items = this.db.getData<any>(storeName);

        // 1. Search Filter (checks all textual properties)
        if (params?.search) {
          const query = params.search.toLowerCase().trim();
          items = items.filter(item => 
            Object.values(item).some(val => 
              val !== null && val !== undefined && String(val).toLowerCase().includes(query)
            )
          );
        }

        // Apply any other endpoint custom filters
        // For example, role, status filters
        Object.keys(params || {}).forEach(key => {
          if (!['pageIndex', 'pageSize', 'sortKey', 'sortDir', 'search'].includes(key) && params?.[key] !== undefined && params?.[key] !== '') {
            const filterVal = String(params[key]).toLowerCase();
            items = items.filter(item => String(item[key]).toLowerCase() === filterVal);
          }
        });

        // 2. Sorting
        if (params?.sortKey) {
          const sortKey = params.sortKey;
          const sortDir = params.sortDir || 'asc';
          items = [...items].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            let comparison = 0;
            if (typeof valA === 'number' && typeof valB === 'number') {
              comparison = valA - valB;
            } else {
              comparison = String(valA).localeCompare(String(valB));
            }

            return sortDir === 'asc' ? comparison : -comparison;
          });
        }

        // Total count before pagination
        const total = items.length;

        // 3. Pagination
        const pageIndex = params?.pageIndex ?? 0;
        const pageSize = params?.pageSize ?? 10;
        const start = pageIndex * pageSize;
        const data = items.slice(start, start + pageSize);

        return { data, total };
      })
    );
  }

  /**
   * GET BY ID
   */
  public getById<T>(endpoint: string, id: string | number): Observable<T> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const storeName = this.getStoreNameFromEndpoint(endpoint);
        const items = this.db.getData<any>(storeName);
        const item = items.find((i: any) => String(i.id) === String(id));
        if (!item) {
          throw new Error(`Item with ID ${id} not found in ${storeName}`);
        }
        return item as T;
      })
    );
  }

  /**
   * POST - Create new item
   */
  public create<T>(endpoint: string, item: Partial<T>): Observable<T> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const storeName = this.getStoreNameFromEndpoint(endpoint);
        const items = this.db.getData<any>(storeName);
        
        // Generate new sequential or unique ID
        const currentIds = items.map((i: any) => parseInt(String(i.id), 10)).filter((id: number) => !isNaN(id));
        const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;

        const newItem = {
          ...item,
          id: String(newId)
        } as unknown as T;

        items.unshift(newItem); // put it first
        this.db.saveData(storeName, items);
        return newItem;
      })
    );
  }

  /**
   * PUT - Update existing item
   */
  public update<T>(endpoint: string, id: string | number, item: Partial<T>): Observable<T> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const storeName = this.getStoreNameFromEndpoint(endpoint);
        const items = this.db.getData<any>(storeName);
        const index = items.findIndex((i: any) => String(i.id) === String(id));

        if (index === -1) {
          throw new Error(`Item with ID ${id} not found/cannot update in ${storeName}`);
        }

        const updatedItem = {
          ...items[index],
          ...item,
          id: String(id) // preserve key ID
        };

        items[index] = updatedItem;
        this.db.saveData(storeName, items);
        return updatedItem as T;
      })
    );
  }

  /**
   * DELETE - Remove item
   */
  public delete(endpoint: string, id: string | number): Observable<void> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const storeName = this.getStoreNameFromEndpoint(endpoint);
        let items = this.db.getData<any>(storeName);
        const initialLen = items.length;
        items = items.filter((i: any) => String(i.id) !== String(id));

        if (items.length === initialLen) {
          throw new Error(`Item with ID ${id} not found/cannot delete in ${storeName}`);
        }

        this.db.saveData(storeName, items);
        return void 0;
      })
    );
  }

  private getStoreNameFromEndpoint(endpoint: string): 'projects' | 'users' {
    if (endpoint.includes('project')) {
      return 'projects';
    } else if (endpoint.includes('user')) {
      return 'users';
    }
    throw new Error(`Unknown endpoint pattern: "${endpoint}". Must contain "user" or "project".`);
  }
}
