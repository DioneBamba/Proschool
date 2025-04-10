import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php'; // Assure-toi que l'URL est correcte
  
    constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}
  
    /*
    getMatieres(): Observable<any[]> { // Ajout de la méthode
      return this.http.get<any[]>(`${this.apiUrl}?action=getMatieres`);
    }
  
    ajouterMatiere(classe: any): Observable<any> {
      return this.http.post(`${this.apiUrl}?action=ajouterMatiere`, classe);
    }
    
    getMatiereById(id: any): Observable<any> {
      return this.http.get(`${this.apiUrl}?action=getMatiereById&id=${id}`);
    }
    
  
  
    modifierMatiere(classe: any): Observable<any> {
      console.log('URL appelée:', `${this.apiUrl}?action=modifierMatiere&id=${classe.id}`);
      return this.http.put(`${this.apiUrl}?action=modifierMatiere&id=${classe.id}`, classe);
    }
    
    supprimerMatiere(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}?action=supprimerMatiere&id=${id}`);
    }

    */

    // 🔹 Récupérer les matières de l'année en cours
    getMatieres(): Observable<any[]> {
      const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
      return this.http.get<any[]>(`${this.apiUrl}?action=getMatieres&annee_scolaire_id=${anneeId}`);
    }
  
    // 🔹 Récupérer une matière par ID
    getMatiereById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?action=getMatiereById&id=${id}`);
    }
  
    // 🔹 Ajouter une matière
    ajouterMatiere(matiere: any): Observable<any> {
      const anneeId = this.anneeService.getAnneeActuelle();
      if (!anneeId) {
        console.error('Aucune année scolaire sélectionnée.');
        return new Observable();
      }
      matiere.annee_scolaire_id = anneeId;
      return this.http.post<any>(`${this.apiUrl}?action=ajouterMatiere`, matiere);
    }
  
    // 🔹 Modifier une matière
    // modifierMatiere(classe: any): Observable<any> {
    //   return this.http.put<any>(this.apiUrl, { action: 'modifierMatiere', classe });
    // }

    // modifierMatiere(matiere: any): Observable<any> {
    //   console.log('URL appelée:', `${this.apiUrl}?action=modifierMatiere&id=${matiere.id}`);
    //   return this.http.put(`${this.apiUrl}?action=modifierMatiere&id=${matiere.id}`, matiere);
    // }

    modifierMatiere(matiere: any): Observable<any> {
      console.log('Données envoyées:', JSON.stringify(matiere));
      return this.http.put(`${this.apiUrl}?action=modifierMatiere&id=${matiere.id}`, matiere);
    }
  
    // 🔹 Supprimer une matière
    supprimerMatiere(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}?action=supprimerMatiere&id=${id}`);
    }
}

