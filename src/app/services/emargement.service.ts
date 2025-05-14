import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class EmargementService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php'; // Assure-toi que l'URL est correcte

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

   

  getEmargements(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getEmargements&annee_scolaire_id=${anneeId}`);
  }

  getEmargementById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEmargementById&id=${id}`).pipe(
      tap((data) => {
        console.log("Données reçues pour la Emargement :", data);
        if (!data || typeof data !== 'object') {
          console.error("Erreur: La réponse de l'API est invalide !");
        }
      })
    );
  }

  // 🔹 Ajouter une classe
   // Ajouter une classe avec l'année scolaire actuelle
  ajouterEmargement(emargement: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    emargement.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterEmargement`, emargement);
  }

  // 🔹 Modifier une Emargement
  modifierEmargement(emargement: any): Observable<any> {
    console.log('URL appelée:', `${this.apiUrl}?action=modifierEmargement&id=${emargement.id}`);
    return this.http.put(`${this.apiUrl}?action=modifierEmargement&id=${emargement.id}`, emargement).pipe(
      tap({
        next: (res) => console.log('Success response:', res),
        error: (err) => console.error('API Error:', err),
      })
    );
  }

  // 🔹 Supprimer une Emargement
  supprimerEmargement(emargementId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerEmargement&id=${emargementId}`);
  }
}
