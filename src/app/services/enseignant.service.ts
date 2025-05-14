import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

  // 🔹 Récupérer les enseignants actifs pour l'année scolaire
  getEnseignants(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getEnseignants&annee_scolaire_id=${anneeId}`);
  }

  // 🔹 Récupérer un enseignant par ID
  getEnseignantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getEnseignantById&id=${id}`);
  }

  ajouterEnseignant(enseignant: any ): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    enseignant.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterEnseignant`, enseignant);
  }

  // 🔹 Modifier un enseignant
  modifierEnseignant(enseignantId: number, enseignant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?action=modifierEnseignant&id=${enseignantId}`, enseignant);
  }

  // 🔹 Supprimer un enseignant
  supprimerEnseignant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerEnseignant&id=${id}`);
  }
}




