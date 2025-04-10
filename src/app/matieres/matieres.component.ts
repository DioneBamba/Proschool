import { Component, OnInit } from '@angular/core';
import { MatiereService } from '../services/matiere.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './matieres.component.html',
  styleUrl: './matieres.component.css'
})
export class MatieresComponent implements OnInit {

  matieres: any[] = [];

  constructor(private matiereService: MatiereService, private router: Router) {}

  ngOnInit(): void {
    this.loadMatieres();
  }

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe(
      (data) => { this.matieres = data; },
      (error) => { console.error('Erreur lors du chargement des matieres', error); }
    );
  }

  ajouterMatiere(): void {
    this.router.navigate(['/ajout-matiere']);
  }

  modifierMatiere(matiere: any): void {
    this.router.navigate(['/modif-matiere', matiere.id]);
  }

  supprimerMatiere(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matiere ?')) {
      this.matiereService.supprimerMatiere(id).subscribe(
        () => {
          alert('Matiere supprimée avec succès');
          this.loadMatieres();
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}
