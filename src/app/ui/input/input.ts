import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.html'
})
export class InputComponent {
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly id = input<string>('');
}
