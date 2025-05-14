import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AbsenceService } from '../../services/absence.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';
import { EmargementService } from '../../services/emargement.service';

@Component({
  selector: 'app-modif-emargement',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './modif-emargement.component.html',
  styleUrl: './modif-emargement.component.css'
})
export class ModifEmargementComponent implements OnInit {
  emargementForm!: FormGroup;
  
  matieres: any[] = [];
  enseignants: any[] = [];
  classes: any[] = [];
  anneesScolaires: any[] = [];
  emargementId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private emargementService: EmargementService,
    private anneeService: AnneeScolaireService,
    private classeService: ClasseService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.emargementId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Emargement ID:', this.emargementId);

    this.emargementId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.ChargerDonnees();
    this.ChargerMetaDonnees();
  }

  initForm(): void {
    this.emargementForm = this.fb.group({
      annee_scolaire_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      titre_cours: ['', Validators.required],
      date_heure: ['', Validators.required],
      semestre: ['', Validators.required],
    });
  }

  ChargerDonnees(): void {
    this.emargementService.getEmargementById(this.emargementId).subscribe((data) => {
      this.emargementForm.patchValue(data);
    });
  }

  ChargerMetaDonnees(): void {
    this.anneeService.getAnneesScolaires().subscribe((data) => (this.anneesScolaires = data));
    this.matiereService.getMatieres().subscribe((data) => (this.matieres = data));
    this.classeService.getClasses().subscribe((data) => (this.classes = data));
    this.enseignantService.getEnseignants().subscribe((data) => (this.enseignants = data));
  }

  modifierEmargement(): void {
    if (this.emargementForm.valid) {
      const emargementData = {
        ...this.emargementForm.value,
        id: this.emargementId // Ensure the ID is included
      };
      console.log('Form data being sent:', emargementData);
      this.emargementService.modifierEmargement(emargementData).subscribe({
        next: () => {
          console.log('Émargement modifié avec succès');
          this.router.navigate(['/emargements']);
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
        },
      });
    }
  }
  
}