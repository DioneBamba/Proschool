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


  /*
  getEnseignants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?action=getEnseignants`);
  }

  getEnseignantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getEnseignant&id=${id}`);
  }


  ajouterEnseignant(enseignant: any, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('prenom', enseignant.prenom || '');
    formData.append('nom', enseignant.nom || '');
    formData.append('date_naissance', enseignant.date_naissance || '');
    formData.append('lieu_naissance', enseignant.lieu_naissance || '');
    formData.append('telephone', enseignant.telephone || '');
    formData.append('profession', enseignant.profession || '');
    formData.append('annee_scolaire_id', String(enseignant.annee_scolaire_id));
    if (photo) formData.append('photo', photo);
  
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  
    return this.http.post(`${this.apiUrl}?action=ajouterEnseignant`, formData);
  }
 


 

  supprimerEnseignant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?action=supprimerEnseignant&id=${id}`);
  }

  modifierEnseignant(id: string, enseignantData: FormData): Observable<any> {
    console.log('FormData envoyée:', enseignantData); 
    return this.http.post(`${this.apiUrl}?action=modifierEnseignant`, enseignantData);
      
  }

  */

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




