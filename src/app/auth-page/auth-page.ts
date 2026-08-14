import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, UserRole } from '../auth/auth.service';
import { AuthMode, AuthTabsComponent } from '../ui/auth-tabs/auth-tabs';
import { ButtonComponent } from '../ui/button/button';
import { InputComponent } from '../ui/input/input';

@Component({
  selector: 'app-auth-page',
  imports: [AuthTabsComponent, ButtonComponent, InputComponent],
  templateUrl: './auth-page.html'
})
export class AuthPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = signal<AuthMode>('login');
  protected readonly role = signal<'encargado' | 'empleado'>('encargado');
  protected readonly step = signal<1 | 2>(1);
  protected readonly error = signal('');

  protected readonly loginEmail = signal('');
  protected readonly loginPassword = signal('');
  protected readonly registerName = signal('');
  protected readonly registerEmail = signal('');
  protected readonly registerPassword = signal('');
  protected readonly registerConfirm = signal('');
  protected readonly storeUid = signal('');
  protected readonly storeName = signal('');
  protected readonly storeAddress = signal('');

  constructor() {
    if (this.auth.isLoggedIn) {
      this.redirectAfterAuth(this.auth.role);
    }
  }

  protected switchMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.step.set(1);
    this.error.set('');
  }

  protected onRoleChange(role: 'encargado' | 'empleado'): void {
    this.role.set(role);
    this.step.set(1);
  }

  protected nextStep(): void {
    this.error.set('');
    this.step.set(2);
  }

  protected prevStep(): void {
    this.step.set(1);
  }

  protected submitLogin(): void {
    const user = this.auth.login(this.loginEmail(), this.loginPassword());
    if (!user) {
      this.error.set('Correo o contraseña incorrectos.');
      return;
    }
    this.redirectAfterAuth(user.role);
  }

  protected submitRegister(): void {
    if (this.registerPassword() !== this.registerConfirm()) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.auth.register({
      name: this.registerName(),
      email: this.registerEmail(),
      password: this.registerPassword(),
      role: this.role(),
      storeUid: this.role() === 'empleado' ? this.storeUid() : undefined,
      storeName: this.role() === 'encargado' ? this.storeName() : undefined,
      storeAddress: this.role() === 'encargado' ? this.storeAddress() : undefined
    });
    this.redirectAfterAuth(this.role());
  }

  private redirectAfterAuth(role: UserRole | null): void {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }
    this.router.navigate([this.auth.isPending ? '/esperando' : '/dashboard']);
  }
}
