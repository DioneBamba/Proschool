import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbsenceService } from '../../services/absence.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EleveService } from '../../services/eleve.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';

@Component({
  selector: 'app-modif-absence',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './modif-absence.component.html',
  styleUrl: './modif-absence.component.css'
})
export class ModifAbsenceComponent implements OnInit {
  eleves: any[] = [];
  idEleve!: number;
  matieres: any[] = [];
  enseignants: any[] = [];
  classes: any[] = [];
  absenceForm!: FormGroup;
  absenceId!: number;
  idAbsence: string | null = '';
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = ''; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eleveService: EleveService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
    
    private anneeService: AnneeScolaireService,
    private absenceService: AbsenceService
  ) {}

  ngOnInit(): void {
    // Récupération de l'ID depuis l'URL
    const idParam = this.route.snapshot.paramMap.get('id');
    this.absenceId = idParam ? Number(idParam): 0;

    // this.route.paramMap.subscribe(params => {
    //   this.absenceId = params.get('id'); // Assurez-vous que l'ID est bien converti en nombre
    //   if (this.absenceId) {
    //     this.chargerAbsence();
    //   }
    // });

    // Vérification si l'ID est bien récupéré
    // if (!this.absenceId || isNaN(this.absenceId)) {
    //   console.error("L'ID de l'absence est invalide :", idParam);
    //   return;
    // }
    console.log("ID de l'absence récupéré :", this.absenceId);

    // Initialisation du formulaire
    this.absenceForm = this.fb.group({
      jour: ['', Validators.required],
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
      date_absence: ['', Validators.required],
      eleve_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      justifie: ['Non', Validators.required],
      motif_justifie: [''],
      annee_scolaire_id: ['', Validators.required],
    });

    this.cacherMotif();

    this.getAnneesScolaires();
    this.anneeSelectionnee = this.anneeService.getAnneesScolaires()?.toString() || '';

    // Charger les données une seule fois
    this.chargerAbsence();

    // Gérer la validation dynamique du champ motif_justifie
    this.absenceForm.get('justifie')?.valueChanges.subscribe(value => {
      const motifControl = this.absenceForm.get('motif_justifie');
      if (value === 'Oui') {
        motifControl?.setValidators(Validators.required);
      } else {
        motifControl?.clearValidators();
        motifControl?.setValue('');  // 🔹 Vider le champ lorsque "Non" est sélectionné
      }
      motifControl?.updateValueAndValidity();
    });

    this.chargerDonnees();
  }

  chargerAbsence(): void {
    this.absenceService.getAbsenceById(Number(this.absenceId)).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération de l'absence :", error);
        return of(null);
      })
    ).subscribe(data => {
      if (!data) {
        console.error("Aucune donnée trouvée pour l'ID :", this.absenceId);
        return;
      }
      console.log("Données récupérées :", data);
  
      // Remplace les valeurs `null` par une chaîne vide pour éviter les erreurs
      Object.keys(data).forEach(key => {
        if (data[key] === null) data[key] = '';  
      });
  
      this.absenceForm.patchValue(data);
      this.absenceForm.updateValueAndValidity();
    });
  }

  cacherMotif() {
    this.absenceService.getAbsenceById(this.absenceId).subscribe(
      data => {
        if (!data) {
          console.error("❌ Aucune donnée trouvée pour l'ID :", this.absenceId);
        } else {
          console.log("✅ Données récupérées :", data);
          this.absenceForm.patchValue(data);
        }
      },
      error => {
        console.error("⚠️ Erreur API :", error);
      }
    );
  }

  getAnneesScolaires() {
    this.anneeService.getAnneesScolaires().subscribe(annees => {
      this.anneesScolaires = annees;
    });
  }

  chargerDonnees(): void {
    this.eleveService.getEleves(this.idEleve).subscribe(data => this.eleves = data);
    this.matiereService.getMatieres().subscribe(data => this.matieres = data);
    this.enseignantService.getEnseignants().subscribe(data => this.enseignants = data);
    this.classeService.getClasses().subscribe(data => this.classes = data);
  }

  // modifierAbsence(): void {
  //   console.log(this.absenceForm.value);
  //   console.log(this.absenceForm.valid);
  //   console.log(this.absenceForm.controls);
  //   if (this.absenceForm.invalid) {
  //     alert('Veuillez remplir tous les champs obligatoires.');
  //     return;
  //   }

  //   const absenceData = { id: this.absenceId, ...this.absenceForm.value };

  //   this.absenceService.modifierAbsence(this.absenceId, absenceData).subscribe(
  //     response => {
  //       alert('Absence modifiée avec succès !');
  //       this.router.navigate(['/absences']);
  //     },
  //     error => {
  //       console.error('Erreur lors de la modification:', error);
  //     }
  //   );
  // }

  modifierAbsence(): void {
    console.log(this.absenceForm.value);
    if (this.absenceForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const absenceData = { id: this.absenceId, ...this.absenceForm.value };
    console.log(absenceData); // Vérification des données envoyées
    
    this.absenceService.modifierAbsence(Number(this.absenceId), absenceData).subscribe(
      (response: any) => {
        console.log('Réponse de la modification:', response);
        alert('Absence modifiée avec succès !');
        this.router.navigate(['/absences']);
      },
      (error: any) => {
        console.error('Erreur lors de la modification:', error);
      }
    );
  }

  annulerModification(): void {
    this.router.navigate(['/absences']);
  }
}

