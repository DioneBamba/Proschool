import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost/backend/api/api.php';

  constructor(private http: HttpClient) {}

  getPaiements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?action=getPaiements`);
  }

  addPaiement(paiement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=addPaiement`, paiement);
  }

  deletePaiement(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=deletePaiement&id=${id}`);
  }
}
