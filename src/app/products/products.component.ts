import { Component, signal, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent {

  limit = 12;
  page = signal(0);

  productsResource = resource({
    request: () => this.page(),
    loader: async ({ request: page, abortSignal }) => {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${this.limit}&skip=${page * this.limit}`,
        { signal: abortSignal }
      ).then(r => r.json());

      return res; // contient { products, total }
    }
  });

  // Accumule automatiquement toutes les pages déjà chargées
  allProducts = signal([] as any[]);

  constructor() {
    this.productsResource.valueChanges().subscribe(res => {
      if (res?.products) {
        this.allProducts.update(list => [...list, ...res.products]);
      }
    });
  }

  get hasMore() {
    const r = this.productsResource.value();
    return !r ? true : this.allProducts().length < r.total;
  }

  loadMore() {
    if (this.hasMore) this.page.update(p => p + 1);
  }
}
