import { Component, input, output } from '@angular/core';

export type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.html'
})
export class AuthTabsComponent {
  readonly mode = input.required<AuthMode>();
  readonly switchMode = output<AuthMode>();
}
