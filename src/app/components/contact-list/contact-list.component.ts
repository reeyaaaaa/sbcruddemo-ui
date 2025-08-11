import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',

})
export class ContactListComponent {
  @Input() contacts: any[] = [];
}
