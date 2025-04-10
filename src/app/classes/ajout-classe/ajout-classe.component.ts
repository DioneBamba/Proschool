import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-ajout-classe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './ajout-classe.component.html',
  styleUrl: './ajout-classe.component.css'
})
export class AjoutClasseComponent implements OnInit{

  classeForm!: FormGroup;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private anneeService: AnneeScolaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
     // Charger les années scolaires et définir l'année actuelle
     this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelleId = this.anneeService.getAnneeActuelle();

      if (anneeActuelleId) {
        this.anneeScolaireId = anneeActuelleId;
        this.classeForm.patchValue({ annee_scolaire_id: anneeActuelleId });

        const anneeActuelle = annees.find(a => a.id === anneeActuelleId);
        if (anneeActuelle) {
          this.anneeScolaireLibelle = anneeActuelle.libelle;
        }
      } else if (annees.length > 0) {
        // Si aucune année n'est sélectionnée, choisir la première disponible
        this.anneeScolaireId = annees[0].id;
        this.classeForm.patchValue({ annee_scolaire_id: this.anneeScolaireId });
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      } else {
        console.warn("Aucune année scolaire disponible.");
      }
    });
    
    this.classeForm = this.fb.group({
      nom_classe: ['', Validators.required],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });

    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
    });
  }

  ajouterClasse(): void {
    if (this.classeForm.valid) {
      this.classeService.ajouterClasse(this.classeForm.value).subscribe(() => {
        alert('Classe ajoutée avec succès');
        this.router.navigate(['/classes']);
      });
    }
  }

  annuler(): void {
    this.router.navigate(['/classes']);
  }

}

