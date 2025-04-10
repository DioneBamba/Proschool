import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmploisDuTempsService } from '../services/emplois-du-temps.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';  // Import nécessaire pour mat-table
import { MatButtonModule } from '@angular/material/button';  // Pour les boutons
import { MatIconModule } from '@angular/material/icon';  // Si tu utilises des icônes comme 'mat-icon'


// interface Emploi {
//   id: number;
//   jour: string;
//   heure: string;
//   matiere?: { nom: string }; // Matière peut être optionnelle
// }

@Component({
  selector: 'app-emplois-du-temps',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    
    MatTableModule,  // Ajouter MatTableModule ici
    MatButtonModule,  // Ajouter MatButtonModule ici si tu utilises des boutons
    MatIconModule,
  ],
  templateUrl: './emplois-du-temps.component.html',
  styleUrl: './emplois-du-temps.component.css'
})
export class EmploisDuTempsComponent implements OnInit {
  emploisDuTemps: any[] = [];
  // heures: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];
  // heures: string[] = ['08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'];

  heures = [
    { affichage: '08:00 - 09:00', heure: '08:00:00' },
    { affichage: '09:00 - 10:00', heure: '09:00:00' },
    { affichage: '10:00 - 11:00', heure: '10:00:00' },    
    { affichage: '11:00 - 12:00', heure: '11:00:00' },
    { affichage: '12:00 - 13:00', heure: '12:00:00' },
    { affichage: '13:00 - 14:00', heure: '13:00:00' },
    { affichage: '14:00 - 15:00', heure: '14:00:00' },
    { affichage: '15:00 - 16:00', heure: '15:00:00' },
    { affichage: '16:00 - 17:00', heure: '16:00:00' },
    { affichage: '17:00 - 18:00', heure: '17:00:00' },
    { affichage: '18:00 - 19:00', heure: '18:00:00' },

  ];

  jours: any[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  classes: any[] = [];
  matieres: any[] = [];
  selectedClasse: any = null; // Stocke l'ID de la classe sélectionnée

  constructor(private emploiService: EmploisDuTempsService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerMatieres();
    this.chargerClasses();
    this.chargerEmplois(1);
    // this.getEmploisDuTemps();

  }

  getEmploisDuTemps() {
    this.emploiService.getEmplois().subscribe(response => {

      if (!Array.isArray(response)) {
        console.error("⛔ getEmplois() n'a pas retourné un tableau :", response);
        this.emploisDuTemps = [];
        return;
      }
      this.emploisDuTemps = response.map(item => {
        const jours = item.jours ? item.jours.split(',') : [];
        return { ...item, jours };
      });
    });
  }

  chargerClasses() {
    this.emploiService.getClasses().subscribe(data => {
      this.classes = data;
    });
  }

  chargerMatieres() {
    this.emploiService.getMatieres().subscribe(data => {
      this.matieres = data;
    });
  }

  chargerEmplois(classeId: number): void {
    this.emploiService.getEmploisByClasse(classeId).subscribe(
      (data) => {
        this.emploisDuTemps = data.map((item: any) => {
          return {
            ...item,
            [item.jour]: item.nom_matiere
          };
        });
      },
      (error) => {
        console.error('Erreur de chargement des emplois du temps', error);
      }
    );
  }
  
  /*
  onClasseChange(): void{ 
    if (!this.selectedClasse) {
      console.error("Classe non sélectionnée !");
      return;
    }
  
    this.emploiService.getEmploisByClasse(this.selectedClasse).subscribe(
      data => {
        console.log("👉 Données reçues depuis l'API :", data);  // 👈 Ajoute ceci
  
        if (!Array.isArray(data)) {
          console.error("Données reçues incorrectes :", data);
          this.emploisDuTemps = [];
        } else {
          this.emploisDuTemps = data.map(item => ({
            ...item,
            [item.jour]: item.nom_matiere
          }));
        }
      },
      error => {
        console.error("Erreur API :", error);
        this.emploisDuTemps = [];
      }
    );
  }
  */
  
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  normalizeJour(jour: any): string {
    if (typeof jour !== 'string' || !jour.trim()) return '';
    
    const normalisé = jour.charAt(0).toUpperCase() + jour.slice(1).toLowerCase();
    const joursValides = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
    return joursValides.includes(normalisé) ? normalisé : '';
  }

  onClasseChange(): void {
    if (!this.selectedClasse) {
      console.error("Classe non sélectionnée !");
      return;
    }
  
    this.emploiService.getEmploisByClasse(this.selectedClasse).subscribe(
      data => {
        const emploisMap: { [heure: string]: any } = {};
        console.log('✅ Classe sélectionnée :', this.selectedClasse);
        
        data.forEach((item: any) => {
          if (!item.heure || !item.jour) {
            // console.warn('⛔ Donnée incomplète détectée :', item);
            console.warn('⛔ Problème avec la structure des données :', item);
            return;
          }

          const heure = item.heure;
          // const jour = this.capitalize(item.jour);
          const jour = this.normalizeJour(item.jour);
          console.log('📅 Donnée brute jour:', item.jour, '→ normalisée :', jour);

          // const jour = item.jour;
          const matiere = item.nom_matiere;

          if (!jour) {
            console.warn('⛔ Jour non valide après normalisation :', item.jour);
            return;
          }

          if (!matiere) {
            console.info('ℹ️ Aucune matière pour ce créneau :', { jour, heure });
          }
  
          if (!emploisMap[heure]) {
            emploisMap[heure] = { heure };
          }
  
          emploisMap[heure][jour] = matiere ?? '-';
        });
  
        this.emploisDuTemps = Object.values(emploisMap);
        console.table(this.emploisDuTemps); // 👈 Tu peux voir dans la console si tout est bon
      },
      error => {
        console.error("Erreur API :", error);
        this.emploisDuTemps = [];

      }
    );
  }
  

  getMatiere(jour: string, heure: string): string {
    const ligne = this.emploisDuTemps.find(e => e.heure === heure);
    const jourCapitalize = this.capitalize(jour); // ← IMPORTANT
    return ligne && ligne[jourCapitalize] ? ligne[jourCapitalize] : '-';
  }


  // getMatiere(jour: string, heure: string): string {
  //   const ligne = this.emploisDuTemps.find(e => e.heure === heure);
  //   return ligne && ligne[jour] ? ligne[jour] : '-';
  // }

  getMatiereName(matiere_id: number): string {
    const matiere = this.matieres.find(m => m.id === matiere_id);
    return matiere ? matiere.nom : '-';
  }
}