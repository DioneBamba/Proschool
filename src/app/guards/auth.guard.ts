import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("🔍 AuthGuard activé !");
  console.log("Token présent ?", localStorage.getItem('token'));
  console.log("Rôle détecté :", authService.getUserRole());

  if (!authService.isAuthenticated()) {
    console.warn("🚫 Pas authentifié, retour à /login");
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data?.['roles'] as Array<string>;
  if (roles && !roles.includes(authService.getUserRole())) {
    console.warn("🚫 Accès refusé : rôle non autorisé !");
    router.navigate(['/unauthorized']);
    return false;
  }

  console.log("✅ Accès autorisé à :", state.url);
  return true;
}; 



