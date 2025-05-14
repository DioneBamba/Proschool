import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php'; // Change l'URL si nécessaire

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) { }

  getEleves(idEleve: number): Observable<any[]> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    console.log('ID de l\'année scolaire passé à l\'API :', anneeId);  // Vérifie la valeur envoyée
    return this.http.get<any[]>(`${this.apiUrl}?action=getEleves&annee_scolaire_id=${anneeId}`);
  }

 

  ajouterEleve(eleve: any): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    eleve.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterEleve`, eleve);
  }

  
  getEleveById(id: number): Observable<any> { // Ajout de la méthode
    return this.http.get<any>(`${this.apiUrl}?action=getEleveById=${id}`);
  }
  
  getNombreElevesParClasse(nomClasse: string): Observable<number> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }
    return this.http.get<number>(`${this.apiUrl}?action=getNombreElevesParClasse&classe=${nomClasse}&annee_scolaire_id=${anneeId}`);
  }

  getElevesParClasse(nomClasse: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}?classe=${nomClasse}`);
}

  getRangElevesParClasse(nomClasse: string): Observable<any[]> {
    return this.getElevesParClasse(nomClasse).pipe(
      map((eleves: any[]) => {
        eleves.sort((a, b) => b.moyenne_generale - a.moyenne_generale);
        eleves.forEach((eleve, index) => {
          eleve.rang = index + 1;
        });
        return eleves;
      })
    );
  }


  // 🔹 Modifier un élève existant
  modifierEleve(eleveId: number, eleve: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?action=modifierEleve&id=${eleveId}`, eleve);
  }

  supprimerEleve(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?action=supprimerEleve&id=${id}`);
  }
  
}




