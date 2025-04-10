import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php'; // Assure-toi que l'URL est correcte

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

   

  getClasses(): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getClasses&annee_scolaire_id=${anneeId}`);
  }

  getClasseById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getClasseById&id=${id}`).pipe(
      tap((data) => {
        console.log("Données reçues pour la classe :", data);
        if (!data || typeof data !== 'object') {
          console.error("Erreur: La réponse de l'API est invalide !");
        }
      })
    );
  }

  // 🔹 Ajouter une classe
   // Ajouter une classe avec l'année scolaire actuelle
  ajouterClasse(classe: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    classe.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterClasse`, classe);
  }

  // 🔹 Modifier une classe
  // modifierClasse(classeId: number, classe: any): Observable<any> {
  //   return this.http.put<any>(this.apiUrl, { action: 'modifierClasse', id: classeId, ...classe });
  // }

  modifierClasse(classe: any): Observable<any> {
    console.log('URL appelée:', `${this.apiUrl}?action=modifierClasse&id=${classe.id}`);
    return this.http.put(`${this.apiUrl}?action=modifierClasse&id=${classe.id}`, classe);
  }

  // 🔹 Supprimer une classe
  supprimerClasse(classeId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerClasse&id=${classeId}`);
  }
}







