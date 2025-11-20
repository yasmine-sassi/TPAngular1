import { Directive, HostBinding, HostListener } from '@angular/core';
import { signal } from '@angular/core';  // Import signal for reactive state management

@Directive({
  selector: '[appRainbowWriting]',
  standalone: true  // Mark directive as standalone
})
export class RainbowWritingDirective {
  private colors: string[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];

  // Signal to manage the color state
  colorSignal = signal(this.getRandomColor());  // The initial color

  // Host bindings for text color and border color
  @HostBinding('style.color') color = this.colorSignal();
  @HostBinding('style.borderColor') borderColor = this.colorSignal();

  constructor() {}

  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  // Listen to the keyup event and update the signal
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Update the signal with a new random color
    this.colorSignal.set(this.getRandomColor());

    // Bind the updated color to the text and border
    this.color = this.colorSignal();
    this.borderColor = this.colorSignal();
  }
}
