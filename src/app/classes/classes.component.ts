import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AnneeScolaireService } from '../services/annee-scolaire.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  anneeScolaireId!: number;

  constructor(private classeService: ClasseService, 
    private router: Router,
    private anneeService: AnneeScolaireService
  ) {}

  ngOnInit(): void {
    // this.anneeScolaireId = this.anneeService.getAnneeActuelle();
    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;
    this.loadClasses();
  }

  loadClasses(): void {
    // this.classeService.getClasses().subscribe(
    //   (data) => { this.classes = data; },
    //   (error) => { console.error('Erreur lors du chargement des classes', error); }
    // );

    this.classeService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }

  ajouterClasse(): void {
    this.router.navigate(['/ajout-classe']);
  }

  modifierClasse(classe: any): void {
    this.router.navigate(['/modif-classe', classe.id]);
  }

  supprimerClasse(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette classe ?')) {
      this.classeService.supprimerClasse(id).subscribe(
        () => {
          alert('Classe supprimée avec succès');
          this.loadClasses();
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}




