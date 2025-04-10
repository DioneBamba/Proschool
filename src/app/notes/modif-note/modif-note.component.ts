import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { CommonModule } from '@angular/common';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { ClasseService } from '../../services/classe.service';
import { EleveService } from '../../services/eleve.service';
import { EnseignantService } from '../../services/enseignant.service';
import { MatiereService } from '../../services/matiere.service';


@Component({
  selector: 'app-modif-note',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './modif-note.component.html',
  styleUrl: './modif-note.component.css'
})
export class ModifNoteComponent implements OnInit {
  noteForm!: FormGroup;
  eleves: any[] = [];
  idEleve!: number;
  matieres: any[] = [];
  classes: any[] = [];
  enseignants: any[] = [];
  noteId!: number;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router,
    private anneeService: AnneeScolaireService,
    private eleveService: EleveService,
    private classeService: ClasseService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    this.noteId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Emargement ID:', this.noteId);

    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;

    this.noteId = Number(this.route.snapshot.paramMap.get('id'));
    this.noteForm = this.fb.group({
      eleve_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      semestre: ['', Validators.required],
      devoir1: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      devoir2: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      composition: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: ['', [Validators.required, Validators.min(1)]],
      annee_scolaire_id: [this.anneeScolaireId, Validators.required]
    });

    this.noteService.getNoteById(this.noteId).subscribe(data => this.noteForm.patchValue(data));
    this.eleveService.getEleves(this.idEleve).subscribe(data => this.eleves = data);
    this.matiereService.getMatieres().subscribe(data => this.matieres = data);
    this.classeService.getClasses().subscribe(data => this.classes = data);
    this.enseignantService.getEnseignants().subscribe(data => this.enseignants = data);

    this.anneeService.getAnneesScolaires().subscribe((data) => (this.anneesScolaires = data));
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

  modifierNote(): void {
    this.noteService.modifierNote(this.noteId, this.noteForm.value).subscribe({
      next: () => {
        alert('Note modifiée avec succès');
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        console.error('Erreur côté backend :', err);
        alert('Échec de la modification. Veuillez réessayer.');
      }
    });
  }
}
