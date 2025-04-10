import { Component, OnInit } from '@angular/core';
import { ScolariteService } from '../services/scolarite.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { FcfaCurrencyPipe } from '../fcfa-currency.pipe';  // Assure-toi de mettre le bon chemin

@Component({
  selector: 'app-scolarites',
  standalone: true,
  imports: [
    CommonModule, // Corrige *ngFor et | currency
    RouterModule,
    // FcfaCurrencyPipe  // Ajoute le pipe ici
  ],
  templateUrl: './scolarites.component.html',
  styleUrl: './scolarites.component.css'
})
export class ScolaritesComponent implements OnInit {
  scolarites: any[] = [];
  scolariteSelectionnee: any = null;

  constructor(private scolariteService: ScolariteService) {}

  ngOnInit() {
    this.chargerScolarites();
  }

  chargerScolarites() {
    this.scolariteService.getScolarites().subscribe(data => {
      console.log("Données récupérées :", data);
      this.scolarites = data
    });
  }

  selectionnerScolarite(scolarite: any) {
    this.scolariteSelectionnee = scolarite;
    console.log("Scolarité sélectionnée :", this.scolariteSelectionnee);
  }

  supprimerScolarite(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette scolarité ?')) {
      this.scolariteService.supprimerScolarite(id).subscribe(() => {
        this.chargerScolarites();
      });
    }
  }
}



