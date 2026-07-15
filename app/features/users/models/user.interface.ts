export type UserRole = 'Platform Admin' | 'Technical Manager' | 'Operator' | 'Guest';
export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastActive?: string;
}
