import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { AuthService } from './auth/auth.service';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand for a logged-in store member', async () => {
    TestBed.inject(AuthService).login('carlos.ruiz@ejemplo.com', 'encargado123');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')?.textContent).toContain('miniShop');
  });

  it('should hide sidebar and header on the auth page', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigate(['/auth']);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeNull();
    expect(compiled.querySelector('app-header')).toBeNull();
  });

  it('should hide sidebar and header on the esperando page', async () => {
    TestBed.inject(AuthService).login('ana.torres@ejemplo.com', 'pendiente123');
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigate(['/esperando']);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeNull();
    expect(compiled.querySelector('app-header')).toBeNull();
  });
});
