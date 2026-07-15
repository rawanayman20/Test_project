import { Injectable } from '@angular/core';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
  budget: number;
  manager: string;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Platform Admin' | 'Technical Manager' | 'Operator' | 'Guest';
  status: 'Active' | 'Suspended' | 'Pending';
  department: string;
  lastActive: string;
}

@Injectable({
  providedIn: 'root'
})
export class InMemoryDbService {
  private initialProjects: Project[] = [
    { id: '1', name: 'Alpha Platform Overhaul', description: 'Core system upgrades and database modernization.', status: 'Active', budget: 145000, manager: 'Rami Al-Harbi', startDate: '2026-01-10', endDate: '2026-08-30' },
    { id: '2', name: 'RTL Component Suite', description: 'Developing reusable components with RTL out-of-the-box layout support.', status: 'Completed', budget: 62000, manager: 'Layla Mansoor', startDate: '2025-06-01', endDate: '2025-12-15' },
    { id: '3', name: 'Locap Geospatial API', description: 'Integrating geospatial data visualization within Locap dashboard widgets.', status: 'Active', budget: 98000, manager: 'Faris Qawasmeh', startDate: '2026-03-01', endDate: '2026-11-15' },
    { id: '4', name: 'Barriers & Risks Dashboard', description: 'Interactive hazard panels and barrier controls for health & safety.', status: 'On Hold', budget: 120000, manager: 'Yazan Shatara', startDate: '2025-11-10', endDate: '2026-04-10' },
    { id: '5', name: 'Enterprise Authentication Gateway', description: 'Single sign-on migration with high encryption protocols.', status: 'Active', budget: 75000, manager: 'Samer Haddad', startDate: '2026-02-15', endDate: '2026-09-30' },
    { id: '6', name: 'Telemetry Streaming Pipeline', description: 'Ingesting microsecond-interval machinery metrics securely.', status: 'Active', budget: 210000, manager: 'Layla Mansoor', startDate: '2026-05-01', endDate: '2027-02-28' },
    { id: '7', name: 'Mobile Inspection Toolkit', description: 'Offline-first Progressive Web Application for remote operators.', status: 'Archived', budget: 45000, manager: 'Rami Al-Harbi', startDate: '2024-08-10', endDate: '2025-03-15' },
    { id: '8', name: 'Resource Allocation Optimizer', description: 'AI-driven engine for scheduling shifts and project materials.', status: 'On Hold', budget: 135000, manager: 'Samantha Keller', startDate: '2026-01-05', endDate: '2026-07-20' },
    { id: '9', name: 'Sustainability Audit Reporter', description: 'Automated compliance tracking for carbon footprints and energy savings.', status: 'Completed', budget: 54000, manager: 'Ayman Zidan', startDate: '2025-09-01', endDate: '2026-02-28' },
    { id: '10', name: 'Predictive Leak Inspection', description: 'Thermal camera integration on drone feeds with automated alerts.', status: 'Active', budget: 185000, manager: 'Faris Qawasmeh', startDate: '2026-04-10', endDate: '2026-12-15' },
    { id: '11', name: 'Asset Integrity Suite', description: 'Asset verification modules and RFID logging systems.', status: 'Active', budget: 110000, manager: 'Samer Haddad', startDate: '2026-05-15', endDate: '2026-11-20' }
  ];

  private initialUsers: User[] = [
    { id: '101', name: 'Ahmad Al-Masri', email: 'ahmad@locap.io', role: 'Platform Admin', status: 'Active', department: 'Infrastructure', lastActive: '2026-07-15T09:42:00' },
    { id: '102', name: 'Sarah Connor', email: 'sarah.c@locap.io', role: 'Technical Manager', status: 'Active', department: 'Operations', lastActive: '2026-07-15T10:05:00' },
    { id: '103', name: 'Tareq Abu-Ghazaleh', email: 'tareq@locap.io', role: 'Operator', status: 'Pending', department: 'Field Maintenance', lastActive: '2026-07-10T14:30:00' },
    { id: '104', name: 'Nour El-Din', email: 'nour@locap.io', role: 'Operator', status: 'Active', department: 'Field Maintenance', lastActive: '2026-07-14T17:15:00' },
    { id: '105', name: 'Mona Haddad', email: 'mona@locap.io', role: 'Guest', status: 'Suspended', department: 'External Audits', lastActive: '2026-05-20T11:00:00' },
    { id: '106', name: 'David Miller', email: 'david.m@locap.io', role: 'Technical Manager', status: 'Active', department: 'Operations', lastActive: '2026-07-15T08:12:00' },
    { id: '107', name: 'Zeinab Awad', email: 'zeinab@locap.io', role: 'Operator', status: 'Active', department: 'Control Room', lastActive: '2026-07-15T10:08:00' },
    { id: '108', name: 'Omar Khayyam', email: 'omar.k@locap.io', role: 'Technical Manager', status: 'Pending', department: 'Infrastructure', lastActive: '2026-07-12T16:45:00' },
    { id: '109', name: 'Rebecca Vance', email: 'rebecca.v@locap.io', role: 'Platform Admin', status: 'Active', department: 'Compliance Office', lastActive: '2026-07-14T23:55:00' },
    { id: '110', name: 'Hani Jaber', email: 'hani@locap.io', role: 'Operator', status: 'Active', department: 'Control Room', lastActive: '2026-07-15T07:30:00' }
  ];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('locap_projects')) {
        localStorage.setItem('locap_projects', JSON.stringify(this.initialProjects));
      }
      if (!localStorage.getItem('locap_users')) {
        localStorage.setItem('locap_users', JSON.stringify(this.initialUsers));
      }
    }
  }

  public getData<T>(storeName: 'projects' | 'users'): T[] {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem(`locap_${storeName}`);
      return data ? JSON.parse(data) : [];
    }
    return storeName === 'projects' ? (this.initialProjects as any) : (this.initialUsers as any);
  }

  public saveData<T>(storeName: 'projects' | 'users', data: T[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`locap_${storeName}`, JSON.stringify(data));
    } else {
      if (storeName === 'projects') this.initialProjects = data as any;
      else this.initialUsers = data as any;
    }
  }
}
