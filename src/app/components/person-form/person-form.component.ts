import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role.model';
import { PersonService } from 'src/app/services/person.service';
import { RoleService } from 'src/app/services/role.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  @Input() mode: 'register' | 'full' | 'profileCompletion' = 'full';

  personForm!: FormGroup;
  profileTypes: Role[] = [];
  loggedInPerson: any; // ✅ stores person fetched from backend

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Detect mode from route
    const modeFromRoute = this.route.snapshot.data['mode'];
    if (modeFromRoute === 'register' || modeFromRoute === 'full' || modeFromRoute === 'profileCompletion') {
      this.mode = modeFromRoute;
    }

    // ✅ Build form
    this.initForm();
    this.loadRoles();

    // ✅ Profile Completion → fetch user and lock registration fields
    if (this.mode === 'profileCompletion') {
      const user = localStorage.getItem('user');
      if (user) {
        const { email } = JSON.parse(user);

        this.personService.getPersonByEmail(email).subscribe({
          next: (person) => {
            this.loggedInPerson = person;

            // Prefill registration fields
            this.personForm.patchValue({
              firstname: person.firstname,
              lastname: person.lastname,
              email: person.email,
              password: person.password
            });

            // Lock them (read-only)
            this.personForm.get('firstname')?.disable();
            this.personForm.get('lastname')?.disable();
            this.personForm.get('email')?.disable();
            this.personForm.get('password')?.disable();
          },
          error: (err) => console.error('❌ Failed to load person', err)
        });
      }
    }
  }

  // ✅ Build reactive form
  initForm(): void {
    this.personForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // 👇 required in full + profileCompletion
      education: this.mode === 'full' || this.mode === 'profileCompletion' ? ['', Validators.required] : [''],
      status: [''],
      created_at: [''],
      contacts: this.fb.array([]),
      addresses: this.fb.array([]),
      profiles: this.fb.array([])
    });

    if (this.mode === 'full' || this.mode === 'profileCompletion') {
      this.addContact();
      this.addAddress();
      this.addProfile();
    }
  }

  // ✅ Fetch roles
  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => (this.profileTypes = data),
      error: (err) => console.error('Error loading roles', err)
    });
  }

  // --- Getters ---
  get contacts(): FormArray {
    return this.personForm.get('contacts') as FormArray;
  }
  get addresses(): FormArray {
    return this.personForm.get('addresses') as FormArray;
  }
  get profiles(): FormArray {
    return this.personForm.get('profiles') as FormArray;
  }

  // --- Contacts ---
  addContact(): void {
    this.contacts.push(
      this.fb.group({
        value: ['', Validators.required],
        type: ['', Validators.required]
      })
    );
  }

  // --- Addresses ---
  addAddress(): void {
    this.addresses.push(
      this.fb.group({
        city: ['', Validators.required],
        state: ['']
      })
    );
  }

  // --- Profiles ---
  addProfile(): void {
    const profileGroup = this.fb.group({
      profile_type: this.fb.group({ id: [null, Validators.required] }),
      documents: this.fb.array([]),
      competitions: this.fb.array([])
    });
    this.profiles.push(profileGroup);

    const lastIndex = this.profiles.length - 1;
    this.addDocument(lastIndex);
    this.addCompetition(lastIndex);
  }

  // --- Documents ---
  getDocuments(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('documents') as FormArray;
  }
  addDocument(profileIndex: number): void {
    this.getDocuments(profileIndex).push(
      this.fb.group({
        name: [''],
        url: ['']
      })
    );
  }

  // --- Competitions ---
  getCompetitions(profileIndex: number): FormArray {
    return this.profiles.at(profileIndex).get('competitions') as FormArray;
  }
  addCompetition(profileIndex: number): void {
    this.getCompetitions(profileIndex).push(
      this.fb.group({
        name: [''],
        level: ['']
      })
    );
  }

  // --- Submit ---
  onSubmit(): void {
    console.log('🚀 onSubmit() triggered, mode:', this.mode);

    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      console.warn('⚠️ Form is invalid, cannot submit');
      return;
    }

    const formValue = this.personForm.getRawValue(); // ✅ includes disabled fields

    let payload: any = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password
    };

    if (this.mode === 'full' || this.mode === 'profileCompletion') {
      const profiles = formValue.profiles.map((profile: any) => ({
        ...profile,
        profile_type: { id: profile.profile_type.id },
        documents: profile.documents,
        competitions: profile.competitions
      }));

      payload = {
        ...payload,
        education: formValue.education,
        status: formValue.status,
        contactList: formValue.contacts,
        addressList: formValue.addresses,
        personProfiles: profiles
      };
    }

    console.log('📦 Payload prepared:', payload);

    if (this.mode === 'register') {
      // --- Registration ---
      this.personService.savePerson(payload, 'register').subscribe({
        next: () => {
          alert('✅ Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('❌ ERROR', err);
          alert('❌ Registration failed! ' + JSON.stringify(err));
        }
      });
    } else if (this.mode === 'profileCompletion') {
      // --- Profile Update ---
      this.personService.updatePerson(this.loggedInPerson.id, payload).subscribe({
        next: () => {
          alert('✅ Profile completed successfully!');
          this.router.navigate(['/dashboard']); // 👈 Change destination if needed
        },
        error: (err) => {
          console.error('❌ ERROR', err);
          alert('❌ Failed to update profile! ' + JSON.stringify(err));
        }
      });
    } else {
      // --- Full Save ---
      this.personService.createPerson(payload).subscribe({
        next: () => {
          alert('✅ Person saved successfully!');
          this.router.navigate(['/persons']);
        },
        error: (err) => {
          console.error('❌ ERROR', err);
          alert('❌ Something went wrong! ' + JSON.stringify(err));
        }
      });
    }
  }
}
