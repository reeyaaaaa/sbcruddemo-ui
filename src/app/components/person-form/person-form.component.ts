import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role.model';
import { PersonService } from 'src/app/services/person.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  personForm!: FormGroup;
  profileTypes: Role[] = [];
  router: any;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
  }

  initForm(): void {
    this.personForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [' '],
      created_at: ['', Validators.required], // Matches formControlName in HTML
      education: ['', Validators.required],
      contacts: this.fb.array([
    this.fb.group({
      value: ['', Validators.required],
      type: ['', Validators.required]
    })
  ]),
      addresses: this.fb.array([]),
      profiles: this.fb.array([])
    });


    this.addContact();
    this.addAddress();
    this.addProfile();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => this.profileTypes = data,
      error: (err) => console.error('Error loading roles', err)
    });
  }

  // Getters
  get contacts(): FormArray {
  return this.personForm.get('contacts') as FormArray;
}


  get addresses(): FormArray {
    return this.personForm.get('addresses') as FormArray;
  }


  get profiles(): FormArray {
    return this.personForm.get('profiles') as FormArray;
  }

  // Contact
  addContact(): void {
  this.contacts.push(
    this.fb.group({
      value: ['', Validators.required],
      type: ['', Validators.required]
    })
  );
}



  // Address
  addAddress(): void {
    const addressGroup = this.fb.group({
      city: ['', Validators.required],
      state: ['']
    });
    this.addresses.push(addressGroup);
  }

  // Profile
  addProfile(): void {
    const profileGroup = this.fb.group({
      profile_type: this.fb.group({
        id: [null, Validators.required]
      }),
      documents: this.fb.array([]),
      competitions: this.fb.array([])
    });

    this.profiles.push(profileGroup);
    const lastIndex = this.profiles.length - 1;
    this.addDocument(lastIndex);
    this.addCompetition(lastIndex);
  }

  // Documents
  getDocuments(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('documents') as FormArray;
  }


  addDocument(profileIndex: number): void {
    const documentGroup = this.fb.group({
      name: [''],
      url: ['']
    });
    this.getDocuments(profileIndex).push(documentGroup);
  }

  // Competitions
  getCompetitions(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('competitions') as FormArray;
  }

  addCompetition(profileIndex: number): void {
    const competitionGroup = this.fb.group({
      name: [''],
      level: ['']
    });
    this.getCompetitions(profileIndex).push(competitionGroup);
  }

  // Submit
 onSubmit() {
  if (this.personForm.invalid) {
    this.personForm.markAllAsTouched();
    return;
  }

  const formValue = this.personForm.value;

  // Replace profile_type.id with full object
  const profiles = formValue.profiles.map((profile: any) => ({
    ...profile,
    profile_type: {
      id: profile.profile_type.id
    },
    documents: profile.documents,
    competitions: profile.competitions
  }));

  const payload = {
    firstname: formValue.firstname,
    lastname: formValue.lastname,
    email: formValue.email,
    education: formValue.education,
    password: formValue.password,
    contactList: formValue.contacts,
    addressList: formValue.addresses,
    personProfiles: profiles
  };

  this.personService.savePerson(payload).subscribe({
    next: (res) => {
      console.log('Saved!', res);
      this.router.navigate(['/persons']);
    },
    error: (err) => {
      console.error('Error occurred', err);
      alert('Something went wrong while saving!');
    }
  });
}

}
