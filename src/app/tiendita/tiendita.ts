import { Component, signal } from '@angular/core';

import { ButtonComponent } from '../ui/button/button';
import { InputComponent } from '../ui/input/input';

@Component({
  selector: 'app-tiendita',
  imports: [ButtonComponent, InputComponent],
  templateUrl: './tiendita.html'
})
export class TienditaComponent {
  protected readonly storeUid = 'ST-0001';
  protected readonly storeName = signal('miniShop');
  protected readonly saved = signal(false);

  protected onNameChange(value: string): void {
    this.storeName.set(value);
    this.saved.set(false);
  }

  protected save(): void {
    this.storeName.set(this.storeName().trim());
    this.saved.set(true);
  }
}
