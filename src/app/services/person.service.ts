import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl = 'http://localhost:8080/api/persons';

  constructor(private http: HttpClient) {}

  // ✅ Get all persons
  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }

  // ✅ Get person by ID
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  // ✅ Create person (generic)
  createPerson(person: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, person);
  }

  // ✅ Update person
  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/${id}`, person);
  }

  // ✅ Delete person
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Save (decides between Register and Full save)
  savePerson(person: any, mode: 'register' | 'full'): Observable<any> {
    console.log("📤 Sending to backend:", person);

    if (mode === 'register') {
      // 👈 Call registration endpoint
      return this.http.post<any>(`${this.baseUrl}/register`, person);
    } else {
      // 👈 Normal person create
      return this.http.post<any>(this.baseUrl, person);
    }
  }

  // ✅ Get all roles
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/roles');
  }

  getPersonByEmail(email: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${email}`);
}

}
