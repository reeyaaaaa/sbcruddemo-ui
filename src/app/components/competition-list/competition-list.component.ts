import { Component, Input } from '@angular/core';
import { Competition } from 'src/app/models/competition.model';

@Component({
  selector: 'app-competition-list',
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.css']
})
export class CompetitionListComponent {
  @Input() competitions: Competition[] = [];
}