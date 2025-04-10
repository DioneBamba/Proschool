import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap , throwError} from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class EmploisDuTempsService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}


  // 🔹 Récupérer les emplois du temps de l'année en cours
  getEmplois(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getEmplois&annee_scolaire_id=${anneeId}`);
  }

  // 🔹 Récupérer un emploi du temps par ID
  getEmploisById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=getEmploiById&id=${id}`);
  }

  getMatieres(): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any>(`${this.apiUrl}?action=getMatieres&annee_scolaire_id=${anneeId}`);
  }

  // getEmploisByClasse(classeId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?action=getEmplois&classe_id=${classeId}`);
  // }

  getEmploisByClasse(classeId: number): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    return this.http.get<any>(
      `${this.apiUrl}?action=getEmplois&classe_id=${classeId}&annee_scolaire_id=${anneeId}`
    );
  }

  getClasses(): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any>(`${this.apiUrl}?action=getClasses&annee_scolaire_id=${anneeId}`);
  }

  // 🔹 Ajouter un emploi du temps
  ajouterEmplois(emploi: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    emploi.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterEmplois`, emploi);
  }

  // 🔹 Modifier un emploi du temps
  modifierEmplois(id: number, emploi: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, { action: 'modifierEmplois', id, ...emploi });
  }

  // 🔹 Supprimer un emploi du temps
  supprimerEmplois(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerEmplois&id=${id}`);
  }


}