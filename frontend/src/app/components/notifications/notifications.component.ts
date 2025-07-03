import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications : Notification[] = [];
  constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<Notification[]>('http://localhost:3000/notifications')
            .subscribe(data => this.notifications = data);
    }
}
