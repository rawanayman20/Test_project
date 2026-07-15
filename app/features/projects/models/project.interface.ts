export type ProjectStatus = 'Active' | 'On Hold' | 'Completed' | 'Archived';

export interface Project {
  id?: string;
  name: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  manager: string;
  startDate: string;
  endDate: string;
}
