import { Component } from '@angular/core';

import { AuthModalComponent } from '../auth-modal/auth-modal';

@Component({
  selector: 'app-header',
  imports: [AuthModalComponent],
  templateUrl: './header.html'
})
export class HeaderComponent {}
