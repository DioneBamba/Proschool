import { AnneeScolaireService } from './../services/annee-scolaire.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RechercheService } from '../services/recherche.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-recherche',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './details-recherche.component.html',
  styleUrl: './details-recherche.component.css'
})
export class DetailsRechercheComponent implements OnInit {
  selectedResult: any = null;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private route: ActivatedRoute,
    private rechercheService: RechercheService,
    private anneeService: AnneeScolaireService
  ) {}

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
      // this.rechercheService.getDetails(id, type).subscribe(data => {
      //   this.details = data;
      // });
    //   this.selectResult(id);
    // }

    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type'); // Ajouter le type
    if (id && type) {
      this.rechercheService.getDetails(id, type).subscribe(data => {
        console.log("🔍 Données récupérées :", data);
        this.selectedResult = data;
      });
    }

    // Récupération de l'année scolaire actuelle
    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelle = this.anneeService.getAnneeActuelle();

      if (anneeActuelle) {
        this.anneeScolaireId = anneeActuelle;
      } else if (annees.length > 0) {
        this.anneeScolaireId = annees[0].id;
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      }
    });
      
  }

  selectResult(result: any) {
    this.rechercheService.getDetails(result.id, result.type).subscribe(data => {
      this.selectedResult = data;
    });
  }
}
