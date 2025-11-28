import { Component, inject, Output, EventEmitter, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AutocompleteComponent {

  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() cvSelected = new EventEmitter<Cv>();

  cvService = inject(CvService);
  
  search: FormControl = new FormControl('');

  private debounceTimeout: any;

  constructor() {
    this.setupSearch();
  }

  private setupSearch() {
    this.search.valueChanges.subscribe(value => {
      const searchTerm = value || '';
      this.onSearchInput(searchTerm);
    });
  }

  private onSearchInput(searchTerm: string) {
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    

    this.debounceTimeout = setTimeout(() => {
      this.searchTermChanged.emit(searchTerm);
    }, 300);
  }

  onCvSelectedFromList(cv: Cv) {
    this.cvSelected.emit(cv);
  }
}