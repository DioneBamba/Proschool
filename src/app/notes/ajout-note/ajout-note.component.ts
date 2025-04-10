import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EleveService } from '../../services/eleve.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';

@Component({
  selector: 'app-ajout-note',
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './ajout-note.component.html',
  styleUrl: './ajout-note.component.css'
})
export class AjoutNoteComponent implements OnInit {
  noteForm!: FormGroup;
  eleves: any[] = [];
  matieres: any[] = [];
  classes: any[] = [];
  idEleve!: number;
  enseignants: any[] = [];
  anneesScolaires: any[] = [];
  anneeSelectionnee: string = '';  // Par défaut, vide ou récupérée du localStorage
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private anneeService: AnneeScolaireService,
    private eleveService: EleveService,
    private classeService: ClasseService,
    private matiereService: MatiereService,
    private enseignantService: EnseignantService,
  ) {}

  ngOnInit(): void {

    this.noteForm = this.fb.group({
      eleve_id: [null, Validators.required],
      matiere_id: [null, Validators.required],
      classe_id: [null, Validators.required],
      enseignant_id: [null, Validators.required],
      semestre: [null, Validators.required],
      devoir1: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      devoir2: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      composition: [null, [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: [null, [Validators.required, Validators.min(1)]],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });
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
          this.noteForm.patchValue({ annee_scolaire_id: anneeActuelleId });
        }
      });
    }

    this.anneeSelectionnee = this.anneeService.getAnneeActuelle()?.toString() || '';
     console.log("Année scolaire actuelle :", this.anneeSelectionnee);
   
     // Assurer la mise à jour du champ `annee_scolaire_id`
     if (this.anneeSelectionnee) {
       this.noteForm.patchValue({
         annee_scolaire_id: this.anneeSelectionnee
       });
     }


    this.eleveService.getEleves(this.idEleve).subscribe(data => this.eleves = data);
    this.matiereService.getMatieres().subscribe(data => this.matieres = data);
    this.classeService.getClasses().subscribe(data => this.classes = data);
    this.enseignantService.getEnseignants().subscribe(data => this.enseignants = data);
  }

  onEleveChange(): void {
    const eleveId = Number(this.noteForm.value.eleve_id);
    console.log('Élève sélectionné ID:', eleveId);

    const selectedEleve = this.eleves.find(eleve => eleve.id === eleveId);

    console.log('Données de l’élève sélectionné:', selectedEleve);
    console.log('Classe ID lié à l’élève sélectionné :', selectedEleve.classe_id);


    if (selectedEleve) {
      this.noteForm.patchValue({
        date_naissance: selectedEleve.date_naissance,
        sexe: selectedEleve.sexe,
        classe_id: selectedEleve.classe_id
      });

      // Activer les champs si nécessaire
      this.noteForm.get('date_naissance')?.enable();
      this.noteForm.get('sexe')?.enable();
      this.noteForm.get('classe_id')?.enable();
      this.noteForm.markAllAsTouched();
      this.noteForm.updateValueAndValidity()
    }
  }

  getNomClasse(): string {
    console.log('Liste des classes :', this.classes);

    const classeId = this.noteForm.value.classe_id; // ID de la classe lié à l'élève sélectionné
    console.log('Classe ID dans le formulaire :', classeId); // Vérifiez l'ID récupéré
    const classe = this.classes.find(c => c.id === classeId); // Recherche dans la liste des classes
    console.log('Classe trouvée :', classe); // Vérifiez si la classe est trouvée
    return classe ? classe.nom_classe : ''; // Retourne le nom ou une chaîne vide si non trouvé
  }
  

  ajouterNote(): void {
    if (this.noteForm.valid) {
      this.noteService.ajouterNote(this.noteForm.value).subscribe({
        next: () => {
          alert('Note ajoutée avec succès');
          this.router.navigate(['/notes']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de la note:', err);
          alert('Une erreur est survenue lors de l\'ajout de la note');
        }
      });
    }
  }
}