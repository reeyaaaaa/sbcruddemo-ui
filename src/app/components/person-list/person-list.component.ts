import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  displayedColumns: string[] = ['name', 'email', 'contacts', 'addresses', 'profiles', 'actions'];

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllPersons();
  }

  getAllPersons(): void {
    this.personService.getAllPersons().subscribe(data => {
      this.persons = data;
    });
  }

  addPerson(): void {
    this.router.navigate(['/person-form']);
  }

  editPerson(id: number): void {
    this.router.navigate(['/person-form', id]);
  }

  deletePerson(id: number): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.personService.deletePerson(id).subscribe(() => {
        this.getAllPersons();
      });
    }
  }
}
