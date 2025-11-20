import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProductService } from './services/product.service';
import { Product } from './dto/product.dto';
import { Settings } from './dto/product-settings.dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductsComponent {

  private page = signal(0);
  private productsAcc = signal<Product[]>([]);
  private total = signal(0);

  loading = signal(false);
  error = signal<string | null>(null);

  readonly limit = 12;

  constructor(private productService: ProductService) {

    effect(async () => {
      const currentPage = this.page();

      this.loading.set(true);
      this.error.set(null);

      try {
        const res = await firstValueFrom(
          this.productService.getProducts({
            limit: this.limit,
            skip: currentPage * this.limit,
          } as Settings)
        );

        console.log('[Products] fetched page', currentPage, 'items', res?.products?.length, 'total', res?.total);

        if (!res) return;

        this.productsAcc.update(prev => [...prev, ...res.products]);
        this.total.set(res.total);

      } catch (e: any) {
        console.error('[Products] fetch error', e);
        this.error.set(e?.message ?? 'Error fetching products');

      } finally {
        this.loading.set(false);
      }
    }, { allowSignalWrites: true });

    // Load page 0 immediately
    this.page.set(0);
  }

  products = computed(() => this.productsAcc());
  hasMore = computed(() => this.productsAcc().length < this.total());

  loadMore() {
    this.page.update(p => p + 1);
  }
}
