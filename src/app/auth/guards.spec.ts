import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, Router, RouterStateSnapshot } from '@angular/router';

import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import { encargadoGuard } from './encargado.guard';
import { pendingGuard } from './pending.guard';
import { storeMemberGuard } from './store-member.guard';

function runGuard(fn: CanActivateFn): unknown {
  return TestBed.runInInjectionContext(() =>
    fn({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  );
}

describe('guards', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('storeMemberGuard allows encargado', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('carlos.ruiz@ejemplo.com', 'encargado123');
    expect(runGuard(storeMemberGuard)).toBe(true);
  });

  it('storeMemberGuard allows empleado', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('laura.gomez@ejemplo.com', 'empleado123');
    expect(runGuard(storeMemberGuard)).toBe(true);
  });

  it('storeMemberGuard redirects a pending empleado to /esperando', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('ana.torres@ejemplo.com', 'pendiente123');
    expect(runGuard(storeMemberGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/esperando']));
  });

  it('storeMemberGuard redirects anonymous users to /auth', () => {
    expect(runGuard(storeMemberGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/auth']));
  });

  it('storeMemberGuard redirects admin to /admin', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('admin@minishop.com', 'admin123');
    expect(runGuard(storeMemberGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/admin']));
  });

  it('encargadoGuard allows encargado', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('carlos.ruiz@ejemplo.com', 'encargado123');
    expect(runGuard(encargadoGuard)).toBe(true);
  });

  it('encargadoGuard redirects empleado to /dashboard', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('laura.gomez@ejemplo.com', 'empleado123');
    expect(runGuard(encargadoGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/dashboard']));
  });

  it('adminGuard allows admin', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('admin@minishop.com', 'admin123');
    expect(runGuard(adminGuard)).toBe(true);
  });

  it('adminGuard redirects encargado to /dashboard', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('carlos.ruiz@ejemplo.com', 'encargado123');
    expect(runGuard(adminGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/dashboard']));
  });

  it('pendingGuard allows a pending empleado', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('ana.torres@ejemplo.com', 'pendiente123');
    expect(runGuard(pendingGuard)).toBe(true);
  });

  it('pendingGuard redirects an approved empleado to /dashboard', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('laura.gomez@ejemplo.com', 'empleado123');
    expect(runGuard(pendingGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/dashboard']));
  });

  it('pendingGuard redirects anonymous users to /auth', () => {
    expect(runGuard(pendingGuard)).toEqual(TestBed.inject(Router).createUrlTree(['/auth']));
  });
});
