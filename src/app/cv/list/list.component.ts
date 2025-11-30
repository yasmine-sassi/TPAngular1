// list.component.ts
import { Component, input, output } from "@angular/core";
import { Cv } from "../model/cv";
import { NgClass, NgFor } from "@angular/common";
import { ItemComponent } from "../item/item.component";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
  standalone: true,
  imports: [NgClass, NgFor, ItemComponent],
})
export class ListComponent {
  cvs = input<Cv[]>([]);
  selectedCvId = input<number | null>(null);
  selectCv = output<Cv>();

  onCvSelect(cv: Cv) {
    console.log('ListComponent: CV selected', cv.id); // Debug
    this.selectCv.emit(cv);
  }
}