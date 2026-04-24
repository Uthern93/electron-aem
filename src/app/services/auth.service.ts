import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface DonutItem {
  label: string;
  value: number;
}

export interface BarItem {
  name: string;
  value: number;
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
}

export interface ChartData {
  success: boolean;
  chartDonut: DonutItem[];
  chartBar: BarItem[];
  tableUsers: User[];
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private API = environment.API_URL;

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post<string>(`${this.API}/account/login`, data);
  }

  dashboard(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.API}/dashboard`);
  }
}
