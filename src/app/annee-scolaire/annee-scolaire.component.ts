import { Component, OnInit } from '@angular/core';
// import { constructor } from 'jasmine';
import { CommonModule } from '@angular/common';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-annee-scolaire',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './annee-scolaire.component.html',
  styleUrl: './annee-scolaire.component.css'
})
export class AnneeScolaireComponent implements OnInit {
  anneesScolaires: any[] = [];

  constructor(private anneeScolaireService: AnneeScolaireService) {}

  ngOnInit(): void {
    this.getAnneesScolaires();
  }

  getAnneesScolaires(): void {
    this.anneeScolaireService.getAnneesScolaires().subscribe(data => {
      this.anneesScolaires = data;
    });
  }
}

