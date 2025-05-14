import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { SelectAnneeScolaireComponent } from "../annee-scolaire/select-annee-scolaire/select-annee-scolaire.component";
import { AnneeScolaireComponent } from "../annee-scolaire/annee-scolaire.component";
import { AjoutAnneeScolaireComponent } from "../annee-scolaire/ajout-annee-scolaire/ajout-annee-scolaire.component";


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SelectAnneeScolaireComponent,
    AjoutAnneeScolaireComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // 🔹 Déclaration du FormGroup pour stocker les statistiques
  statsForm!: FormGroup;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    
    private anneeService: AnneeScolaireService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔹 Initialisation du FormGroup
    this.statsForm = this.fb.group({
      totalEleves: [0],
      totalEnseignants: [0],
      totalPaiements: [0],
      totalAbsences: [0]
    });

     // Charger les années scolaires et définir l'année actuelle
     this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelleId = this.anneeService.getAnneeActuelle();

      if (anneeActuelleId) {
        this.anneeScolaireId = anneeActuelleId;
        this.statsForm.patchValue({ annee_scolaire_id: anneeActuelleId });

        const anneeActuelle = annees.find(a => a.id === anneeActuelleId);
        if (anneeActuelle) {
          this.anneeScolaireLibelle = anneeActuelle.libelle;
        }
      } else if (annees.length > 0) {
        // Si aucune année n'est sélectionnée, choisir la première disponible
        this.anneeScolaireId = annees[0].id;
        this.statsForm.patchValue({ annee_scolaire_id: this.anneeScolaireId });
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      } else {
        console.warn("Aucune année scolaire disponible.");
      }
    });
    
    console.log('AdminDashboardComponent chargé');
    this.dashboardService.getAdminStats().subscribe(stats => {
      console.log('Données reçues:', stats);
      this.statsForm.patchValue({
        totalEleves: stats.totalEleves,
        totalEnseignants: stats.totalEnseignants,
        totalPaiements: stats.totalPaiements,
        totalAbsences: stats.totalAbsences
      });
    });
  }
}