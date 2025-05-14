import { Component, OnInit } from '@angular/core';
import { BibliothequeService } from '../services/bibliotheque.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bibliotheques',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './bibliotheques.component.html',
  styleUrl: './bibliotheques.component.css'
})
export class BibliothequesComponent implements OnInit {
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;
  livres: any[] = [];
  emprunts: any[] = [];
  livreId!: number;
  dialogOuvert: boolean = false;  // Pour contrôler l'ouverture de la boîte de dialogue
  formulaireLivre!: FormGroup;    // Le formulaire réactif
  

  constructor(
    private bibliothequeService: BibliothequeService, 
    private anneeService: AnneeScolaireService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // 📆 Récupération de l'année scolaire actuelle
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

    this.formulaireLivre = this.fb.group({
      titre: ['', Validators.required],
      auteur: ['', Validators.required],
      genre: ['', Validators.required],
      // disponible: ['', [Validators.required, Validators.min(1)]]
      disponible: [1, [Validators.required, Validators.min(0)]]
    });

    this.chargerDonnees();
  }

  chargerDonnees() {
    this.bibliothequeService.getLivres().subscribe(data => this.livres = data);
    this.bibliothequeService.getEmprunts().subscribe(data => this.emprunts = data);
  }

  emprunter(livreId: number) {
    const emprunt = {
      
      livre_id: livreId,
      eleve_id: 1,
      date_emprunt: new Date().toISOString().split('T')[0],
      date_retour: '',
      statut: 'en cours',
      annee_scolaire_id: this.anneeScolaireId
    };
    this.bibliothequeService.emprunterLivre(emprunt).subscribe(() => this.chargerDonnees());
  }

  retourner(id: number) {
    this.bibliothequeService.retournerLivre(id).subscribe(() => this.chargerDonnees());
  }

  ouvrirDialog() {
    this.dialogOuvert = true;
  }

  fermerDialog() {
    this.dialogOuvert = false;
    this.formulaireLivre.reset(); // Vide le formulaire à la fermeture
  }

  ajouterLivre() {
    if (this.formulaireLivre.invalid) {
      return;
    }

    const nouveauLivre = {
      ...this.formulaireLivre.value,
  //     titre: this.formulaireLivre.value.titre,
  // auteur: this.formulaireLivre.value.auteur,
  // genre: this.formulaireLivre.value.genre ?? '',
  // disponible: 1,
      annee_scolaire_id: this.anneeScolaireId
    };

    this.bibliothequeService.ajouterLivre(nouveauLivre).subscribe(() => {
      this.chargerDonnees();
      this.fermerDialog();
    });
  }

  modifierLivre(livreId: number, livre: any) {
    this.bibliothequeService.modifierLivre(livreId, livre).subscribe(() => {
      this.chargerDonnees();
    });
  }
  
  supprimerLivre(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bibliothequeService.supprimerLivre(id).subscribe(() => {
        this.chargerDonnees();
      });
    }
  }


}
