import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ScolariteService } from '../../services/scolarite.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EleveService } from '../../services/eleve.service';
import { ClasseService } from '../../services/classe.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';



@Component({
  selector: 'app-modif-scolarite',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './modif-scolarite.component.html',
  styleUrl: './modif-scolarite.component.css'
})
export class ModifScolariteComponent implements OnInit {
  // @Input() scolariteData: any; // Ajout du décorateur Input
  scolariteForm: FormGroup;
  eleves: any[] = [];
  idEleve!: number;
  classes: any[] = [];
  isSubmitting = false;
  scolariteId: number | null = null;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  

  constructor(
    private scolariteService: ScolariteService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private eleveService: EleveService,
    private classeService: ClasseService,
    private anneeService: AnneeScolaireService
  ) {
    this.scolariteForm = this.fb.group({
      eleve_id: ['', Validators.required],
      date_naissance: [{ value: '', disabled: true }, Validators.required],
      sexe: [{ value: '', disabled: true }, Validators.required],
      classe_id: [{ value: '', disabled: true }, Validators.required],
      cout_scolarite: ['', [Validators.required, Validators.min(1)]],
      montant_paye: ['', [Validators.required, Validators.min(0)]],
      reste_a_payer: [{ value: '', disabled: true }],
      etat_scolarite: [{ value: '', disabled: true }],
      date_paiement: [{ value: '', disabled: true }],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });
    
  }

  ngOnInit(): void {
    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;

    // Récupération de l'ID de la scolarité depuis l'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.scolariteId = Number(id);

        this.chargerScolarite(this.scolariteId);
      } else {
        console.error('ID de scolarité introuvable dans l\'URL');
      }
    });
    
     
  

    // Surveiller les changements pour recalculer automatiquement le reste à payer
    this.scolariteForm.get('cout_scolarite')?.valueChanges.subscribe(() => this.calculerReste());
    this.scolariteForm.get('montant_paye')?.valueChanges.subscribe(() => this.calculerReste());


    // this.scolariteForm.get('eleve_id')?.valueChanges.subscribe(eleveId => {
    //   console.log("Élève sélectionné ID:", eleveId);
    //   const eleveSelectionne = this.eleves.find(e => e.id == eleveId); // Vérifie que l'ID correspond
    //   console.log("Élève sélectionné :", eleveSelectionne);
    //   if (eleveSelectionne) {
    //     this.scolariteForm.patchValue({
    //       date_naissance: eleveSelectionne.date_naissance || '',
    //       sexe: eleveSelectionne.sexe || '',
    //       classe_id: eleveSelectionne.classe_id || ''
    //     });
    //   }
    // });

  }

  // Charger les informations de la scolarité existante
  // chargerScolarite(id: number): void {
  //   this.eleveService.getEleves(this.idEleve).subscribe(data => {
  //     this.eleves = data;
  //   });

  //   this.classeService.getClasses().subscribe(data => {
  //     this.classes = data;
  //   });

  //   this.scolariteService.getScolariteById(id).subscribe(scolarite => {
  //     if (scolarite) {
  //       console.log('Données reçues :', scolarite);
  //       this.scolariteForm.patchValue({
  //         eleve_id: scolarite.eleve_id,
  //         date_naissance: scolarite.date_naissance,
  //         sexe: scolarite.sexe,
  //         classe_id: scolarite.classe_id,
  //         cout_scolarite: scolarite.cout_scolarite,
  //         montant_paye: scolarite.montant_paye,
  //         reste_a_payer: scolarite.reste_a_payer,
  //         etat_scolarite: scolarite.etat_scolarite,
  //         date_paiement: scolarite.date_paiement

  //       });
  //     } else {
  //       console.error('Aucune donnée de scolarité trouvée pour cet ID');
  //     }
  //   }, error => {
  //     console.error('Erreur de récupération des données :', error);
  //   });
  // }

  chargerScolarite(id: number): void {
    this.scolariteService.getScolariteById(id).subscribe({
      next: (data) => {
        console.log("Données de scolarité récupérées :", data);
        if (data) {
          this.scolariteForm.patchValue({
            eleve_id: data.eleve_id,
            cout_scolarite: data.cout_scolarite,
            montant_paye: data.montant_paye,
            reste_a_payer: data.reste_a_payer,
            etat_scolarite: data.etat_scolarite,
            date_paiement: data.date_paiement,
            annee_scolaire_id: data.annee_scolaire_id,
            classe_id: data.classe_id
          });
  
          // Récupérer l'élève et mettre à jour les champs date_naissance et sexe
          this.eleveService.getEleves(this.idEleve).subscribe(eleves => {
            this.eleves = eleves;
            const eleveSelectionne = eleves.find(e => e.id == data.eleve_id);
            console.log("Élève trouvé :", eleveSelectionne);
            if (eleveSelectionne) {
              this.scolariteForm.patchValue({
                date_naissance: eleveSelectionne.date_naissance,
                sexe: eleveSelectionne.sexe,
                classe_id: eleveSelectionne.classe_id
              });
            }
          });
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement de la scolarité", err);
      }
    });
  }


  getNomClasse(): string {
    console.log('Liste des classes :', this.classes);

    const classeId = this.scolariteForm.value.classe_id; // ID de la classe lié à l'élève sélectionné
    console.log('Classe ID dans le formulaire :', classeId); // Vérifiez l'ID récupéré
    const classe = this.classes.find(c => c.id === classeId); // Recherche dans la liste des classes
    console.log('Classe trouvée :', classe); // Vérifiez si la classe est trouvée
    return classe ? classe.nom_classe : ''; // Retourne le nom ou une chaîne vide si non trouvé
  }

  calculerReste(): void {
    const cout = this.scolariteForm.value.cout_scolarite || 0;
    const paye = this.scolariteForm.value.montant_paye || 0;
    const reste = Math.max(cout - paye, 0);

    this.scolariteForm.patchValue({
      reste_a_payer: reste,
      etat_scolarite: reste === 0 ? 'payé' : paye > 0 ? 'partiellement payé' : 'non payé'
    });

    // Désactiver `montant_paye` si `cout_scolarite` n'est pas défini
    if (cout === 0) {
      this.scolariteForm.get('montant_paye')?.disable();
    } else {
      this.scolariteForm.get('montant_paye')?.enable();
    }
  }

  modifierScolarite(): void {
    if (this.scolariteForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.scolariteForm.patchValue({ date_paiement: new Date().toISOString().split('T')[0] });

    // Activer les champs désactivés avant l'envoi
    Object.keys(this.scolariteForm.controls).forEach(field => {
      this.scolariteForm.get(field)?.enable();
    });

    if (this.scolariteId !== null) {
      this.scolariteService.modifierScolarite(this.scolariteId, this.scolariteForm.value).subscribe({
        next: () => {
          console.log("Données envoyées :", this.scolariteForm.value);
          console.log('Scolarité modifiée avec succès');
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Erreur lors de la modification de la scolarité', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}