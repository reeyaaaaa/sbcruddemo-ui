import { Component, Input } from '@angular/core';
import { Document as MyDocument } from 'src/app/models/document.model'; 

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  @Input() document!: MyDocument; 
}
