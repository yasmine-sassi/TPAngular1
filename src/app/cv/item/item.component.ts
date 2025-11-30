// item.component.ts
import { Component, input } from "@angular/core";
import { Cv } from "../model/cv";
import { DefaultImagePipe } from "../pipes/default-image.pipe";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
  standalone: true,
  imports: [DefaultImagePipe],
})
export class ItemComponent {
  // Utilisation de input() signal
  cv = input.required<Cv>();
}