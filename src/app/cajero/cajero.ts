import { Component, computed, HostListener, signal } from '@angular/core';

import { Product } from '../products/product-card/product-card';
import { PRODUCTS } from '../products/products.data';
import { ButtonComponent } from '../ui/button/button';

export interface CartLine {
  code: string;
  name: string;
  price: number;
  quantity: number;
  byWeight: boolean;
}

@Component({
  selector: 'app-cajero',
  imports: [ButtonComponent],
  templateUrl: './cajero.html'
})
export class CajeroComponent {
  protected readonly productQuery = signal('');
  protected readonly quantity = signal(1);
  protected readonly byWeight = signal(false);
  protected readonly cart = signal<CartLine[]>([]);
  protected readonly regManual = signal(true);

  protected readonly matches = computed(() => {
    const query = this.productQuery().trim().toLowerCase();
    if (!query) {
      return [];
    }
    return PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query)
    );
  });

  protected readonly dropdownOpen = signal(false);

  protected readonly selectedProduct = signal<Product | null>(null);

  protected readonly totalQuantity = computed(() =>
    this.cart().reduce((sum, line) => sum + line.quantity, 0)
  );

  protected readonly total = computed(() =>
    this.cart().reduce((sum, line) => sum + line.price * line.quantity, 0)
  );

  protected onQueryChange(event: Event): void {
    this.productQuery.set((event.target as HTMLInputElement).value);
    this.selectedProduct.set(null);
    this.dropdownOpen.set(true);
  }

  protected selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.productQuery.set(product.name);
    this.dropdownOpen.set(false);
  }

  @HostListener('document:click')
  protected closeDropdownOnOutsideClick(): void {
    this.dropdownOpen.set(false);
  }

  protected onQuantityChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.quantity.set(value === '' ? 0 : Number(value));
  }

  protected toggleByWeight(): void {
    this.byWeight.set(!this.byWeight());
    if (this.byWeight()) {
      this.quantity.set(1);
    }
  }

  protected addToCart(): void {
    const product = this.selectedProduct() ?? (this.matches().length === 1 ? this.matches()[0] : null);
    if (!product || this.quantity() <= 0) {
      return;
    }

    const quantity = this.byWeight() ? this.quantity() : Math.round(this.quantity());
    this.cart.update((lines) => {
      const existing = lines.find((line) => line.code === product.code);
      if (existing) {
        return lines.map((line) =>
          line.code === product.code ? { ...line, quantity: line.quantity + quantity } : line
        );
      }
      return [...lines, { code: product.code, name: product.name, price: product.price, quantity, byWeight: this.byWeight() }];
    });

    this.selectedProduct.set(null);
    this.productQuery.set('');
    this.quantity.set(1);
  }

  protected removeLine(code: string): void {
    this.cart.update((lines) => lines.filter((line) => line.code !== code));
  }

  protected clearCart(): void {
    this.cart.set([]);
  }

  protected formatPrice(value: number): string {
    return value.toFixed(2);
  }
}
