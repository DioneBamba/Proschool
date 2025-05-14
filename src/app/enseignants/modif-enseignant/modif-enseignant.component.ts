import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnseignantService } from '../../services/enseignant.service';
import { Observable } from 'rxjs';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-modif-enseignant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    
  ],
  templateUrl: './modif-enseignant.component.html',
  styleUrl: './modif-enseignant.component.css'
})
export class ModifEnseignantComponent implements OnInit {
  enseignantForm!: FormGroup;
  anneesScolaires: any[] = [];
  enseignantId!: number;
  idEnseignant: string | null = '';
  anneeScolaireId!: number;

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private route: ActivatedRoute,
    private router: Router,
    private anneeService: AnneeScolaireService
  ) {}

  ngOnInit(): void {
    const annee = this.anneeService.getAnneeActuelle();
        this.anneeScolaireId = annee !== null ? annee : 0;
        
        this.enseignantId = this.route.snapshot.params['id'];
        this.enseignantForm = this.fb.group({
          prenom: ['', Validators.required],
          nom: ['', Validators.required],
          date_naissance: ['', Validators.required],
          lieu_naissance: ['', Validators.required],
          telephone: ['', Validators.required],
          profession: ['', Validators.required],
          annee_scolaire_id: [this.anneeScolaireId, Validators.required]
        });
    
        this.enseignantService.getEnseignantById(this.enseignantId).subscribe(enseignant => {
          this.enseignantForm.patchValue(enseignant);
        });
    
  }
   
  modifierEnseignant(): void {
    console.log('Données envoyées:', this.enseignantForm);
    console.log('ID Enseignant :', this.enseignantId);
    this.enseignantService.modifierEnseignant(Number(this.enseignantId), this.enseignantForm.value).subscribe(
      () => {
        console.log('Données envoyées :', this.enseignantForm.value);

        alert('Enseignant modifiée avec succès');
        this.router.navigate(['/enseignants']);
      },
      (error) => {
        console.error('Erreur lors de la modification', error);
      }
    );
  }

  annuler(): void {
    this.router.navigate(['/enseignants']);
  }

 
}



