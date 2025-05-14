import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-modif-classe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './modif-classe.component.html',
  styleUrl: './modif-classe.component.css'
})
export class ModifClasseComponent implements OnInit {
  classeForm!: FormGroup;
  anneesScolaires: any[] = [];
  classeId!: number;
  anneeScolaireId!: number;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private route: ActivatedRoute,
    private router: Router,
    private anneeService: AnneeScolaireService
  ) {}

  ngOnInit(): void {
    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;
    
    this.classeId = this.route.snapshot.params['id'];
    this.classeForm = this.fb.group({
      nom_classe: ['', Validators.required],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });

    this.classeService.getClasseById(this.classeId).subscribe(classe => {
      this.classeForm.patchValue(classe);
    });
  }

  modifierClasse(): void {
    if (this.classeForm.valid) {
      this.classeService.modifierClasse({ id: this.classeId, ...this.classeForm.value }).subscribe(() => {
        alert('Classe modifiée avec succès');
        this.router.navigate(['/classes']);
      });
    }
  }

  annuler(): void {
    this.router.navigate(['/classes']);
  }
}



