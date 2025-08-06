import { Document } from './document.model';
import { Competition } from './competition.model';
import { Role } from './role.model';

export interface PersonProfile {
  id: number;
  profileType: Role;
  documents: Document[];
  competitions: Competition[];
}
