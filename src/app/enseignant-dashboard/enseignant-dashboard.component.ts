import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './enseignant-dashboard.component.html',
  styleUrl: './enseignant-dashboard.component.css'
})
export class EnseignantDashboardComponent implements OnInit {
  classes: any[] = [];
  emploiDuTemps: any[] = [];
  absences: any[] = [];
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(private dashboardService: DashboardService, private anneeService: AnneeScolaireService) {}

  ngOnInit() {
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

      // Récupérer les statistiques de l'enseignant
      this.dashboardService.getEnseignantStats().subscribe(stats => {
        this.classes = stats.classes || [];
        this.emploiDuTemps = stats.emploiDuTemps || [];
        this.absences = stats.absences || [];
      });
    });

    
  }
}
