import { Component, OnInit } from '@angular/core';
import { EleveService } from '../services/eleve.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClasseService } from '../services/classe.service';
import { FormGroup } from '@angular/forms';
import { AnneeScolaireService } from '../services/annee-scolaire.service';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './eleves.component.html',
  styleUrl: './eleves.component.css'
})
export class ElevesComponent implements OnInit {

  
  eleves: any[] = [];
  classes: any[] = [];
  eleveId!: number;
  anneeScolaireId!: number;
  statsParClasse: any;
  nom_classe!: string;

  constructor(
    private eleveService: EleveService, 
    private classeService: ClasseService, 
    private router: Router,
    private anneeService: AnneeScolaireService
  ) { }

  ngOnInit(): void {
    const annee = this.anneeService.getAnneeActuelle();
    this.anneeScolaireId = annee !== null ? annee : 0;

    this.eleveService.getEleves(this.eleveId).subscribe(data => {
      console.log("📌 Réponse API après correction :", data);
    
    this.eleves = data.map(eleve => ({
      ...eleve,
      nom_classe: eleve.nom_classe ? eleve.nom_classe : 'Non attribué'
    }));

    
      console.log("✅ Élèves après transformation :", this.eleves);
    });
    this.classeService.getClasses().subscribe(data => {
      this.classes = data;
    });

    this.eleveService.getNombreElevesParClasse(this.nom_classe).subscribe(data => {
      console.log('Nombre d\'élèves par classe:', data);
      this.statsParClasse = data;
    });

    
  }



  supprimerEleve(id: number) {
    if (!id) {
      console.error('ID invalide pour la suppression');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      this.eleveService.supprimerEleve(id).subscribe(
        response => {
          alert('Élève supprimé avec succès');
          this.router.navigate(['/eleves']);
        },
        error => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression');
        }
      );
    }
  }

  
}




