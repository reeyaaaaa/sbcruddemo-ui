import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {



  getRoles(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8080/api/roles');
}



  private baseUrl = 'http://localhost:8080/api/persons';

  constructor(private http: HttpClient) {}

  getAllPersons(): Observable<Person[]> {
  return this.http.get<Person[]>('http://localhost:8080/api/persons');
  }


  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

createPerson(person: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/persons', person);
}

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  savePerson(person: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/add`, person);
}

}
