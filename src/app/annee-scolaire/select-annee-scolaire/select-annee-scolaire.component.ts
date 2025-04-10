import { Component, OnInit } from '@angular/core';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-annee-scolaire',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './select-annee-scolaire.component.html',
  styleUrl: './select-annee-scolaire.component.css'
})
export class SelectAnneeScolaireComponent implements OnInit {
  anneesScolaires: any[] = [];
  anneeSelectionnee: number = 1;

  constructor(private anneeService: AnneeScolaireService) {}

  ngOnInit(): void {
    this.getAnneesScolaires();
    this.anneeSelectionnee = Number(localStorage.getItem('anneeScolaireId')) || 1;
  }

  getAnneesScolaires(): void {
    this.anneeService.getAnneesScolaires().subscribe(data => {
      this.anneesScolaires = data;
    });
  }

  setSelectedAnnee(event: Event): void {
    const target = event.target as HTMLSelectElement; // Convertir EventTarget en HTMLSelectElement
    const anneeId = parseInt(target.value, 10); // Obtenir la valeur sélectionnée
    this.anneeService.setAnneeActuelle(anneeId); // Définir dans le localStorage
    console.log('Année scolaire sélectionnée :', anneeId);
    
  }

  changerAnnee(): void {
    localStorage.setItem('anneeScolaireId', this.anneeSelectionnee.toString());
    window.location.reload();
  }
}

