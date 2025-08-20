import { Component, Input } from '@angular/core';
import { Competition } from '../../models/competition.model';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent {
  @Input() competition!: Competition;
}
