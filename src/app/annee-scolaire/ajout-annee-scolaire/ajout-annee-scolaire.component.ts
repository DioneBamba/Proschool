import { Component } from '@angular/core';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ajout-annee-scolaire',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule 
  ],
  templateUrl: './ajout-annee-scolaire.component.html',
  styleUrl: './ajout-annee-scolaire.component.css'
})
export class AjoutAnneeScolaireComponent {
  annee: string = '';
  

  constructor(private anneeService: AnneeScolaireService) {}

  ajouterAnneeScolaire(): void {
    this.anneeService.ajouterAnneeScolaire({ annee: this.annee }).subscribe(() => {
      alert('Année ajoutée');
      this.annee = '';
    });
  }
}


