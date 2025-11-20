import { Component } from "@angular/core";
import {
  Observable,
  Subject,
  concatMap,
  map,
  takeWhile,
  scan,
  startWith,
  shareReplay,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /* Flux déclaratif pour charger les produits page par page (12 par page) */
  products$!: Observable<Product[]>;
  hasMore$!: Observable<boolean>;
  private loadMore$ = new Subject<void>();

  constructor(private productService: ProductService) {
    const page$ = this.loadMore$.pipe(
      startWith(null),
      // first emission -> page 0, then increment
      scan((page) => (page === null ? 0 : (page as number) + 1), null as number | null),
      map((p) => p as number)
    );

    const acc$ = page$.pipe(
      concatMap((page) =>
        this.productService.getProducts({ limit: 12, skip: page * 12 } as Settings)
      ),
      scan(
        (acc, res) => ({ products: [...acc.products, ...res.products], total: res.total }),
        { products: [] as Product[], total: 0 }
      ),
      // complete when we've loaded all products; include the final emission
      takeWhile((acc) => acc.products.length < acc.total, true),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.products$ = acc$.pipe(map((acc) => acc.products));
    this.hasMore$ = acc$.pipe(map((acc) => acc.products.length < acc.total));
  }

  loadMore() {
    this.loadMore$.next();
  }
}
