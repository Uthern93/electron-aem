import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private API = environment.API_URL ?? "http://localhost:3000/api";

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post<string>(`${this.API}/account/login`, data);
  }
}
