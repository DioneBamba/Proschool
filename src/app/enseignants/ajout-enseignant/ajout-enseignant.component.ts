import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EnseignantService } from '../../services/enseignant.service';
// import { AnneeScolaireComponent } from '../../annee-scolaire/annee-scolaire.component';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-ajout-enseignant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './ajout-enseignant.component.html',
  styleUrl: './ajout-enseignant.component.css'
})
export class AjoutEnseignantComponent implements OnInit{


  // enseignant: any = {};
  enseignantForm!: FormGroup;
  selectedFile!: File;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private enseignantService: EnseignantService,
    private router: Router,
    private fb: FormBuilder,
    private anneeService: AnneeScolaireService
  ) {
    this.enseignantForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      lieu_naissance: ['', Validators.required],
      telephone: ['', Validators.required],
      profession: ['', Validators.required],
      annee_scolaire_id: [null, Validators.required] // Initialisation à null par défaut
    });
  }

  ngOnInit() {
    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
  
      const anneeActuelle = this.anneeService.getAnneeActuelle();
      if (anneeActuelle) {
        this.anneeScolaireId = anneeActuelle;
        this.enseignantForm.patchValue({ annee_scolaire_id: anneeActuelle }); // Mise à jour du formulaire
      } else if (annees.length > 0) {
        this.anneeScolaireId = annees[0].id; // Définit la première année par défaut
        this.anneeService.setAnneeActuelle(this.anneeScolaireId); // Sauvegarde dans le service
        this.enseignantForm.patchValue({ annee_scolaire_id: this.anneeScolaireId });
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
          this.enseignantForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
    });
  }
  
  ajouterEnseignant(): void {
    if (this.enseignantForm.invalid) {
        console.log('Formulaire invalide', this.enseignantForm.value);
        return;
    }

    console.log('Données envoyées:', this.enseignantForm.value);
    console.log('Fichier:', this.selectedFile);

    this.enseignantService.ajouterEnseignant(this.enseignantForm.value)
        .subscribe((response) => {
            console.log('Réponse du backend:', response);
            alert('Enseignant enregistré avec succès');
            this.router.navigate(['/enseignants']);
        }, (error) => {
            console.error('Erreur lors de l\'ajout:', error);
        });
  }

}
