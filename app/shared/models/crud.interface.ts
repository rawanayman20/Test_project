export interface TableColumn<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  transform?: (val: any, row: T) => string;
  type?: 'text' | 'badge' | 'custom' | 'date' | 'currency';
  badgeClassMap?: { [key: string]: string };
}

export interface TableAction<T = any> {
  id: string;
  label: string;
  icon?: string; // SVG icon identifier or name
  class?: string; // styling class like 'btn-edit', 'btn-delete'
  condition?: (row: T) => boolean;
}

export interface QueryParams {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc' | '';
  search?: string;
  [key: string]: any;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}
