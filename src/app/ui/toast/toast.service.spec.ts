import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = TestBed.inject(ToastService);
  });

  it('starts with no toasts', () => {
    expect(service.list()).toEqual([]);
  });

  it('shows a toast with the default info variant', () => {
    const id = service.show('Hola');
    expect(service.list().length).toBe(1);
    expect(service.list()[0]).toEqual({ id, message: 'Hola', variant: 'info' });
  });

  it('shows toasts in each variant', () => {
    service.success('Guardado');
    service.info('Nueva información');
    service.error('Algo salió mal');
    service.warning('Cuidado');

    const variants = service.list().map((toast) => toast.variant);
    expect(variants).toEqual(['success', 'info', 'error', 'warning']);
  });

  it('supports an optional title', () => {
    service.success('Producto creado', 'Listo');
    expect(service.list()[0].title).toBe('Listo');
  });

  it('dismisses a toast by id', () => {
    const id = service.warning('Revisa el stock');
    service.dismiss(id);
    expect(service.list()).toEqual([]);
  });

  it('removes toasts automatically after the duration', () => {
    vi.useFakeTimers();
    service.info('Temporal');
    expect(service.list().length).toBe(1);
    vi.advanceTimersByTime(4100);
    expect(service.list()).toEqual([]);
    vi.useRealTimers();
  });
});
