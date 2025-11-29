import { Component, Input, OnInit } from "@angular/core";
import { signal } from '@angular/core';  // Import signal for reactive state management
import { RainbowWritingDirective } from '../../rainbow-writing.directive';  // Import the directive

@Component({
    selector: "app-color", // This makes the component standalone
    imports: [RainbowWritingDirective], // Import the directive here
    templateUrl: "./color.component.html",
    styleUrls: ["./color.component.css"]
})
export class ColorComponent implements OnInit {
  @Input() defaultColor = "red";

  // Use signal for reactive color management
  divColorSignal = signal(this.defaultColor);  // Signal for div color
  inputTextColorSignal = signal(this.defaultColor);  // Signal for input text color

  inputTextColor = this.inputTextColorSignal();  // A normal property for template binding

  constructor() {
    console.log("In constructor", this.defaultColor);
  }

  ngOnInit(): void {
    console.log("In ngOnInit", this.defaultColor);
    // Initialize signals
    this.divColorSignal.set(this.defaultColor);
    this.inputTextColorSignal.set(this.defaultColor);
  }

  // Method to change color
   changeColor(newColor: string) {
    this.divColorSignal.set(newColor);
    // Reset input text color by setting the default color for appRainbowWriting
    const inputField = document.querySelector('input') as HTMLInputElement;
    if (inputField) {
      inputField.style.color = newColor; // Apply the reset color
    }
  }
  }

