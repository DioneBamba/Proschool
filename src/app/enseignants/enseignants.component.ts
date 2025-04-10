import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EnseignantService } from '../services/enseignant.service';

@Component({
  selector: 'app-enseignants',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './enseignants.component.html',
  styleUrl: './enseignants.component.css'
})
export class EnseignantsComponent implements OnInit {
  enseignants: any[] = [];

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.enseignantService.getEnseignants().subscribe(data => {
      this.enseignants = data;
    });
  }

  supprimerEnseignant(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet enseignant ?')) {
      this.enseignantService.supprimerEnseignant(id).subscribe(() => {
        this.enseignants = this.enseignants.filter(e => e.id !== id);
      });
    }
  }
}
