import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/persons';

  constructor(private http: HttpClient) {}

  // Registration
register(person: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/persons/register', person);
}


  // Login (already created by you)
  login(credentials: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, credentials);
  }
}
