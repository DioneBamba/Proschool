import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatiereService } from '../../services/matiere.service';
import { CommonModule } from '@angular/common';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-ajout-matiere',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './ajout-matiere.component.html',
  styleUrl: './ajout-matiere.component.css'
})
export class AjoutMatiereComponent implements OnInit {

  matiereForm!: FormGroup;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;
  
  constructor(
    private fb: FormBuilder,
    private matiereService: MatiereService, 
    private router: Router,
    private anneeService: AnneeScolaireService,
  ) {}

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
          this.matiereForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    this.matiereForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });
    
    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
    });
  }
  
  ajouterMatiere(): void {
    this.matiereService.ajouterMatiere(this.matiereForm.value).subscribe(
    () => {
      alert('Classe ajoutée avec succès');
      this.router.navigate(['/matieres']);
    },
    (error) => {
      console.error('Erreur lors de l’ajout', error);
    }
    );
  }

  annuler(): void {
    this.router.navigate(['/classes']);
  }
}
