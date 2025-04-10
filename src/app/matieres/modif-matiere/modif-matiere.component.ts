import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatiereService } from '../../services/matiere.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-modif-matiere',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modif-matiere.component.html',
  styleUrl: './modif-matiere.component.css'
})
export class ModifMatiereComponent implements OnInit {
  matiereForm!: FormGroup;
  anneesScolaires: any[] = [];
  matiereId!: number;
  anneeScolaireId!: number;

  constructor(
    private matiereService: MatiereService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private anneeService: AnneeScolaireService
  ) {}


  ngOnInit(): void {
    this.matiereId = this.route.snapshot.params['id'];

    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;
        
        
    this.matiereForm = this.fb.group({
      id: [this.matiereId], // Ajout de l'ID ici
      nom: ['', Validators.required],
      description: ['', Validators.required],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });

    this.matiereService.getMatiereById(this.matiereId).subscribe(matiere => {
      this.matiereForm.patchValue(matiere);
    });
  }



  modifierMatiere(): void {
    console.log('Données envoyées:', this.matiereForm);
    this.matiereService.modifierMatiere(this.matiereForm.value).subscribe(
      () => {
        alert('Matiere modifiée avec succès');
        this.router.navigate(['/matieres']);
      },
      (error) => {
        console.error('Erreur lors de la modification', error);
      }
    );
  }

  annuler(): void {
    this.router.navigate(['/matieres']);
  }
}