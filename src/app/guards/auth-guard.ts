import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role   = localStorage.getItem('tud_role');
  const email  = localStorage.getItem('tud_email');

  if (role && email) {
    return true;
  }

  router.navigateByUrl('/login', { replaceUrl: true });
  return false;
};