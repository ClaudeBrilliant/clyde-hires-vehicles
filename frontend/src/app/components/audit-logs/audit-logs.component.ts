import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuditLog } from '../../services/audit-log.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-audit-logs',
  imports: [CommonModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AuditLogsComponent {

  logs : AuditLog[] = []
  constructor(private http:HttpClient){}

     ngOnInit(){
      this.http.get<AuditLog[]>('http://localhost:3000/audit-logs')
         .subscribe((data: AuditLog[]) => this.logs = data);
     }

}
