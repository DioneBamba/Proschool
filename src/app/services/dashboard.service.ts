import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AnneeScolaireService } from './annee-scolaire.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}
/*
  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=admin`);
  }

  getEnseignantStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=enseignant`);
  }

  getEleveStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=eleve`);
  }
*/
  
  // 🔹 Récupérer les statistiques administrateur
  getAdminStats(): Observable<any> {
    // const anneeScolaireId = localStorage.getItem('anneeScolaireId');
    // console.log('ID Année Scolaire:', localStorage.getItem('anneeScolaireId'));
    // console.log(`Requête envoyée : ${this.apiUrl}?action=getAdminStats&annee_scolaire_id=${anneeScolaireId}`);
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    console.log(`Requête envoyée : ${this.apiUrl}?action=getAdminStats&annee_scolaire_id=${anneeId}`);
    return this.http.get<any>(`${this.apiUrl}?action=getAdminStats&annee_scolaire_id=${anneeId}`);
  }

  // 🔹 Récupérer les statistiques des enseignants
  getEnseignantStats(): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    console.log(`Requête envoyée : ${this.apiUrl}?action=getEnseignantStats&annee_scolaire_id=${anneeId}`);
    return this.http.get<any>(`${this.apiUrl}?action=getEnseignantStats&annee_scolaire_id=${anneeId}`);
    
    
  }

  // 🔹 Récupérer les statistiques des élèves
  getEleveStats(): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('ID Année Scolaire:', this.anneeService.getAnneeActuelle());
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      return new Observable(); // Retourne un observable vide
    }
    console.log(`Requête envoyée : ${this.apiUrl}?action=getEleveStats&annee_scolaire_id=${anneeId}`);
    return this.http.get<any>(`${this.apiUrl}?action=getEleveStats&annee_scolaire_id=${anneeId}`);
  }

}
