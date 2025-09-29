import { Document } from './document.model';
import { Competition } from './competition.model';
import { Role } from './role.model';

export interface PersonProfile {
  id: number;
  profile_type: Role;   // backend uses snake_case
  document: Document[]; // backend uses "document"
  competitions: Competition[];
}