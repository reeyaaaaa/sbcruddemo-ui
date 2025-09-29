import { Contact } from './contact.model';
import { Address } from './address.model';
import { PersonProfile } from './person-profile.model';

export interface Person {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  education?: string;
  password?: string;
  status?: string;
  createdAt?: Date;
  contactList: Contact[];
  addressList: Address[];
  personProfiles: PersonProfile[];  // ✅ must match backend JSON
}
