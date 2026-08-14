import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const pendingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn) {
    return router.createUrlTree(['/auth']);
  }
  if (auth.role === 'empleado' && auth.isPending) {
    return true;
  }
  return router.createUrlTree([auth.role === 'admin' ? '/admin' : '/dashboard']);
};
