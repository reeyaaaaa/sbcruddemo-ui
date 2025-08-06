import { Contact } from './contact.model';
import { Address } from './address.model';
import { PersonProfile } from './person-profile.model';

export interface Person {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  contactList: Contact[];
  addressList: Address[];
  personProfiles: PersonProfile[];
  createdAt?: Date;
}