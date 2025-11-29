import { Component, effect, inject, signal, untracked } from "@angular/core";
import { EMPTY,map } from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { AsyncPipe } from "@angular/common";
import { rxResource } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  standalone: true,
  imports: [AsyncPipe],
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private limit = 12;

  load = signal(0);
  stopLoading = signal(false);
  products = signal<Product[]>([]);

  productResource = rxResource({
    request: () => {
      if (this.stopLoading()) return undefined;
      return {
        limit: this.limit,
        skip: this.load() * this.limit,
      };
    },

    loader: ({ request }) => {
      if (!request) return EMPTY;
      return this.productService.getProducts(request).pipe(
        map(({ products, total }) => {
          if (products.length + request.skip >= total) {
            this.stopLoading.set(true);
          }
          return products;
        })
      );
    }
  });

  constructor() {
    effect(() => {
      const batch = this.productResource.value();
      if (!batch) return;

      untracked(() => {
        this.products.update(p => [...p, ...batch]);
      });
    });
  }

  loadMore() {
    if (!this.productResource.isLoading() && !this.stopLoading()) {
      this.load.update(v => v + 1);
    }
  }
}
