import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class ScolariteService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient,  private anneeService: AnneeScolaireService) { }

  // Lister les scolarités
  /*getScolarites(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getScolarites`);
  }*/
  
   // 🔹 Récupérer les paiements de l'année scolaire sélectionnée
   getScolarites(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getScolarites&annee_scolaire_id=${anneeId}`);
  }

  getScolariteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getScolariteById&id=${id}`).pipe(
      tap(response => console.log('Réponse de l\'API :', response)),
      catchError(error => {
        console.error('Erreur dans la requête API :', error);
        return throwError(() => new Error(error));
      })
    );
  }
  getEleves(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEleves`);
  }

  /*

  // Ajouter une scolarité
  ajouterScolarite(scolarite: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=ajouterScolarite`, {
      eleve_id: scolarite.eleve_id,
      date_naissance: scolarite.date_naissance, // Assurez-vous que cette valeur est bien définie
      sexe: scolarite.sexe,                     // Assurez-vous que cette valeur est bien définie
      classe_id: scolarite.classe_id,
      cout_scolarite: scolarite.cout_scolarite,
      montant_paye: scolarite.montant_paye,
      reste_a_payer: scolarite.restae_a_payer,
      date_paiement: scolarite.date_paiement
  
    });
  }

  // Modifier une scolarité
  modifierScolarite(id: number, scolarite: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=modifierScolarite&id=${id}`, scolarite);
  }

  // Supprimer une scolarité
  supprimerScolarite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?action=supprimerScolarite&id=${id}`);
  }
  */

  // 🔹 Ajouter un paiement
  ajouterScolarite(scolarite: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    scolarite.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterScolarite`, scolarite);
  }

  // 🔹 Modifier un paiement
  modifierScolarite(scolariteId: number, scolarite: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=modifierScolarite&id=${scolariteId}`, scolarite);
  }

  // 🔹 Supprimer un paiement
  supprimerScolarite(scolariteId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerScolaritet&id=${scolariteId}`);
  }
}


