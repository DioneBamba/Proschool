import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../services/absence.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    RouterModule,
    CommonModule,
    NgxPaginationModule
  ],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})
export class AbsencesComponent implements OnInit {
  absences: any[] = [];
  searchText: string = ''; // Correction de l'erreur NG9
  page: number = 1; // Correction de l'erreur NG9
  loading: boolean = true; // Défini comme true au début
  selectedClasse: string = ''; // Par défaut, aucune classe sélectionnée
  config: any = {
    id: 'my-pagination',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

 
  constructor(private absenceService: AbsenceService) {}

  ngOnInit(): void {
    this.absenceService.getAbsences().subscribe(
      (data) => {
        console.log("Données récupérées :", data);
        if (data && Array.isArray(data)) {
          this.absences = data;
        } else {
          this.absences = [];
          console.error("Données incorrectes reçues :", data);
        }
        this.loading = false;
      },
      (error) => {
        console.error("Erreur lors du chargement des absences :", error);
        this.absences = [];
        this.loading = false;
      }
    );
  }

  pageChanged(event: number) {
    this.config.currentPage = event;
  }

  loadAbsences(): void {
    this.absenceService.getAbsences().subscribe(data => {
      console.log("Données récupérées :", data)
      this.absences = data;
    });
  }

 /* getFilteredAbsences() {
    // return this.absences.filter(absence =>
    //   absence.eleve_id.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //   absence.matiere_id.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //   absence.enseignant_id.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //   absence.classe_id.toLowerCase().includes(this.searchText.toLowerCase())
    // );

    return this.absences ? this.absences.filter(a => a.classe === this.selectedClasse) : [];
  }
*/
  getFilteredAbsences() {
    return this.absences.filter(a => a.classe === this.selectedClasse);
  }

  supprimerAbsence(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette absence ?')) {
      this.absenceService.supprimerAbsence(id).subscribe(() => {
        this.loadAbsences();
      });
    }
  }
}
