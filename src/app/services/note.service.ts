import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient,  private anneeService: AnneeScolaireService) {}

  // 🔹 Récupérer les notes de l'année scolaire sélectionnée
  getNotes(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getNotes&annee_scolaire_id=${anneeId}`);
  }

  getNoteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getNoteById&id=${id}`);
  }

  getNotesByEleveId(eleveId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?action=getNotesByEleveId&eleve_id=${eleveId}`);
  }
  

  getEleves(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEleves`);
  }
  getEleveById(eleveId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEleveById&eleve_id=${eleveId}`);
  }

  getMatieres(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getMatieres`);
  }

  getClasses(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getClasses`);
  }

  getEnseignants(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getEnseignants`);
  }

  // 🔹 Ajouter une note
  ajouterNote(note: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    note.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterNote`, note);
  }

  // 🔹 Modifier une note
  modifierNote(noteId: number, note: any): Observable<any> {
    // return this.http.put(`${this.apiUrl}?action=modifierNote=${noteId}`, note);
    return this.http.put(`${this.apiUrl}?action=modifierNote&id=${noteId}`, note);

  }

  // 🔹 Supprimer une note
  supprimerNote(noteId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerNote&id=${noteId}`);
  }

  
  getNotesParEleve(eleveId: number): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle(); // Récupère l'année scolaire actuelle
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un Observable vide si aucune année scolaire n'est définie
    }
  
    const url = `${this.apiUrl}?action=getNotesParEleve&eleve_id=${eleveId}&annee_scolaire_id=${anneeId}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des notes de l\'élève :', error);
        alert('Impossible de récupérer les notes. Veuillez vérifier votre connexion ou réessayer plus tard.');
        throw error; // Relance l'erreur pour être gérée ailleurs si nécessaire
      })
    );
  }
  
  
}
