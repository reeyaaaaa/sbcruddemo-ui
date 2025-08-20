import { Component, Input } from '@angular/core';
import { PersonProfile } from 'src/app/models/person-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() profile!: PersonProfile;
}
