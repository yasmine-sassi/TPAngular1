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
  products$!: Observable<Product[]>;
  hasMore$!: Observable<boolean>;

  /** Signal déclencheur pour charger 12 produits de plus */
  private loadMore$ = new Subject<void>();

  constructor(private productService: ProductService) {

    /** Flux de pagination */
    const page$ = this.loadMore$.pipe(
      startWith(null), // déclenche le premier chargement
      scan((page) => (page === null ? 0 : (page as number) + 1), null as number | null),
      map((p) => p as number)
    );

    /** Flux d’accumulation des produits */
    const response$ = page$.pipe(
      concatMap((page) =>
        this.productService.getProducts({
          limit: 12,
          skip: page * 12,
        } as Settings)
      ),
      scan(
        (acc, res) => ({
          products: [...acc.products, ...res.products],
          total: res.total,
        }),
        { products: [] as Product[], total: 0 }
      ),
      /** Partage du résultat entre products$ et hasMore$ */
      shareReplay(1)
    );

    /** Liste accumulée des produits */
    this.products$ = response$.pipe(map((r) => r.products));

    /** Condition pour afficher ou non le bouton "charger plus" */
    this.hasMore$ = response$.pipe(
      map((r) => r.products.length < r.total)
    );
  }

  /** Déclenche le chargement de 12 produits */
  loadMore() {
    this.loadMore$.next();
  }
}
