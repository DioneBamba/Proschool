import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmargementService } from '../services/emargement.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClasseService } from '../services/classe.service';
import { EnseignantService } from '../services/enseignant.service';
import { MatiereService } from '../services/matiere.service';

@Component({
  selector: 'app-emargements',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './emargements.component.html',
  styleUrl: './emargements.component.css'
})
export class EmargementsComponent implements OnInit {
  emargements: any[] = [];
  classes: any[] = [];
  matieres: any[] = [];
  enseignants: any[] = [];
  loading: boolean = true;

  constructor(private emargementService: EmargementService, 
    private router: Router,
    private enseignantService: EnseignantService,
    private classeService: ClasseService,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.emargementService.getEmargements().subscribe(
      (data) => {
        console.log("Données récupérées :", data);
        if (data && Array.isArray(data)) {
          this.emargements = data;
        } else {
          this.emargements = [];
          console.error("Données incorrectes reçues :", data);
        }
        this.loading = false;
      },
      (error) => {
        console.error("Erreur lors du chargement des absences :", error);
        this.emargements = [];
        this.loading = false;
      }
    );

    // this.chargerEmargements();
    // this.chargerDonnees();
  }

  navigateToModifEmargement(emargement: any) {
    if (!emargement || !emargement.id) {
      console.error("Emargement or emargement.id is undefined:", emargement);
      return;
    }
    return this.router.navigate(['/modif-emargement', emargement.id]);
  }
  


  supprimerEmargement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet émargement ?')) {
      this.emargementService.supprimerEmargement(id).subscribe(() => {
        console.log('Émargement supprimé');
        // this.chargerEmargements(); // Refresh the list
      });
    }
  }
}