import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

enum NotificationType {
  BOOKING_SUBMITTED,
  BOOKING_APPROVED,
  BOOKING_REJECTED,
  BOOKING_CANCELLED,
  PICKUP_REMINDER,
  RETURN_REMINDER,
  VEHICLE_READY,
  MAINTENANCE_DUE,
  SYSTEM_ALERT,
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  isReead: boolean;
  title: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getUserNotifications() {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`);
  }

  markAsRead(id: string) {
    return this.http.patch(`${this.API_URL}/notifications/${id}/read`, {});
  }
}
