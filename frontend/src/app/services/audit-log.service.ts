import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  createdAt: Date;
  oldData?: JSON;
  newData?: JSON;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getLogs() {
    return this.http.get<AuditLog[]>(`${this.API_URL}/audit-logs`);
  }
}
