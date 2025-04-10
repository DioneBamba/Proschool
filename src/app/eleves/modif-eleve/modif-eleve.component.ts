import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { EleveService } from '../../services/eleve.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-modif-eleve',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './modif-eleve.component.html',
  styleUrl: './modif-eleve.component.css'
})
export class ModifEleveComponent implements OnInit {
  
  eleveForm: FormGroup;
  classes: any[] = [];
  eleveId!: number;
  oldEleveData: any;
  idEleve: string | null = '';
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  
  constructor(
    private fb: FormBuilder,
    private eleveService: EleveService,
    private classeService: ClasseService,
    private route: ActivatedRoute,
    private router: Router,
    private anneeService: AnneeScolaireService
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
    this.eleveForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      classe_id: ['', Validators.required],
      groupe: ['', Validators.required],
      nationalite: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      sexe: ['', Validators.required],
      annee_scolaire_id: ['', Validators.required],
    });
    this.route.paramMap.subscribe(params => {
      this.idEleve = params.get('id'); // Assurez-vous que l'ID est bien converti en nombre
      if (this.idEleve) {
        this.chargerEleve();
      }
    });

    this.getAnneesScolaires();
    this.anneeSelectionnee = this.anneeService.getAnneesScolaires()?.toString() || '';

    this.getClasses(); // Pour charger les classes au démarrage
  }

  chargerEleve() {
    if (this.idEleve) {
      this.eleveService.getEleves(Number(this.idEleve)).subscribe(eleves => {
        const eleve = eleves.find(e => e.id === Number(this.idEleve));
        if (eleve) {
          // Patch des valeurs dans le formulaire
          this.eleveForm.patchValue({
            prenom: eleve.prenom,
            nom: eleve.nom,
            date_naissance: eleve.date_naissance,
            classe_id: eleve.classe_id,
            groupe: eleve.groupe,
            nationalite: eleve.nationalite,
            adresse: eleve.adresse,
            telephone: eleve.telephone,
            sexe: eleve.sexe,
            annee_scolaire_id: eleve.annee_scolaire_id,
            // montant_paye: eleve.montant_paye,
          });
          console.log(this.eleveForm.value);
        } else {
          console.log('Élève non trouvé');
        }
      });
    }
/*
    this.eleveService.getEleveById(Number(this.idEleve)).subscribe(eleve => {
      if (eleve) {
        this.eleveForm.patchValue({
          prenom: eleve.prenom,
            nom: eleve.nom,
            date_naissance: eleve.date_naissance,
            classe_id: eleve.classe_id,
            groupe: eleve.groupe,
            nationalite: eleve.nationalite,
            adresse: eleve.adresse,
            telephone: eleve.telephone,
            sexe: eleve.sexe,
            annee_scolaire_id: eleve.annee_scolaire_id
        }); // Charge les données directement dans le formulaire
      } else {
        console.log('Élève non trouvé');
      }
    });
*/
  }
  
  
  getElevesById(id: string) {
    this.eleveService.getEleves(Number(this.idEleve)).subscribe(eleve => {
      if (eleve) {
        this.eleveForm.patchValue(eleve);
      }
    });
  }
  


  getEleveDetails() {
    console.log('Récupération des détails de l\'élève avec ID:', this.eleveId);
  
    this.eleveService.getEleveById(this.eleveId).subscribe(
      data => {
        console.log('Données de l\'élève récupérées:', data);
        if (data) {
          this.oldEleveData = data;
          this.eleveForm.patchValue(data);
        } else {
          console.warn('Aucune donnée trouvée pour cet ID');
        }
      },
      error => {
        console.error('Erreur lors de la récupération des détails de l\'élève:', error);
      }
    );
  }
  

  getClasses() {
    this.classeService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }

  getAnneesScolaires() {
    this.anneeService.getAnneesScolaires().subscribe(annees => {
      this.anneesScolaires = annees;
    });
  }


  modifierEleve() {
    // if (this.eleveForm.valid && this.idEleve) {
    //   this.eleveService.modifierEleve(Number(this.idEleve), this.eleveForm.value).subscribe(response => {
    //     alert('Voulez-vous modifié ces informations!');
    //     alert('Élève modifié avec succès !');
    //   });
    // } else {
    //   console.error("Formulaire invalide :", this.eleveForm.errors);
    // }

    if (this.eleveForm.valid && this.idEleve) {
      this.eleveService.modifierEleve(Number(this.idEleve), this.eleveForm.value).subscribe(response => {
        alert('Élève modifié avec succès !');
        this.router.navigate(['/eleves']);
      });
    }
    if (!this.eleveForm.valid) {
      console.error("Formulaire invalide :", this.eleveForm.errors);
    }
  }

  onSubmit() {
    if (this.eleveForm.valid && this.idEleve) {
      console.log('Tentative de modification de l\'élève...');
      console.log('ID de l\'élève:', this.idEleve);
      console.log('Données du formulaire:', this.eleveForm.value);
  
      this.eleveService.modifierEleve(Number(this.idEleve), this.eleveForm.value).subscribe(response => {
        alert('Voulez-vous modifié ces informations!');
        alert('Élève modifié avec succès !');
        this.router.navigate(['/eleves']);
      });
    } else {
      console.log('Formulaire invalide :', this.eleveForm.errors); // Afficher les erreurs globales
      for (const controlName in this.eleveForm.controls) {
        const control = this.eleveForm.get(controlName);
        if (control && control.invalid) {
          console.log(`${controlName} is invalid:`, control.errors); // Afficher les erreurs spécifiques par champ
        }
      }
    }
  }

  

  trackById(index: number, item: any): number {
    return item.id;
  }
}
  


