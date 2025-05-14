import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class BibliothequeService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

  getLivres(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getLivres&annee_scolaire_id=${anneeId}`);
  }

  getEmprunts(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getEmprunts&annee_scolaire_id=${anneeId}`);
  }

  emprunterLivre(emprunt: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    return this.http.post(`${this.apiUrl}?action=emprunterLivre`, emprunt);
  }

  retournerLivre(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=retournerLivre`, { id });
  }

  ajouterLivre(livre: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    livre.annee_scolaire_id = anneeId;
    return this.http.post(`${this.apiUrl}?action=ajouterLivre`, livre);
  }

  modifierLivre(livreId: number, livre: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=modifierLivre&id=${livreId}`, livre);
  }
  
  supprimerLivre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?action=supprimerLivre&id=${id}`);
  }
}
