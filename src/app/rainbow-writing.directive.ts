import { Directive, HostBinding, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';  // Import RxJS utilities
import { map } from 'rxjs/operators';  // Use operators like map

@Directive({
  selector: '[appRainbowWriting]'
})
export class RainbowWritingDirective {
  // Define an array of colors
  private colors: string[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];

  // Host bindings for text color and border color
  @HostBinding('style.color') color = 'black';
  @HostBinding('style.borderColor') borderColor = 'black';

  constructor() {}

  // Function to return a random color from the color array
  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  // Listen for the keyup event using RxJS
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Create an observable for the keyup event
    fromEvent(event.target as HTMLElement, 'keyup').pipe(
      map(() => this.getRandomColor())  // Map the event to a random color
    ).subscribe((color: string) => {
      // Apply the random color to text and border
      this.color = color;
      this.borderColor = color;
    });
  }
}
