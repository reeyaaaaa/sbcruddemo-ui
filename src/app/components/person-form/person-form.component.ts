import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  personForm!: FormGroup;

  constructor(private fb: FormBuilder, private personService: PersonService) {}

  ngOnInit(): void {
    this.personForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      status: ['active', Validators.required],
      created_at: ['', Validators.required],
      education: ['', Validators.required],
      contacts: this.fb.array([]),
      addresses: this.fb.array([]),
      profiles: this.fb.array([])
    });

    // Start with one contact, address and profile by default
    this.addContact();
    this.addAddress();
    this.addProfile();
  }

  // Getter for contacts FormArray
  get contacts(): FormArray {
    return this.personForm.get('contacts') as FormArray;
  }

  // Getter for addresses FormArray
  get addresses(): FormArray {
    return this.personForm.get('addresses') as FormArray;
  }

  // Getter for profiles FormArray
  get profiles(): FormArray {
    return this.personForm.get('profiles') as FormArray;
  }

  // Add new contact FormGroup
  addContact(): void {
    const contactGroup = this.fb.group({
      type: [''],
      value: ['']
    });
    this.contacts.push(contactGroup);
  }

  // Add new address FormGroup
  addAddress(): void {
    const addressGroup = this.fb.group({
      city: [''],
      state: ['']
    });
    this.addresses.push(addressGroup);
  }

  // Add new profile FormGroup (with nested documents and competitions)
  addProfile(): void {
    const profileGroup = this.fb.group({
      profileType: [''],
      documents: this.fb.array([]),
      competitions: this.fb.array([])
    });

    this.profiles.push(profileGroup);
    // Add initial empty document and competition
    this.addDocument(this.profiles.length - 1);
    this.addCompetition(this.profiles.length - 1);
  }

  // Get documents array inside a profile
  getDocuments(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('documents') as FormArray;
  }

  // Get competitions array inside a profile
  getCompetitions(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('competitions') as FormArray;
  }

  // Add a new document to a profile
  addDocument(profileIndex: number): void {
    const documentGroup = this.fb.group({
      name: [''],
      url: ['']
    });
    this.getDocuments(profileIndex).push(documentGroup);
  }

  // Add a new competition to a profile
  addCompetition(profileIndex: number): void {
    const competitionGroup = this.fb.group({
      name: [''],
      level: ['']
    });
    this.getCompetitions(profileIndex).push(competitionGroup);
  }


  // Submit 
 onSubmit(): void {
  if (this.personForm.valid) {
    const formValue = this.personForm.value;

    // Map form fields to match backend model
    const payload = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      education: formValue.education,
      password: formValue.password,
      status: formValue.status,
      created_at: formValue.created_at,
      contactList: formValue.contacts,
      addressList: formValue.addresses,
      personProfiles: formValue.profiles
    };

    this.personService.createPerson(payload).subscribe({
      next: (response) => {
        console.log('Saved successfully:', response);
        alert('Person saved successfully!');
        this.personForm.reset();
      },
      error: (error) => {
        console.error('Error saving person:', error);
        alert('Something went wrong!');
      }
    });

  } else {
    alert('Please fill all required fields!');
  }
}

}
