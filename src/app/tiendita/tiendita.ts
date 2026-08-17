import { Component, computed, inject, signal } from '@angular/core';

import { MONTHLY_SALES } from './tiendita.data';
import { StoreService } from '../store.service';
import { formatDate, Order } from '../orders/orders.data';
import { ButtonComponent } from '../ui/button/button';
import { InputComponent } from '../ui/input/input';
import { ModalComponent } from '../ui/modal/modal';
import { ToastService } from '../ui/toast/toast.service';

@Component({
  selector: 'app-tiendita',
  imports: [ButtonComponent, InputComponent, ModalComponent],
  templateUrl: './tiendita.html'
})
export class TienditaComponent {
  private readonly store = inject(StoreService);
  protected readonly toast = inject(ToastService);

  protected readonly storeUid = 'ST-0001';
  protected readonly storeName = signal('miniShop');
  protected readonly saved = signal(false);

  protected readonly draftOpenDays = signal<number[]>([...this.store.openDays()]);

  protected readonly weekDays: { value: number; label: string }[] = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Lun' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Mié' },
    { value: 4, label: 'Jue' },
    { value: 5, label: 'Vie' },
    { value: 6, label: 'Sáb' }
  ];

  protected readonly currentMonth = computed(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  protected readonly currentSales = computed(() =>
    MONTHLY_SALES.find((item) => item.month === this.currentMonth())
  );

  protected readonly lastMonths = computed(() =>
    [...MONTHLY_SALES].sort((a, b) => b.month.localeCompare(a.month)).slice(0, 3)
  );

  protected readonly averageTicket = computed(() => {
    const sales = this.currentSales();
    return sales && sales.sales > 0 ? sales.total / sales.sales : 0;
  });

  protected readonly conflicts = computed<Order[]>(() => {
    const days = this.draftOpenDays();
    const today = this.todayISO();
    return this.store.orders().filter((order) => {
      if (order.status === 'finalizado') {
        return false;
      }
      if (order.recurrence) {
        if (order.recurrence.type === 'dias_semana') {
          return (order.recurrence.days ?? []).some((day) => !days.includes(day));
        }
        if (order.recurrence.type === 'diario') {
          return days.length < 7;
        }
        const [year, month, day] = order.expectedDate.split('-').map(Number);
        return !days.includes(new Date(year, month - 1, day).getDay());
      }
      if (order.expectedDate < today) {
        return false;
      }
      const [year, month, day] = order.expectedDate.split('-').map(Number);
      return !days.includes(new Date(year, month - 1, day).getDay());
    });
  });

  protected onNameChange(value: string): void {
    this.storeName.set(value);
    this.saved.set(false);
  }

  protected toggleOpenDay(day: number): void {
    this.saved.set(false);
    this.draftOpenDays.update((days) =>
      days.includes(day) ? days.filter((item) => item !== day) : [...days, day]
    );
  }

  protected closeConflicts(): void {
    this.draftOpenDays.set([...this.store.openDays()]);
  }

  protected resolveFinalize(order: Order): void {
    this.store.orders.update((list) =>
      list.map((item) => (item.id === order.id ? { ...item, status: 'finalizado' as const } : item))
    );
    this.toast.success('Pedido finalizado', `${order.company} se marcó como finalizado.`);
  }

  protected resolveCancel(order: Order): void {
    this.store.orders.update((list) => list.filter((item) => item.id !== order.id));
    this.toast.warning('Pedido cancelado', `${order.company} fue cancelado.`);
  }

  protected save(): void {
    if (this.conflicts().length > 0) {
      this.toast.error(
        'Conflicto de horario',
        'Resuelve los pedidos que se reciben en días cerrados antes de guardar.'
      );
      return;
    }
    this.store.openDays.set([...this.draftOpenDays()]);
    this.storeName.set(this.storeName().trim());
    this.saved.set(true);
    this.toast.success('Cambios guardados', 'El horario de tu tiendita se actualizó.');
  }

  protected monthLabel(month: string): string {
    const [year, monthIndex] = month.split('-').map(Number);
    const name = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(
      new Date(year, monthIndex - 1, 1)
    );
    return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
  }

  protected formatPrice(value: number): string {
    return value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  protected formatDate(date: string): string {
    return formatDate(date);
  }

  private todayISO(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  protected deliveryDay(order: Order): string {
    const [year, month, day] = order.expectedDate.split('-').map(Number);
    const name = new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(
      new Date(year, month - 1, day)
    );
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  }
}