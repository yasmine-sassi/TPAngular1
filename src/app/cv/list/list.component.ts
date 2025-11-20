import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cv } from '../model/cv';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  @Input() cvs: Cv[] | null = [];
  @Output() selectCvEvent = new EventEmitter<Cv>(); // ⚡ must emit Cv

  // call this method when user clicks on a CV
  select(cv: Cv) {
    this.selectCvEvent.emit(cv); // emit the actual Cv object
  }
}
