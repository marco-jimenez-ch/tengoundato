import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const router       = inject(Router);
  const expectedRole = route.data?.['expectedRole'] as string;
  const actualRole   = localStorage.getItem('tud_role');

  if (!expectedRole || actualRole === expectedRole) {
    return true;
  }

  const destino = actualRole === 'maestro' ? '/maestro' : '/cliente';
  router.navigateByUrl(destino, { replaceUrl: true });
  return false;
};