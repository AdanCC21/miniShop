import { Component, computed, HostListener, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  readonly open = input(false);
  readonly close = output<void>();
  readonly widthChange = output<number>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;

  protected readonly isStoreMember = computed(() => {
    const role = this.auth.role;
    return role === 'encargado' || role === 'empleado';
  });

  protected readonly isEncargado = computed(() => this.auth.role === 'encargado');

  protected readonly isAdmin = computed(() => this.auth.role === 'admin');

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }

  private readonly minWidthVw = 10;
  private readonly maxWidthVw = 50;

  private dragging = false;

  @HostListener('window:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    event.preventDefault();
    this.widthChange.emit(this.clampedWidth(event.clientX));
  }

  @HostListener('window:pointerup')
  protected onPointerUp(): void {
    this.dragging = false;
  }

  @HostListener('window:pointercancel')
  protected onPointerCancel(): void {
    this.dragging = false;
  }

  protected startResize(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    event.preventDefault();
    this.dragging = true;
  }

  private clampedWidth(clientX: number): number {
    const viewport = window.innerWidth;
    if (viewport <= 0) {
      return this.minWidthVw;
    }
    const vw = (clientX / viewport) * 100;
    return Math.min(this.maxWidthVw, Math.max(this.minWidthVw, Math.round(vw * 10) / 10));
  }
}
