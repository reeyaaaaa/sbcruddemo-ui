import { Component, Input } from '@angular/core';
import { Document } from 'src/app/models/document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Input() documents: Document[] = [];
}