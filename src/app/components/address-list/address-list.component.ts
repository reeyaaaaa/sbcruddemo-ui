import { Component, Input } from '@angular/core';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent {
  @Input() addresses: Address[] = [];
}
