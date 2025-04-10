import { Component, OnInit } from '@angular/core';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EleveService } from '../services/eleve.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        RouterModule
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {
  notes: any[] = [];
  notesFiltrees: any[] = [];

  notesRegroupees: any[] = [];
  selectedEleve: any = null; 
  listeEleves: any[] = [];
  idEleve!: number;


  constructor(
    private noteService: NoteService, 
    private route : ActivatedRoute, 
    private router: Router, 
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.chargerNotes();
    this.chargerEleves();
  }

  onEleveChange() {
    if (!this.selectedEleve) {
      console.warn("Aucun élève sélectionné !");
      return;
    }
    
    this.selectedEleve = Number(this.selectedEleve); // Convertir en nombre
    console.log("Élève sélectionné:", this.selectedEleve);

    this.afficherNotesRegroupees();
  }

  chargerNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        console.log("Notes récupérées", data); // Afficher les notes pour vérification
        this.notes = data;
        console.log("Toutes les notes récupérées :", this.notes);

         // Vérification des clés de chaque note
        this.notes.forEach((note, index) => {
          console.log(`Note ${index + 1}:`, note);
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des notes:', err);
        alert('Erreur de récupération des notes : ' + err.message); // Affiche une alerte en cas d'erreur
      }
    });
  }

  chargerEleves(): void {
    this.eleveService.getEleves(this.idEleve).subscribe({
      next: (data) => {
        this.listeEleves = data;
        console.log("Élèves récupérés:", this.listeEleves);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des élèves:", err);
      }
    });
  }



  getElevesAvecNotes(): any[] {
    console.log("Liste des élèves:", this.listeEleves);
    console.log("Liste des notes:", this.notes);
  
    return this.listeEleves.filter((eleve: any) => {
      const eleveAvecNote = this.notes.some(note => {
        console.log(`Comparaison : note.eleve_id = ${note.eleve_id}, eleve.id = ${eleve.id}`);
        return Number(note.eleve_id) === Number(eleve.id);
      });
      return eleveAvecNote;
    });
  }

  filtrerNotes(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input) return; // Vérification pour éviter les erreurs

    const valeur = input.value.toLowerCase(); // Récupérer la valeur et la convertir en minuscule
    console.log(valeur); // Debug

    this.notesFiltrees = this.notes.filter(note =>
      note.eleve_nom.toLowerCase().includes(valeur) ||
      note.nom_classe.toLowerCase().includes(valeur) ||
      note.matiere_nom.toLowerCase().includes(valeur)
    );
    // this.notesFiltrees = this.notes;
  }

  // filtrerParClasse(event: Event): void {
  //   const valeur = (event.target as HTMLInputElement).value.toLowerCase();
  //   this.notesFiltrees = this.notes.filter(note =>
  //     note.classe_nom.toLowerCase().includes(valeur)
  //   );
  // }

  naviguerVersBulletin() {
    if (!this.selectedEleve) {
      console.warn("Aucun élève sélectionné !");
      return;
    }
    this.router.navigate(['/bulletins', this.selectedEleve]);
  }

  supprimerNote(id: number): void {
    if (confirm('Voulez-vous supprimer cette note ?')) {
      this.noteService.supprimerNote(id).subscribe(() => {
        this.chargerNotes();
      });
    }
  }

  afficherNotesRegroupees() {
    this.notesRegroupees = this.groupNotesByStudent(this.notes);
    console.log("Bouton cliqué, affichage des notes pour:", this.selectedEleve);
    console.log("Notes avant filtrage:", this.notes);
    console.log("Élève sélectionné:", this.selectedEleve);

    if (!this.selectedEleve) {
      alert("Veuillez sélectionner un élève !");
      return;
    }

    console.log("Filtrage des notes pour l'élève:", this.selectedEleve);
    this.notesRegroupees = this.notes.filter(note => {
      console.log(`Comparaison: note.eleve_id=${note.eleve_id} avec selectedEleve=${this.selectedEleve}`);
      return Number(note.eleve_id) === Number(this.selectedEleve);
      console.log("Notes regroupées après filtrage:", this.notesRegroupees);
    });

    if (this.notesRegroupees.length === 0) {
      alert("Aucune note trouvée pour cet élève !");
      return;
    }
    console.log("Notes regroupées:", this.notesRegroupees);
  }

  groupNotesByStudent(notes: any[]): any[] {
    return notes.reduce((acc, note) => {
      let student = acc.find((s: any) => s.eleve === note.eleve && s.classe === note.classe && s.semestre === note.semestre);

      if (!student) {
        student = { eleve: note.eleve, classe: note.classe, semestre: note.semestre, matieres: [] };
        acc.push(student);
      }

      student.matieres.push({ 
        matiere: note.matiere, 
        Devoir1: note.Devoir1, 
        Devoir2: note.Devoir2, 
        Composition: note.Composition, 
        Coefficient: note.Coefficient 
      });

      return acc;
    }, []);
  }
}