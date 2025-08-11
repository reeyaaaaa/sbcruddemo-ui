import { Component, Input } from '@angular/core';
import { PersonProfile } from 'src/app/models/person-profile.model';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent {
  @Input() profiles: PersonProfile[] = [];
}
