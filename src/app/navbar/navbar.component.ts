import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RechercheService } from '../services/recherche.service';
import { AuthService } from '../services/auth.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() username: { prenom: string, nom: string } | null = null;
  currentDate: Date = new Date(); 
  searchText: string = '';
  role: string | null = '';

  searchQuery = '';
  searchResults: any[] = [];
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
  private rechercheService: RechercheService, 
  private router: Router, 
  private authService: AuthService,
  private anneeService: AnneeScolaireService
  ) {}

  ngOnInit() {
    // this.role = localStorage.getItem('role'); // Récupère le rôle
    // const userData = localStorage.getItem('user'); // Récupérer l'utilisateur depuis le localStorage
    // console.log('🔄 Vérification du token :', localStorage.getItem('token'));
    // console.log('🔄 Vérification du rôle :', localStorage.getItem('role'));
    // console.log("🔍 Données récupérées du localStorage :", userData);

    this.role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    this.username = userData ? JSON.parse(userData) : null;
    // if (userData) {
    //   // this.username = JSON.parse(userData); // Convertir la chaîne JSON en objet
    //   this.username = userData ? JSON.parse(userData) : null;
    //   console.log("📌 Utilisateur après initialisation :", this.username);
    // }

    this.authService.user$.subscribe(user => {
      this.username = user;
      this.role = user.role;
    });

     // Vérifie si l'utilisateur est toujours authentifié
    if (!this.authService.isAuthenticated()) {
      console.log("🚫 Session expirée ou non valide, suppression des données stockées.");
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      this.role = null;
      this.username = null;
    } else {
      this.role = sessionStorage.getItem('role');
      const userData = sessionStorage.getItem('user');
      this.username = userData ? JSON.parse(userData) : null;
    }

    const expiration = localStorage.getItem('sessionExpiration');
    if (expiration && new Date().getTime() > parseInt(expiration)) {
      console.log("🕒 Session expirée, suppression des données.");
      localStorage.clear();
      this.role = null;
      this.username = null;
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

    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  onRecherche() {
    if (this.searchQuery.trim() !== '') {
      this.rechercheService.search(this.searchQuery).subscribe(results => {
        console.log('Résultats de la recherche:', results);
        this.searchResults = results;
      }, error => {
        console.error('Erreur lors de la recherche', error);
      });
    } else {
      this.searchResults = [];
    }
  }

  onSelectResult(result: any) {
    if (result && result.id && result.type) {
      this.searchResults = []; // Fermer la liste des résultats
      console.log("🔍 Redirection vers:", `/details-recherche/${result.id}/${result.type}`);
      this.router.navigate(['/details-recherche', result.id, result.type]).then(() => {
        console.log("✅ Redirection réussie !");
      }).catch(err => {
        console.error("❌ Erreur lors de la redirection :", err);
      });
    } else {
      console.warn("🚨 Erreur: Données incomplètes pour la redirection", result);
    }
  }

  logout() {
    // localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.logout();
    this.username = null;  // Met à jour la variable pour masquer l'affichage
    this.role = null;      // Cache aussi le rôle
    this.router.navigate(['/login']);
    // window.location.href = '/login'; // Redirige après déconnexion
  }
  
}