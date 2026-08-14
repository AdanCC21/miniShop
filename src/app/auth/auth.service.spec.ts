import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('starts logged out', () => {
    expect(service.isLoggedIn).toBe(false);
    expect(service.role).toBeNull();
  });

  it('logs in with demo encargado credentials', () => {
    const user = service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    expect(user?.role).toBe('encargado');
    expect(service.isLoggedIn).toBe(true);
    expect(service.role).toBe('encargado');
  });

  it('logs in with demo empleado credentials', () => {
    const user = service.login('laura.gomez@ejemplo.com', 'empleado123');
    expect(user?.role).toBe('empleado');
    expect(user?.storeUid).toBe('ST-0001');
  });

  it('logs in with demo admin credentials', () => {
    const user = service.login('admin@minishop.com', 'admin123');
    expect(user?.role).toBe('admin');
    expect(user?.status).toBe('approved');
  });

  it('logs in a pending demo employee', () => {
    const user = service.login('ana.torres@ejemplo.com', 'pendiente123');
    expect(user?.role).toBe('empleado');
    expect(user?.status).toBe('pending');
    expect(service.isPending).toBe(true);
  });

  it('logs in an approved demo employee', () => {
    const user = service.login('laura.gomez@ejemplo.com', 'empleado123');
    expect(user?.status).toBe('approved');
    expect(service.isPending).toBe(false);
  });

  it('rejects invalid credentials', () => {
    expect(service.login('carlos.ruiz@ejemplo.com', 'wrong')).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('persists the session in localStorage', () => {
    service.login('laura.gomez@ejemplo.com', 'empleado123');
    const stored = localStorage.getItem('minishop_session');
    expect(stored).not.toBeNull();
    expect(stored).toContain('laura.gomez@ejemplo.com');
  });

  it('does not leak the password into the session', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    const stored = localStorage.getItem('minishop_session');
    expect(stored).not.toContain('encargado123');
  });

  it('registers a new user, logs them in and allows later login', () => {
    const user = service.register({
      name: 'Usuario Prueba',
      email: 'prueba@ejemplo.com',
      password: 'secreto',
      role: 'empleado',
      storeUid: 'ST-0002'
    });
    expect(user.email).toBe('prueba@ejemplo.com');
    expect(service.isLoggedIn).toBe(true);

    service.logout();
    const login = service.login('prueba@ejemplo.com', 'secreto');
    expect(login?.role).toBe('empleado');
  });

  it('registers an empleado as pending and an encargado as approved', () => {
    const empleado = service.register({
      name: 'Empleado Nuevo',
      email: 'emp@ejemplo.com',
      password: '1234',
      role: 'empleado',
      storeUid: 'ST-0001'
    });
    expect(empleado.status).toBe('pending');
    expect(service.isPending).toBe(true);
    service.logout();

    const encargado = service.register({
      name: 'Encargado Nuevo',
      email: 'enc@ejemplo.com',
      password: '1234',
      role: 'encargado',
      storeName: 'Mi Tienda'
    });
    expect(encargado.status).toBe('approved');
    expect(service.isPending).toBe(false);
  });

  it('lists pending employees only for the encargado store', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    const pending = service.pendingEmployees();
    expect(pending.some((employee) => employee.email === 'ana.torres@ejemplo.com')).toBe(true);
    expect(pending.some((employee) => employee.email === 'laura.gomez@ejemplo.com')).toBe(false);
  });

  it('lists approved employees of the store', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    const employees = service.storeEmployees();
    expect(employees.some((employee) => employee.email === 'carlos.ruiz@ejemplo.com')).toBe(true);
    expect(employees.some((employee) => employee.email === 'laura.gomez@ejemplo.com')).toBe(true);
    expect(employees.some((employee) => employee.email === 'ana.torres@ejemplo.com')).toBe(false);
  });

  it('approves a pending employee and clears the pending flag', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    service.approveEmployee('ana.torres@ejemplo.com');
    expect(service.pendingEmployees().some((employee) => employee.email === 'ana.torres@ejemplo.com')).toBe(false);

    service.logout();
    service.login('ana.torres@ejemplo.com', 'pendiente123');
    expect(service.isPending).toBe(false);
  });

  it('removes a user from the registry', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    service.removeUser('ana.torres@ejemplo.com');
    service.logout();
    expect(service.login('ana.torres@ejemplo.com', 'pendiente123')).toBeNull();
  });

  it('clears the session on logout', () => {
    service.login('carlos.ruiz@ejemplo.com', 'encargado123');
    service.logout();
    expect(service.isLoggedIn).toBe(false);
    expect(localStorage.getItem('minishop_session')).toBeNull();
  });
});
