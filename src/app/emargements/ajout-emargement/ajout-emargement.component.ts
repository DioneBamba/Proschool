import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AbsenceService } from '../../services/absence.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';
import { CommonModule } from '@angular/common';
import { EmargementService } from '../../services/emargement.service';

@Component({
  selector: 'app-ajout-emargement',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './ajout-emargement.component.html',
  styleUrl: './ajout-emargement.component.css'
})
export class AjoutEmargementComponent implements OnInit{

  emargementForm!: FormGroup;
  matieres: any[] = [];
  enseignants: any[] = [];
  classes: any[] = [];
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private emargementService: EmargementService,
    private anneeService: AnneeScolaireService,
    private fb: FormBuilder,
    private router: Router,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    
  ) {

    // Initialisation du formulaire
    this.emargementForm = this.fb.group({
      matiere_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      titre_cours: ['', Validators.required],
      date_heure: ['', Validators.required],
      semestre: ['', Validators.required],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });
  }

  ngOnInit() {

    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
  
      const anneeActuelle = this.anneeService.getAnneeActuelle();
      if (anneeActuelle) {
        this.anneeScolaireId = anneeActuelle;
      } else if (annees.length > 0) {
        this.anneeScolaireId = annees[0].id; // Définit la première année comme par défaut
        this.anneeService.setAnneeActuelle(this.anneeScolaireId); // Sauvegarde dans localStorage
      } else {
        console.warn("Aucune année scolaire disponible.");
      }
    });

    const anneeActuelleId = this.anneeService.getAnneeActuelle();
    if (anneeActuelleId) {
      this.anneeService.getAnneesScolaires().subscribe((annees) => {
        const anneeActuelle = annees.find(a => a.id === anneeActuelleId);
        if (anneeActuelle) {
          this.anneeScolaireLibelle = anneeActuelle.libelle; // Affiche l'année actuelle
          this.emargementForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    this.anneeSelectionnee = this.anneeService.getAnneeActuelle()?.toString() || '';
     console.log("Année scolaire actuelle :", this.anneeSelectionnee);
   
     // Assurer la mise à jour du champ `annee_scolaire_id`
     if (this.anneeSelectionnee) {
       this.emargementForm.patchValue({
         annee_scolaire_id: this.anneeSelectionnee
       });
     }

     this.chargerDonnees();
  }

     chargerDonnees(): void {
      this.classeService.getClasses().subscribe(data =>{
        this.classes = data;
        }
      );
  
      this.matiereService.getMatieres().subscribe(data => {
        this.matieres = data;
      });
  
      this.enseignantService.getEnseignants().subscribe(data => {
        this.enseignants = data;
      });
    }
  
    ajouterEmargement(): void {
      this.emargementService.ajouterEmargement(this.emargementForm.value).subscribe(
        response => {
          console.log('Emargement ajouté avec succès', response);
          this.emargementForm.reset(); // Réinitialiser le formulaire après ajout
        },
        error => {
          console.error('Erreur lors de l\'ajout de l\'absence', error);
        }
      );
    }

}
