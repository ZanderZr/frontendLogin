import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from 'src/app/services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const _usersService = inject(UsersService);
  const token = _usersService.getToken();
  
  if (token) {
    return true; // Usuario autenticado
  } else {
    router.navigate(['/login']);
    return false; // Usuario no autenticado
  }
};
