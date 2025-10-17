import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-color",
  templateUrl: "./color.component.html",
  styleUrls: ["./color.component.css"],
})
export class ColorComponent implements OnInit {
  @Input() defaultColor = "red";

  /**
   *
   * The color representing the Div
   */
  divColor = "";
  inputTextColor = "";
  /**
   * It change the div backgound color
   *
   * @param newColor: string
   */

  constructor(private activatedRoute: ActivatedRoute) {
    console.log("In constructor", this.defaultColor);
  }

ngOnInit(): void {
    console.log("In ngOnInit", this.defaultColor);
    this.divColor = this.defaultColor;
    this.inputTextColor = this.defaultColor;
  }

  changeColor(newColor: string) {
    this.divColor = newColor;
    // Reset input text color by setting the default color for appRainbowWriting
    const inputField = document.querySelector('input') as HTMLInputElement;
    if (inputField) {
      inputField.style.color = newColor; // Apply the reset color
    }
  }
}
