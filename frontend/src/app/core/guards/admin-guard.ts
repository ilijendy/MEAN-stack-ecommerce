import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth=inject(Auth);
  const router=inject(Router)

  if(auth.isLogIn()&&auth.isAdmin()){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
