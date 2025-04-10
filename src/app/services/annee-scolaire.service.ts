import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';
  private anneeActuelleKey = 'annee_scolaire_actuelle';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les années scolaires depuis l'API
  getAnneesScolaires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?action=getAnneesScolaires`);
  }
  ajouterAnneeScolaire(annee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=ajouterAnneeScolaire`, annee);
  }

  // getAnneesScolaires(table: string, annee: string): Observable<any> {
  //   console.log(`Requête API : ${this.apiUrl}?table=${table}&anneeScolaire=${annee}`);
  //   return this.http.get<any>(`${this.apiUrl}?table=${table}&anneeScolaire=${annee}`);
  // }

  // Récupérer l'année scolaire sélectionnée depuis localStorage
  // getAnneeActuelle(): number | null {
  //   // return parseInt(localStorage.getItem(this.anneeActuelleKey) || '0', 10);
  //   const annee = localStorage.getItem(this.anneeActuelleKey);
  //   return annee ? parseInt(annee, 10) : null;
  // }

  getAnneeActuelle(): number | null {
    const annee = localStorage.getItem(this.anneeActuelleKey);
    console.log('Année scolaire récupérée depuis localStorage :', annee);  // Vérifie la valeur récupérée
    if (annee) {
      const anneeId = parseInt(annee, 10);
      if (isNaN(anneeId)) {
        console.error('ID de l\'année scolaire invalide');
        return null; // ou retourne un ID par défaut
      }
      return anneeId;
    }
    return null;
  }

  // Définir l'année scolaire sélectionnée
  setAnneeActuelle(anneeId: number) {
    localStorage.setItem(this.anneeActuelleKey, anneeId.toString());
     console.log('Année scolaire définie :', anneeId);  // Vérifie que l'année scolaire est bien stockée
  }
}


