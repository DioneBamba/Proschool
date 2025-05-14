import { Component,  } from '@angular/core';
import { EleveService } from '../services/eleve.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { AnneeScolaireComponent } from "../annee-scolaire/annee-scolaire.component";
import { SelectAnneeScolaireComponent } from "../annee-scolaire/select-annee-scolaire/select-annee-scolaire.component";
import { AjoutAnneeScolaireComponent } from "../annee-scolaire/ajout-annee-scolaire/ajout-annee-scolaire.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
}