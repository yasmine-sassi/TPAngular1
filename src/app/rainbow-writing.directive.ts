import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRainbowWriting]'
})
export class RainbowWritingDirective {
  // Array of colors to choose from
  private colors: string[] = ['red', 'blue', 'green', 'purple', 'orange', 'yellow'];

  // HostBinding to change the color and border color of the host element (the input)
  @HostBinding('style.color') textColor: string = 'black';
  @HostBinding('style.borderColor') borderColor: string = 'black';

  constructor() {}

  // Listen to the keyup event on the host element (input)
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    // Pick a random color from the colors array
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

    // Apply the color to the text and border of the input
    this.textColor = randomColor;
    this.borderColor = randomColor;
  }
}
