import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const storeMemberGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.role;
  if (role === 'encargado') {
    return true;
  }
  if (role === 'empleado') {
    return auth.isPending ? router.createUrlTree(['/esperando']) : true;
  }
  return router.createUrlTree([role === 'admin' ? '/admin' : '/auth']);
};
