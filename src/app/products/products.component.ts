import { Component, signal, resource, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent {

  limit = 12;
  page = signal(0);

  // Resource pour récupérer les produits d'une page
  productsResource = resource({
    request: () => this.page(),
    loader: async ({ request: page, abortSignal }) => {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${this.limit}&skip=${page * this.limit}`,
        { signal: abortSignal }
      ).then(r => r.json());
      return res; // { products, total }
    }
  });

  // Accumule toutes les pages chargées
  allProducts = signal([] as any[]);

  constructor() {
    // Réagit à chaque changement de resource
    effect(() => {
      const res = this.productsResource.read();
      if (res?.products) {
        this.allProducts.update(list => [...list, ...res.products]);
      }
    });
  }

  get hasMore() {
    const r = this.productsResource.read();
    return !r ? true : this.allProducts().length < r.total;
  }

  loadMore() {
    if (this.hasMore) this.page.update(p => p + 1);
  }
}
