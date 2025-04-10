import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { EmploisDuTempsService } from '../../services/emplois-du-temps.service';
import { MatiereService } from '../../services/matiere.service';
import { HttpClient } from '@angular/common/http';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';



@Component({
  selector: 'app-ajout-emplois-du-temps',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './ajout-emplois-du-temps.component.html',
  styleUrl: './ajout-emplois-du-temps.component.css'
})
export class AjoutEmploisDuTempsComponent implements OnInit {
  classes: any[] = [];
  matieres: any[] = [];
  // enseignants: any[] = [];
  selectedClasse: string = '';
  emploiTemps: any = {};
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  heures: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;
  donneesAEnvoyer: any[] = [];
  isReady = false;


  constructor(
  private emploiService: EmploisDuTempsService, 
  private router: Router,
  private anneeService: AnneeScolaireService
) {}

  ngOnInit(): void {
    // 🔁 Récupération de l'année scolaire
    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelle = this.anneeService.getAnneeActuelle();

      if (anneeActuelle) {
        this.anneeScolaireId = anneeActuelle;
      } else if (annees.length > 0) {
        this.anneeScolaireId = annees[0].id;
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      } else {
        console.warn("Aucune année scolaire disponible.");
        return;
      }
    });

    this.chargerClasses();
    this.chargerMatieres();
    // this.chargerEnseignants();

    

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

  // chargerEmplois() {
  //   if (this.selectedClasse) {
  //     this.emploiService.getEmploisByClasse(Number(this.selectedClasse)).subscribe(data => {
  //       if (Array.isArray(data)) {
  //         console.log("Classe sélectionnée :", this.selectedClasse);
  //         console.log("EmploiTemps actuel :", this.emploiTemps);
  //         this.emploiTemps = data.filter((emploi: any) => emploi.classe.id === Number(this.selectedClasse));
  //       } else {
  //         console.error("Données invalides reçues pour les emplois du temps", data);
  //         this.emploiTemps = [];
  //       }
  //     });
  //   } else {
  //     console.warn("Classe non sélectionnée");
  //     this.emploiTemps = [];
  //   }
  // }

  chargerEmplois() {
    if (this.selectedClasse) {
      this.emploiService.getEmploisByClasse(Number(this.selectedClasse)).subscribe(data => {
        // Réinitialise la structure
        for (const jour of this.jours) {
          this.emploiTemps[jour] = {};
          for (const heure of this.heures) {
            this.emploiTemps[jour][heure] = ''; // Remet à zéro
          }
        }
  
        if (Array.isArray(data)) {
          for (const emploi of data) {
            const jour = emploi.jour;
            const heure = this.heures.find(h => h.startsWith(emploi.heure));
            if (jour && heure) {
              this.emploiTemps[jour][heure] = emploi.matiere.id; // ou emploi.matiere_id selon ton backend
            }
          }
        } else {
          console.error("Données invalides reçues pour les emplois du temps", data);
        }
      });
    } else {
      console.warn("Classe non sélectionnée");
      for (const jour of this.jours) {
        this.emploiTemps[jour] = {};
        for (const heure of this.heures) {
          this.emploiTemps[jour][heure] = '';
        }
      }
    }
  }
  

 
  
/*  ajouterEmplois() {
    if (!this.selectedClasse) {
      alert("Veuillez sélectionner une classe avant d'ajouter l'emploi du temps.");
      return;
    }
  
    const emplois = [];
    for (let jour of this.jours) {
      for (let heure of this.heures) {
        // const selectElement = document.querySelector(`select[jour="${jour}"][heure="${heure}"]`) as HTMLSelectElement;
        // const selectElement = document.querySelector(`select[name="${jour}-${heure}"]`) as HTMLSelectElement;
        const selectElement = document.querySelector(`select[name="${jour}-${heure}"]`) as HTMLSelectElement;

        const matiereId = selectElement ? selectElement.value : null;
  
        if (matiereId) {
          // Extraire uniquement l'heure de début
          const heureDebut = heure.split(' - ')[0];
  
          emplois.push({
            classe_id: this.selectedClasse,
            jour: jour,
            heure: heureDebut,  // ✅ Envoi de l'heure au bon format
            matiere_id: matiereId,
          });
        }
      }
    }
  
    if (emplois.length === 0) {
      alert("Veuillez sélectionner des matières avant d'ajouter l'emploi du temps.");
      return;
    }
  
    console.log("Données envoyées :", emplois); // Debug
    // this.emploiService.ajouterEmplois(emplois).subscribe(response => {
    //   console.log("Réponse du serveur :", response);
    //   this.router.navigate(['/emplois-du-temps']);
    // });

    this.emploiService.ajouterEmplois({
      emplois: emplois,
      annee_scolaire_id: this.anneeScolaireId
    }).subscribe(response => {
      console.log("Réponse du serveur :", response);
      this.router.navigate(['/emplois-du-temps']);
    });
  }*/
  
    ajouterEmplois() {
      // On suppose que les données emploiTemps sont organisées par jour/heure
      this.donneesAEnvoyer = [];
  
      for (const jour of this.jours) {
        for (const heure of this.heures) {
          const heureDebut = heure.split(' - ')[0];
          const matiere_id = this.emploiTemps?.[jour]?.[heure];
  
          if (matiere_id) {
            this.donneesAEnvoyer.push({
              classe_id: this.selectedClasse,
              jour,
              heure: heureDebut,
              matiere_id,
              annee_scolaire_id: this.anneeScolaireId
            });
          }
        }
      }
  
      if (this.donneesAEnvoyer.length > 0) {
        this.emploiService.ajouterEmplois(this.donneesAEnvoyer).subscribe(
          (res: any) => {
            if (res.success) {
              console.log('Données à envoyer :', this.donneesAEnvoyer);
              alert('Emplois du temps ajoutés avec succès.');
              this.router.navigate(['/emplois-du-temps']);
            } else {
              alert(res.message || 'Erreur lors de l\'ajout.');
            }
          },
          (err) => {
            console.error(err);
            alert("Erreur de communication avec le serveur.");
          }
        );
      } else {
        alert("Aucun emploi du temps à enregistrer.");
      }
    }

}




