import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eleve-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './eleve-dashboard.component.html',
  styleUrl: './eleve-dashboard.component.css'
})
export class EleveDashboardComponent implements OnInit {
  emploiDuTempsDuJour: any[] = [];
  meilleuresMoyennes: any[] = [];
  totalAbsences: number = 0;
  eleveStatsForm!: FormGroup;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;
  jourActuel: string = '';

  constructor(
    private dashboardService: DashboardService, 
    private anneeService: AnneeScolaireService,
    private fb: FormBuilder
  ) {
     // 🔹 Initialisation du FormGroup
     this.eleveStatsForm = this.fb.group({
      emploiDuTemps: ['', Validators.required],
      moyenneGenerale: [0],
      totalAbsences: [0]
    });
  }

  ngOnInit() {
    // Déterminer le jour actuel
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    this.jourActuel = days[new Date().getDay()];

    // 🔁 Récupération de l'année scolaire
    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelle = this.anneeService.getAnneeActuelle();

      if (anneeActuelle) {
        this.anneeScolaireId = anneeActuelle;
      } else if (annees.length > 0) {
        this.anneeScolaireId = annees[0].id;
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      } else {
        console.warn("Aucune année scolaire disponible.");
        return;
      }

      // ✅ Appeler le dashboard SEULEMENT après avoir obtenu l'année
      this.dashboardService.getEleveStats().subscribe(data => {
        console.log('Données dashboard élève:', data);

        if (!data) {
          console.warn("Aucune donnée reçue du backend.");
          return;
        }

        this.emploiDuTempsDuJour = data.emploiDuTemps || [];
        this.meilleuresMoyennes = data.meilleuresMoyennes || [];
        this.totalAbsences = data.totalAbsences || 0;
      }, error => {
        console.error('Erreur dashboard élève:', error);
      });
    });
  
  }
/*
  getEmploiDuTempsDuJour(): void {
    this.dashboardService.getEleveStats().subscribe({
      next: (data) => this.emploiDuTempsDuJour = data,
      error: (error) => console.error('Erreur emploi du temps :', error)
    });
  }

  getMeilleuresMoyennes(): void {
    this.dashboardService.getEleveStats().subscribe({
      next: (data) => this.meilleuresMoyennes = data,
      error: (error) => console.error('Erreur moyennes :', error)
    });
  }

  getTotalAbsences(): void {
    this.dashboardService.getEleveStats().subscribe({
      next: (data) => this.totalAbsences = data.total,
      error: (error) => console.error('Erreur absences :', error)
    });
  }

*/

}