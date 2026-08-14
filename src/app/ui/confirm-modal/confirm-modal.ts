import { Component, input, output } from '@angular/core';

import { ModalComponent, ModalSize } from '../modal/modal';
import { ButtonComponent, ButtonVariant } from '../button/button';

@Component({
  selector: 'app-confirm-modal',
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.html'
})
export class ConfirmModalComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmText = input<string>('Confirmar');
  readonly cancelText = input<string>('Cancelar');
  readonly danger = input(false);
  readonly size = input<ModalSize>('sm');
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected confirmVariant(): ButtonVariant {
    return this.danger() ? 'danger' : 'primary';
  }
}
