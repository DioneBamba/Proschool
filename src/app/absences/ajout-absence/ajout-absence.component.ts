import { Component, OnInit } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EleveService } from '../../services/eleve.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';

@Component({
  selector: 'app-ajout-absence',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './ajout-absence.component.html',
  styleUrl: './ajout-absence.component.css'
})
export class AjoutAbsenceComponent implements OnInit {
  absenceForm!: FormGroup;
  matieres: any[] = [];
  enseignants: any[] = [];
  classes: any[] = [];
  eleves: any[] = [];
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  anneeScolaireId!: number;
  idEleve!: number;
  anneeScolaireLibelle!: string;
  

  constructor(
    private absenceService: AbsenceService,
    private anneeService: AnneeScolaireService,
    private fb: FormBuilder,
    private router: Router,
    private classeService: ClasseService,
    private eleveService: EleveService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    
  ) {

    // Initialisation du formulaire
    this.absenceForm = this.fb.group({
      eleve_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      jour: ['', Validators.required],
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
      date_absence: ['', Validators.required],
      justifie: ['', Validators.required],
      motif_justifie: [''],
      annee_scolaire_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chargerDonnees();

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
          this.absenceForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    // Récupération des enseignants
    this.enseignantService.getEnseignants().subscribe(data => {
      this.enseignants = data;
    });



     // Récupération de l'année actuelle
     this.anneeSelectionnee = this.anneeService.getAnneeActuelle()?.toString() || '';
     console.log("Année scolaire actuelle :", this.anneeSelectionnee);
   
     // Assurer la mise à jour du champ `annee_scolaire_id`
     if (this.anneeSelectionnee) {
       this.absenceForm.patchValue({
         annee_scolaire_id: this.anneeSelectionnee
       });
     }


  }

  chargerDonnees(): void {
    this.eleveService.getEleves(this.idEleve).subscribe(data =>{
      this.eleves = data;
      }
    );

    this.matiereService.getMatieres().subscribe(data => {
      this.matieres = data;
    });

    this.classeService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }

  ajouterAbsence(): void {
    this.absenceService.ajouterAbsence(this.absenceForm.value).subscribe(
      response => {
        console.log('Abasence ajouté avec succès', response);
        this.absenceForm.reset(); // Réinitialiser le formulaire après ajout
      },
      error => {
        console.error('Erreur lors de l\'ajout de l\'absence', error);
      }
    );
  }
  
  trackByIdClasse(index: number, classe: any): number {
    return classe.id; // Assure-toi que chaque classe a un `id` unique
  }
  trackByIdEleve(index: number, eleve: any): number {
    return eleve.id; // Assure-toi que chaque eleve a un `id` unique
  }
  trackByIdMatiere(index: number, matiere: any): number {
    return matiere.id; // Assure-toi que chaque matiere a un `id` unique
  }
  trackByIdEnseignant(index: number, enseignant: any): number {
    return enseignant.id; // Assure-toi que chaque eleve a un `id` unique
  }

  
}

