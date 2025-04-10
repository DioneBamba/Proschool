import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScolariteService } from '../../services/scolarite.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { EleveService } from '../../services/eleve.service';
import { ClasseService } from '../../services/classe.service';


@Component({
  selector: 'app-ajout-scolarite',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './ajout-scolarite.component.html',
  styleUrl: './ajout-scolarite.component.css'
})
export class AjoutScolariteComponent implements OnInit {
  scolariteForm: FormGroup;
  eleves: any[] = [];
  classes: any[] = [];
  idEleves!: number;
  isSubmitting = false;  // Ajoute une variable pour empêcher le double envoi
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private scolariteService: ScolariteService, 
    private fb: FormBuilder,
    private anneeService: AnneeScolaireService,
    private eleveService: EleveService,
    private classeService: ClasseService
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
      date_paiement: [{ value: '', disabled: true }],  // Date de paiement (automatique)
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });
  }

  ngOnInit(): void {
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
          this.scolariteForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    this.anneeSelectionnee = this.anneeService.getAnneeActuelle()?.toString() || '';
     console.log("Année scolaire actuelle :", this.anneeSelectionnee);
   
     // Assurer la mise à jour du champ `annee_scolaire_id`
     if (this.anneeSelectionnee) {
       this.scolariteForm.patchValue({
         annee_scolaire_id: this.anneeSelectionnee
       });
     }

    // Chargement des élèves
    this.eleveService.getEleves(this.idEleves).subscribe(data => {
      console.log(data);  // Vérifiez la structure des données ici
      this.eleves = data;
    });

    this.classeService.getClasses().subscribe(data => {
      console.log(data);  // Vérifiez la structure des données ici
      this.classes = data;
    });
  }
  // Fonction de mise à jour des informations liées à l'élève sélectionné
  onEleveChange(): void {
    const eleveId = Number(this.scolariteForm.value.eleve_id);
    console.log('Élève sélectionné ID:', eleveId);

    const selectedEleve = this.eleves.find(eleve => eleve.id === eleveId);

    console.log('Données de l’élève sélectionné:', selectedEleve);
    console.log('Classe ID lié à l’élève sélectionné :', selectedEleve.classe_id);


    if (selectedEleve) {
      this.scolariteForm.patchValue({
        date_naissance: selectedEleve.date_naissance,
        sexe: selectedEleve.sexe,
        classe_id: selectedEleve.classe_id
      });

      // Activer les champs si nécessaire
      this.scolariteForm.get('date_naissance')?.enable();
      this.scolariteForm.get('sexe')?.enable();
      this.scolariteForm.get('classe_id')?.enable();

      this.scolariteForm.markAllAsTouched();
      this.scolariteForm.updateValueAndValidity()
    }
  }

  getNomClasse(): string {
    console.log('Liste des classes :', this.classes);

    const classeId = this.scolariteForm.value.classe_id; // ID de la classe lié à l'élève sélectionné
    console.log('Classe ID dans le formulaire :', classeId); // Vérifiez l'ID récupéré
    const classe = this.classes.find(c => c.id === classeId); // Recherche dans la liste des classes
    console.log('Classe trouvée :', classe); // Vérifiez si la classe est trouvée
    return classe ? classe.nom_classe : ''; // Retourne le nom ou une chaîne vide si non trouvé
  }
  

  // Calculer le reste à payer et l'état de la scolarité
  calculerReste(): void {
    const cout = this.scolariteForm.value.cout_scolarite || 0;
    const paye = this.scolariteForm.value.montant_paye || 0;
    const reste = cout - paye;
    this.scolariteForm.patchValue({ reste_a_payer: reste });
    if (reste === 0) {
      this.scolariteForm.patchValue({ etat_scolarite: 'payé' });
    } else if (paye > 0) {
      this.scolariteForm.patchValue({ etat_scolarite: 'partiellement payé' });
    } else {
      this.scolariteForm.patchValue({ etat_scolarite: 'non payé' });
    }

    this.scolariteForm.markAllAsTouched();
    this.scolariteForm.updateValueAndValidity()
  }

  // Mettre à jour la date de paiement lors de la soumission
  ajouterScolarite(): void {
    console.log('Statut du formulaire:', this.scolariteForm.valid);
    console.log('Valeurs du formulaire:', this.scolariteForm.value);

    if (this.scolariteForm.invalid || this.isSubmitting) {
      // Si le formulaire est invalide, on l'empêche de soumettre et on montre les erreurs
      console.log("Formulaire invalide", this.scolariteForm.errors);
      return;
    }

    this.isSubmitting = true;  // Bloque l'envoi multiple
    const datePaiement = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    this.scolariteForm.patchValue({ date_paiement: datePaiement });

    Object.keys(this.scolariteForm.controls).forEach(field => {
      this.scolariteForm.get(field)?.enable();
    });
  
    console.log('✅ Données envoyées:', this.scolariteForm.value);

    this.scolariteService.ajouterScolarite(this.scolariteForm.value).subscribe({
      next: () => {
        console.log('Scolarité ajoutée avec succès');
        this.scolariteForm.reset();
        this.isSubmitting = false; // Réactive le bouton après réussite
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la scolarité', err);
        this.isSubmitting = false; // Réactive le bouton même en cas d'erreur
      }
    });
  }
}


