import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

  /*
  getAbsences(): Observable<any> {
    // return this.http.get(`${this.apiUrl}?action=getAbsences`);
    return this.http.get(`${this.apiUrl}?action=getAbsences`).pipe(
      tap(data => console.log("Données reçues :", data)),
      catchError(error => {
        console.error("Erreur API :", error);
        return of([]); // Retourne un tableau vide pour éviter l'erreur null
      })
    );
  }

  getAbsenceById(id: number): Observable<any> {
    console.log(`Requête envoyée à l'API : ${this.apiUrl}?action=getAbsenceById&id=${id}`);
    return this.http.get<any>(`${this.apiUrl}?action=getAbsenceById&id=${id}`).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération de l'absence :", error);
        return of(null);
      })
    );
  }

  getEleves(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEleves`);
  }
  
  getMatieres(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getMatieres`);
  }
  
  getEnseignants(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEnseignants`);
  }
  
  getClasses(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getClasses`);
  }
 
  ajouterAbsence(absence: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=ajouterAbsence`, absence);
  }

  modifierAbsence(id: number, absence: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=modifierAbsence&id=${id}`, absence);
  }

  supprimerAbsence(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?action=supprimerAbsence&id=${id}`);
  }
    */

   // 🔹 Récupérer les absences de l'année scolaire sélectionnée
   getAbsences(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getAbsences&annee_scolaire_id=${anneeId}`).pipe(
      tap(data => console.log("Données reçues :", data)),
      catchError(error => {
        console.error("Erreur API :", error);
        return of([]); // Retourne un tableau vide pour éviter l'erreur null
      })
    );
  }

  getAbsenceById(id: number): Observable<any> {
    console.log(`Requête envoyée à l'API : ${this.apiUrl}?action=getAbsenceById&id=${id}`);
    return this.http.get<any>(`${this.apiUrl}?action=getAbsenceById&id=${id}`).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération de l'absence :", error);
        return of(null);
      })
    );
  }

  getAbsencesByEleveId(eleveId: number): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getAbsencesByEleveId&eleve_id=${eleveId}&annee_scolaire_id=${anneeId}`).pipe(
      tap(data => console.log("Absences de l'élève reçues :", data)),
      catchError(error => {
        console.error("Erreur API :", error);
        return of([]);
      })
    );
  }

  getEleves(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEleves`);
  }
  
  getMatieres(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getMatieres`);
  }
  
  getEnseignants(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEnseignants`);
  }
  
  getClasses(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getClasses`);
  }

  // 🔹 Ajouter une absence
  ajouterAbsence(absence: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    absence.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterAbsence`, absence);
  }

  modifierAbsence(AbsenceId: number, absence: any): Observable<any> {
    return this.http.put(`${this.apiUrl}?action=modifierAbsence&id=${AbsenceId}`, absence);
  }

  // 🔹 Supprimer une absence
  supprimerAbsence(absenceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerAbsence&id=${absenceId}`);
  }
}

