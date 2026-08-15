import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'info' | 'error' | 'warning';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  title?: string;
}

const DEFAULT_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  readonly list = this.toasts.asReadonly();

  show(message: string, variant: ToastVariant = 'info', title?: string): number {
    const toast: Toast = { id: this.nextId++, message, variant, title };
    this.toasts.update((list) => [...list, toast]);
    window.setTimeout(() => this.dismiss(toast.id), DEFAULT_DURATION_MS);
    return toast.id;
  }

  success(message: string, title?: string): number {
    return this.show(message, 'success', title);
  }

  info(message: string, title?: string): number {
    return this.show(message, 'info', title);
  }

  error(message: string, title?: string): number {
    return this.show(message, 'error', title);
  }

  warning(message: string, title?: string): number {
    return this.show(message, 'warning', title);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }
}
