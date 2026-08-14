import { Component, computed, signal } from '@angular/core';

import {
  findSupplierByName,
  formatDate,
  Order,
  OrderProduct,
  ORDERS,
  Supplier,
  SupplierProduct,
  SUPPLIERS
} from './orders.data';
import { ModalComponent } from '../ui/modal/modal';
import { ButtonComponent } from '../ui/button/button';
import { InputComponent } from '../ui/input/input';
import { SelectComponent, SelectOption } from '../ui/select/select';

export type OrdersTab = 'waiting' | 'unconfirmed' | 'finalized';
export type DateFilter = 'todos' | 'hoy' | 'semana';
export type OrderSort = 'fecha' | 'proveedor' | 'total';

@Component({
  selector: 'app-orders',
  imports: [ButtonComponent, InputComponent, ModalComponent, SelectComponent],
  templateUrl: './orders.html'
})
export class OrdersComponent {
  protected readonly orders = signal<Order[]>(ORDERS);
  protected readonly tab = signal<OrdersTab>('waiting');
  protected readonly selectedOrder = signal<Order | null>(null);

  protected readonly tabs: { id: OrdersTab; label: string }[] = [
    { id: 'waiting', label: 'En espera' },
    { id: 'unconfirmed', label: 'Pedidos no confirmados' },
    { id: 'finalized', label: 'Finalizados' }
  ];

  protected readonly dateFilters: { id: DateFilter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'hoy', label: 'Llega hoy' },
    { id: 'semana', label: 'Llega esta semana' }
  ];

  protected readonly sortOptions: SelectOption[] = [
    { value: 'fecha', label: 'Fecha de entrega' },
    { value: 'proveedor', label: 'Proveedor (A-Z)' },
    { value: 'total', label: 'Total de productos' }
  ];

  protected readonly dateFilter = signal<DateFilter>('todos');
  protected readonly supplierFilter = signal('');
  protected readonly sortBy = signal<OrderSort>('fecha');

  protected readonly newOrderOpen = signal(false);
  protected readonly providerQuery = signal('');
  protected readonly productQuery = signal('');
  protected readonly addQty = signal(1);
  protected readonly manualName = signal('');
  protected readonly manualQty = signal(1);
  protected readonly expectedDate = signal(this.defaultExpectedDate());
  protected readonly cart = signal<OrderProduct[]>([]);

  protected readonly waitingOrders = computed(() =>
    this.orders().filter(
      (order) => order.status !== 'finalizado' && order.expectedDate >= this.todayISO()
    )
  );

  protected readonly unconfirmedOrders = computed(() =>
    this.orders().filter(
      (order) => order.status !== 'finalizado' && order.expectedDate < this.todayISO()
    )
  );

  protected readonly finalizedOrders = computed(() =>
    this.orders().filter((order) => order.status === 'finalizado')
  );

  protected readonly visibleOrders = computed(() => {
    let base: Order[];
    switch (this.tab()) {
      case 'unconfirmed':
        base = this.unconfirmedOrders();
        break;
      case 'finalized':
        base = this.finalizedOrders();
        break;
      case 'waiting':
      default:
        base = this.waitingOrders();
    }
    return this.applySort(this.applyFilter(base));
  });

  protected readonly supplierOptions = computed<SelectOption[]>(() => {
    const companies = [...new Set(this.orders().map((order) => order.company))].sort((a, b) =>
      a.localeCompare(b)
    );
    return [{ value: '', label: 'Todos' }, ...companies.map((company) => ({ value: company, label: company }))];
  });

  protected readonly emptyMessage = computed(() => {
    switch (this.tab()) {
      case 'unconfirmed':
        return 'No hay pedidos sin confirmar.';
      case 'finalized':
        return 'Aún no hay pedidos finalizados.';
      case 'waiting':
      default:
        return 'No hay pedidos en espera.';
    }
  });

  protected readonly suggestions = computed(() => {
    const query = this.providerQuery().trim().toLowerCase();
    if (!query) {
      return [];
    }
    return SUPPLIERS.filter((supplier) => supplier.name.toLowerCase().includes(query));
  });

  protected readonly matchedSupplier = computed<Supplier | undefined>(() =>
    findSupplierByName(this.providerQuery())
  );

  protected readonly providerNotFound = computed(() => {
    const query = this.providerQuery().trim();
    return query.length > 0 && !this.matchedSupplier();
  });

  protected readonly visibleCatalogProducts = computed<SupplierProduct[]>(() => {
    const supplier = this.matchedSupplier();
    if (!supplier) {
      return [];
    }
    const query = this.productQuery().trim().toLowerCase();
    if (!query) {
      return supplier.products;
    }
    return supplier.products.filter((product) => product.name.toLowerCase().includes(query));
  });

  protected readonly cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  protected selectTab(tab: OrdersTab): void {
    this.tab.set(tab);
    this.resetFilters();
  }

  protected selectDateFilter(filter: DateFilter): void {
    this.dateFilter.set(filter);
  }

  protected onSupplierFilterChange(value: string): void {
    this.supplierFilter.set(value);
  }

  protected onSortChange(value: string): void {
    this.sortBy.set(value as OrderSort);
  }

  private resetFilters(): void {
    this.dateFilter.set('todos');
    this.supplierFilter.set('');
  }

  private applyFilter(orders: Order[]): Order[] {
    const supplier = this.supplierFilter();
    if (supplier) {
      orders = orders.filter((order) => order.company === supplier);
    }
    const today = this.todayISO();
    switch (this.dateFilter()) {
      case 'hoy':
        return orders.filter((order) => order.expectedDate === today);
      case 'semana':
        return orders.filter((order) => order.expectedDate >= today && order.expectedDate <= this.weekEndISO());
      default:
        return orders;
    }
  }

  private applySort(orders: Order[]): Order[] {
    switch (this.sortBy()) {
      case 'proveedor':
        return [...orders].sort((a, b) => a.company.localeCompare(b.company));
      case 'total':
        return [...orders].sort((a, b) => this.totalProducts(b) - this.totalProducts(a));
      case 'fecha':
      default:
        return [...orders].sort((a, b) => a.expectedDate.localeCompare(b.expectedDate));
    }
  }

  protected openDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  protected closeDetails(): void {
    this.selectedOrder.set(null);
  }

  protected markAsFinalized(order: Order): void {
    this.orders.update((list) =>
      list.map((item) => (item.id === order.id ? { ...item, status: 'finalizado' as const } : item))
    );
    this.closeDetails();
  }

  protected openNewOrder(): void {
    this.expectedDate.set(this.defaultExpectedDate());
    this.newOrderOpen.set(true);
  }

  protected closeNewOrder(): void {
    this.newOrderOpen.set(false);
    this.resetNewOrder();
  }

  protected onProviderChange(value: string): void {
    this.providerQuery.set(value);
  }

  protected selectSupplier(supplier: Supplier): void {
    this.providerQuery.set(supplier.name);
    this.productQuery.set('');
    this.addQty.set(1);
  }

  protected onProductQueryChange(value: string): void {
    this.productQuery.set(value);
  }

  protected onAddQtyChange(value: string): void {
    this.addQty.set(value === '' ? 0 : Number(value));
  }

  protected onManualNameChange(value: string): void {
    this.manualName.set(value);
  }

  protected onManualQtyChange(value: string): void {
    this.manualQty.set(value === '' ? 0 : Number(value));
  }

  protected onExpectedDateChange(value: string): void {
    this.expectedDate.set(value);
  }

  protected addFromCatalog(product: SupplierProduct): void {
    const quantity = this.addQty();
    if (quantity <= 0) {
      return;
    }
    this.cart.update((items) => [...items, { name: product.name, quantity, price: product.price }]);
    this.addQty.set(1);
  }

  protected addManual(): void {
    const name = this.manualName().trim();
    const quantity = this.manualQty();
    if (!name || quantity <= 0) {
      return;
    }
    this.cart.update((items) => [...items, { name, quantity, price: 0 }]);
    this.manualName.set('');
    this.manualQty.set(1);
  }

  protected removeCartItem(index: number): void {
    this.cart.update((items) => items.filter((_, i) => i !== index));
  }

  protected createOrder(): void {
    const provider = this.providerQuery().trim();
    if (!provider || this.cart().length === 0 || !this.expectedDate()) {
      return;
    }
    const supplier = findSupplierByName(provider);

    const order: Order = {
      id: `ORD-${String(this.orders().length + 1).padStart(3, '0')}`,
      company: provider,
      companyColor: supplier?.color ?? '#6b7280',
      products: this.cart(),
      createdDate: this.todayISO(),
      expectedDate: this.expectedDate(),
      status: 'pendiente'
    };
    this.orders.update((list) => [...list, order]);
    this.closeNewOrder();
  }

  private resetNewOrder(): void {
    this.providerQuery.set('');
    this.productQuery.set('');
    this.addQty.set(1);
    this.manualName.set('');
    this.manualQty.set(1);
    this.expectedDate.set(this.defaultExpectedDate());
    this.cart.set([]);
  }

  private defaultExpectedDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return this.toISODate(date);
  }

  private todayISO(): string {
    return this.toISODate(new Date());
  }

  private weekEndISO(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return this.toISODate(date);
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected companyInitial(order: Order): string {
    return order.company.charAt(0);
  }

  protected totalProducts(order: Order): number {
    return order.products.reduce((sum, product) => sum + product.quantity, 0);
  }

  protected formatDate(date: string): string {
    return formatDate(date);
  }
}
