import { Component, OnInit } from '@angular/core';
// import { constructor } from 'jasmine';
import { EleveService } from '../../services/eleve.service';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ElevesComponent } from "../eleves.component";
import { RouterLink } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-ajout-eleve',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
],
  templateUrl: './ajout-eleve.component.html',
  styleUrl: './ajout-eleve.component.css'
})
export class AjoutEleveComponent implements OnInit {

  eleveForm: FormGroup;
  classes: any[] = [];
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private fb: FormBuilder, 
    private eleveService: EleveService,
    private classeService: ClasseService,
    private anneeService: AnneeScolaireService,
    private cdRef: ChangeDetectorRef
  ) {

    this.eleveForm = this.fb.group({
      prenom: [''],
      nom: [''],
      date_naissance: [''],
      classe_id: [''],
      groupe: [''],
      nationalite: [''],
      adresse: [''],
      telephone: [''],
      sexe: [''],
      annee_scolaire_id: [''],
      // montant_paye: ['']
    });
  }

  ngOnInit(): void {
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
          this.eleveForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }



    // Récupération des classes
    this.classeService.getClasses().subscribe(
      (data: any[] | null) => {
        console.log("Données des classes récupérées :", data);
        this.classes = Array.isArray(data) ? data : [];
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des classes", error);
        this.classes = [];
      }
    );
  
    // Récupération de l'année actuelle
    this.anneeSelectionnee = this.anneeService.getAnneeActuelle()?.toString() || '';
    console.log("Année scolaire actuelle :", this.anneeSelectionnee);
  
    // Assurer la mise à jour du champ `annee_scolaire_id`
    if (this.anneeSelectionnee) {
      this.eleveForm.patchValue({
        annee_scolaire_id: this.anneeSelectionnee
      });
    }
  
    this.getAnneesScolaires();
  }
      

  getAnneesScolaires() {
    this.anneeService.getAnneesScolaires().subscribe(data => {
      this.anneesScolaires = data;
    });
  }

  onSubmit() {
    this.eleveService.ajouterEleve(this.eleveForm.value).subscribe(
      response => {
        console.log('Élève ajouté avec succès', response);
        this.eleveForm.reset(); // Réinitialiser le formulaire après ajout
      },
      error => {
        console.error('Erreur lors de l\'ajout de l\'élève', error);
      }
    );
  }

  onChangeAnnee(annee: string) {
    this.anneeSelectionnee = annee;
    this.getAnneesScolaires(); // Recharge les données avec la nouvelle année
    // this.anneeService.getAnneeActuelle(parseInt(annee, 10)); // Sauvegarde localement:
    this.anneeService.getAnneeActuelle(); // Sauvegarde localement:
  }

  trackById(index: number, classe: any): number {
    return classe.id; // Assure-toi que chaque classe a un `id` unique
  }

}



