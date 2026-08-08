import { Component, signal } from '@angular/core';

import { ModalComponent } from '../modal/modal';
import { AuthMode, AuthTabsComponent } from '../ui/auth-tabs/auth-tabs';
import { ButtonComponent } from '../ui/button/button';
import { InputComponent } from '../ui/input/input';

@Component({
  selector: 'app-auth-modal',
  imports: [ModalComponent, AuthTabsComponent, ButtonComponent, InputComponent],
  templateUrl: './auth-modal.html'
})
export class AuthModalComponent {
  protected readonly open = signal(false);
  protected readonly mode = signal<AuthMode>('login');

  protected openAuth(): void {
    this.open.set(true);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected switchMode(mode: AuthMode): void {
    this.mode.set(mode);
  }
}
