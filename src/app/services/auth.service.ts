import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

    // 🔹 BehaviorSubject pour stocker l'utilisateur connecté
    private userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable(); // Observable pour s'abonner à l'utilisateur

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) 
  {
     // 🔹 Charger l'utilisateur depuis le localStorage si disponible
     const userData = localStorage.getItem('user');
     if (userData) {
       this.userSubject.next(JSON.parse(userData));
     }
  }

  

   // 🔹 Inscription avec l'année scolaire actuelle
   register(user: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    user.annee_scolaire_id = anneeId; // Ajout de l'année scolaire
    return this.http.post(`${this.apiUrl}?action=register`, user);
  }

  // 🔹 Connexion (ajout de l'année scolaire si nécessaire)
  login(credentials: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    credentials.annee_scolaire_id = anneeId; // Ajout de l'année scolaire
    return this.http.post<{ user?: any }>(`${this.apiUrl}?action=login`, credentials).pipe(
      tap(response =>{ 
        console.log('Réponse API:', response);
        if (response && response.user) {
          console.log('✅ Utilisateur enregistré:', response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role);
          this.userSubject.next(response.user); // 🔹 Mise à jour de l'utilisateur
          console.log("🔄 Rôle mis à jour dans Sidebar:", response.user.role);
        } else {
          console.log('❌ Aucune donnée utilisateur reçue.');
        }
      }), // Debug
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(error);
      })
    );
  }

  /*
  login(email: string, password: string) {
    const body = { email, password };
  
    return this.http.post<any>(`${this.apiUrl}?action=login`, body).pipe(
      tap(response => console.log('Réponse API:', response)), // Debug ici
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(error);
      })
    );
  }
*/
  logout(): void {
    // localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null); // 🔹 Réinitialiser l'utilisateur
  }

  isAuthenticated(): boolean {
    // const token = localStorage.getItem('token');
    // console.log("🔑 Vérification de l'authentification:", token);
    // return !!token; // Retourne vrai si le token existe
    console.log("Verification auth: ", this.userSubject.value);
    return !!this.userSubject.value; // 🔹 Retourne vrai si un utilisateur est connecté
  }

  getUserRole(): string {
    // const role = localStorage.getItem('role');
    // console.log('Rôle récupéré depuis localStorage:', role);
    // return role || '';  }
    console.log("Rôle actuel:", this.userSubject.value?.role);
     return this.userSubject.value?.role || ''; // 🔹 Accès direct depuis le BehaviorSubject
  }

   // 🔹 Récupérer l'utilisateur actuel (utile pour éviter les abonnements dans certains cas)
  getCurrentUser(): any {
    return this.userSubject.value;
  }
}



