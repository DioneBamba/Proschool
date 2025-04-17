import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnneeScolaireService } from './annee-scolaire.service';
import { Observable } from 'rxjs/internal/Observable';
import { of, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost/proSchool/backend/api/api.php';

  constructor(private http: HttpClient, private anneeService: AnneeScolaireService) {}

  getNotifications(role: string) {
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('Année actuelle pour les notifs:', anneeId);
    if (!anneeId) {
      console.error('Aucune année scolaire sélectionnée. Veuillez en définir une.');
      // return new Observable(); // Retourne un observable vide
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}?action=getNotifications&annee_scolaire_id=${anneeId}&role=${role}`);
  }

  ajouterNotification(notification: any) {
    const anneeId = this.anneeService.getAnneeActuelle();
    if (!anneeId) return of([]);
    
    notification.annee_scolaire_id = anneeId;
    return this.http.post<any>(`${this.apiUrl}?action=ajouterNotification`, notification);
  }

  marquerCommeLue(id: number) {
    return this.http.post(`${this.apiUrl}?action=marquerCommeLue`, { id });
  }

}
