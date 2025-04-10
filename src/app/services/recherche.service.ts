import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnneeScolaireService } from './annee-scolaire.service';

@Injectable({
  providedIn: 'root'
})
export class RechercheService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

  // search(query: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?action=recherche&q=${query}`);
  // }

  // getDetails(id: string, type: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}?action=getDetails&id=${id}&type=${type}`);
  // }

  search(query: string): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }

    return this.http.get<any>(`${this.apiUrl}?action=recherche&q=${query}&annee_scolaire_id=${anneeId}`);
  }

  getDetails(id: string, type: string): Observable<any> {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée.');
      return new Observable();
    }

    return this.http.get<any>(`${this.apiUrl}?action=getDetails&id=${id}&type=${type}&annee_scolaire_id=${anneeId}`);
  }
}
