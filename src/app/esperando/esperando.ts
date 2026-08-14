import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ButtonComponent } from '../ui/button/button';

@Component({
  selector: 'app-esperando',
  imports: [ButtonComponent],
  templateUrl: './esperando.html'
})
export class EsperandoComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
