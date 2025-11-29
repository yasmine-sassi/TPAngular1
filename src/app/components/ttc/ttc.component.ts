import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ttc',
    imports: [CommonModule],
    templateUrl: './ttc.component.html',
    styleUrls: ['./ttc.component.css']
})
export class TtcComponent {
  price = signal(0);
  quantity = signal(1);
  tva = signal(18);

  discount = computed(() => {
    const q = this.quantity();
    if (q > 10 && q <= 15) return 0.2;
    if (q > 15) return 0.3;
    return 0;
  });

  totalTTC = computed(() => {
    const base = this.price() * this.quantity();
    const remise = base * this.discount();
    const baseApresRemise = base - remise;
    const tvaMontant = baseApresRemise * (this.tva() / 100);
    return baseApresRemise + tvaMontant;
  });

  updatePrice(event: Event) {
    this.price.set(parseFloat((event.target as HTMLInputElement).value));
  }

  updateQuantity(event: Event) {
    this.quantity.set(parseInt((event.target as HTMLInputElement).value));
  }

  updateTva(event: Event) {
    this.tva.set(parseFloat((event.target as HTMLInputElement).value));
  }
}
