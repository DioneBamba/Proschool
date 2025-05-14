import { Component, OnInit } from '@angular/core';
import { NoteService } from '../services/note.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule, DecimalPipe, NgFor, NgIf } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { EleveService } from '../services/eleve.service';
import { map } from 'rxjs';
import { AbsenceService } from '../services/absence.service';
import { forkJoin } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


interface Eleve {
  id: any;
  moyenne_generale: number;
  rang?: number; // 🔹 Ajout de la propriété "rang" optionnelle
}

@Component({
  selector: 'app-bulletins',
  standalone: true,
  imports: [
    CommonModule,
    // NgIf,
    // NgFor,
    // DecimalPipe,
    RouterModule
  ],
  templateUrl: './bulletins.component.html',
  styleUrl: './bulletins.component.css'
})
export class BulletinsComponent implements OnInit {
  notes: any[] = [];
  eleves: any[] = [];
  eleve: any;
  eleveId!: number; // ID de l'élève pour lequel les notes sont chargées
  notesRegroupees: any[] = [];
  selectedEleveId: number | null = null; 
  eleveSelectionne: any = null; 
  isDataLoaded: boolean = false;

  constructor(
    private noteService: NoteService, 
    private route: ActivatedRoute,
    private eleveService: EleveService,
    private absenceService: AbsenceService
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   this.selectedEleveId = Number(params.get('id'));
    //   this.chargerNotes();
    // });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.selectedEleveId = Number(idParam);
        console.log("ID de l'élève sélectionné :", this.selectedEleveId);
        this.chargerNotes();
      } else {
        console.error("Aucun ID d'élève reçu !");
      }
    });
    
  }

  // chargerNotes(): void {
    
  //   if (!this.selectedEleveId) {
  //     console.error("❌ Erreur : aucun élève sélectionné !");
  //     return;
  //   }

    
    

  //   // Récupération des infos de l'élève
  //   this.eleveService.getEleves(this.selectedEleveId).subscribe({
  //     next: (data) => {
  //       console.log("Données reçues depuis EleveService :", data);
  //       console.log("Élèves reçus :", data); // Debug
  //       if (data) {
  //         // this.eleve = data;
          
  //         this.eleve = data.find((e: any) => e.id === this.selectedEleveId);

  //         console.log("🎯 Élève récupéré :", this.eleve);

  //         if (this.eleve) {
  //           console.log("✅ Élève trouvé :", this.eleve);
  //           console.log("🔍 Nom de la classe utilisé :", this.eleve.nom_classe);
            
  //           this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).subscribe(nbEleves => {
  //             console.log("📊 Réponse de getNombreElevesParClasse :", nbEleves);
  //             if (Array.isArray(nbEleves) && nbEleves.length > 0) {
  //                 const classeTrouvee = nbEleves.find(c => c.nom_classe === this.eleve.nom_classe);
  //                 this.eleve.nb_eleves = classeTrouvee ? classeTrouvee.nb_eleves : 0;
  //             } else {
  //                 this.eleve.nb_eleves = 0;
  //             }
  //             console.log("📌 Nombre d'élèves dans la classe :", this.eleve.nb_eleves);
  //           });
  //       } else {
  //           console.warn("⚠️ Aucun élève trouvé !");
  //       }

  //       } else {
  //         console.warn("⚠️ Aucun élève trouvé !");
  //       }
  //     },
  //     error: (err) => {
  //       console.error("❌ Erreur lors de la récupération de l'élève :", err);
  //     }
  //   });

  //   // Récupération des notes de l'élève
  //   this.noteService.getNotesByEleveId(this.selectedEleveId).subscribe({
  //     next: (data) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         this.notes = data;
  //         console.log("📄 Notes trouvées :", this.notes);
  //       } else {
  //         console.warn("⚠️ Aucune note trouvée !");
  //       }
  //     },
  //     error: (err) => {
  //       console.error("❌ Erreur lors de la récupération des notes :", err);
  //     }
  //   });



  //   // this.eleveService.getEleves(this.selectedEleveId).subscribe({
  //   //   next: (data) => {
  //   //     if (!data) {
  //   //       console.warn("⚠️ Aucune donnée reçue !");
  //   //       return;
  //   //     }

  //   //     // Vérifie si data est un tableau ou un objet unique
  //   //     this.eleve = Array.isArray(data) ? data.find((e: any) => e.id === this.selectedEleveId) : data;
  //   //     // Log des absences et du rang
  //   // console.log("Absences de l'élève :", this.eleve?.absences);
  //   // console.log("Rang de l'élève :", this.eleve?.rang);

  //   //     if (this.eleve) {
  //   //       console.log("✅ Élève trouvé :", this.eleve);

  //   //       // Vérification des absences
  //   //       console.log("📌 Absences avant génération :", this.eleve.absences);
  //   //       this.eleve.absences = this.eleve.absences ?? 0;
  //   //       console.log("📌 Absences après assignation :", this.eleve.absences);

  //   //       // Vérification de la classe avant de chercher le rang
  //   //       if (this.eleve.nom_classe) {
  //   //         this.eleveService.getRangElevesParClasse(this.eleve.nom_classe).subscribe(eleves => {
  //   //           console.log("📊 Données reçues pour les rangs :", eleves);

  //   //           const eleveTrouve = eleves.find(e => e.id === this.selectedEleveId);
  //   //           this.eleve.rang = eleveTrouve ? eleveTrouve.rang : 'N/A';

  //   //           console.log("🏆 Rang récupéré :", this.eleve.rang);
  //   //         });
  //   //       } else {
  //   //         console.warn("⚠️ La classe de l'élève est indéfinie !");
  //   //       }
  //   //     } else {
  //   //       console.warn("⚠️ Élève non trouvé !");
  //   //     }
  //   //   },
  //   //   error: (err) => {
  //   //     console.error("❌ Erreur lors de la récupération de l'élève :", err);
  //   //   }
  //   // });

  //   // 🔹 Récupération des absences depuis le service AbsenceService
    
  //   this.absenceService.getAbsencesByEleveId(this.selectedEleveId).subscribe({
  //     next: (data) => {
  //       console.log("📩 Absences récupérées depuis AbsenceService avant affectation :", data);
  //       console.log("Élève actuel après récupération :", this.eleve);
  //       if (!this.eleve) {
  //         console.warn("⚠️ Élève non encore chargé, en attente...");
  //         return;
  //       }
        
  //       // this.eleve.absences = data?.absences ?? 0;  // Définit à 0 si absences est undefined
  //        // Vérifie si data est un tableau et prend le premier élément ou utilise 0 par défaut
  //        console.log("📌 Absences avant assignation :", this.eleve.absences);
  //       // this.eleve.absences = Array.isArray(data) && data.length > 0 ? data[0].absences ?? 0 : 0;
  //       this.eleve.absences = Array.isArray(data) ? data.length : 0;
  //       console.log("📌 Nombre total d'absences :", this.eleve.absences);

  //       // console.log("📌 Absences après assignation :", this.eleve.absences);

  //     },
  //     error: (err) => console.error("❌ Erreur récupération absences :", err)
  //   });

  //   // 🔹 Récupération du rang depuis le service EleveService
  //   if (this.eleve && this.eleve.nom_classe) {
  //     this.eleveService.getRangElevesParClasse(this.eleve.nom_classe).subscribe(eleves => {
  //       console.log("📊 Données reçues pour les rangs :", eleves);
        
  //       const eleveTrouve = eleves.find(e => e.id === this.selectedEleveId);
  //       this.eleve.rang = eleveTrouve ? eleveTrouve.rang : 'N/A';
  //       console.log("Classe trouvée pour le calcul du rang :", this.eleve?.nom_classe)
  //       console.log("🏆 Rang récupéré :", this.eleve.rang);
  //     });
  //   } else {
  //     console.warn("⚠️ Impossible de récupérer le rang, l'élève ou la classe est indéfini !");
  //   }
    
    
  // }


  // chargerNotes(): void {
  //   if (!this.selectedEleveId) {
  //     console.error("❌ Erreur : aucun élève sélectionné !");
  //     return;
  //   }
  
  //   this.isDataLoaded = false; // Réinitialiser avant chargement
  
  //   // Étape 1 : Récupérer l'élève
  //   this.eleveService.getEleves(this.selectedEleveId).subscribe({
  //     next: (data) => {
  //       if (data) {
  //         this.eleve = data.find((e: any) => e.id === this.selectedEleveId);
  //         if (!this.eleve) {
  //           console.warn("⚠️ Élève non trouvé !");
  //           return;
  //         }
          
  //         console.log("✅ Élève trouvé :", this.eleve);

  //         this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).subscribe(nbEleves => {
  //           console.log("📊 Réponse de getNombreElevesParClasse :", nbEleves);
  //           if (Array.isArray(nbEleves) && nbEleves.length > 0) {
  //               const classeTrouvee = nbEleves.find(c => c.nom_classe === this.eleve.nom_classe);
  //               this.eleve.nb_eleves = classeTrouvee ? classeTrouvee.nb_eleves : 0;
  //           } else {
  //               this.eleve.nb_eleves = 0;
  //           }
  //           console.log("📌 Nombre d'élèves dans la classe :", this.eleve.nb_eleves);
  //         });

  //         this.noteService.getNotesByEleveId(Number(this.selectedEleveId)).subscribe({
  //           next: (data) => {
  //             if (Array.isArray(data) && data.length > 0) {
  //               this.notes = data;
  //               console.log("📄 Notes trouvées :", this.notes);
  //             } else {
  //               console.warn("⚠️ Aucune note trouvée !");
  //             }
  //           },
  //           error: (err) => {
  //             console.error("❌ Erreur lors de la récupération des notes :", err);
  //           }
  //         });
  
  //         // Étape 2 : Récupérer les absences
  //         this.absenceService.getAbsencesByEleveId(Number(this.selectedEleveId)).subscribe({
  //           next: (absences) => {
  //             this.eleve.absences = Array.isArray(absences) ? absences.length : 0;
  //             console.log("📌 Absences récupérées :", this.eleve.absences);
  
  //             // Étape 3 : Récupérer le rang uniquement après les absences
  //             this.eleveService.getRangElevesParClasse(this.eleve.nom_classe).subscribe(eleves => {
  //               console.log("📊 Données reçues pour les rangs :", eleves);

  //               if (!Array.isArray(eleves)) {
  //                 console.error("❌ Erreur : les données de rangs ne sont pas un tableau !");
  //                 return;
  //               }

  //               const eleveTrouve = eleves.find(e => e.id === this.selectedEleveId);
  //               this.eleve.rang = eleveTrouve ? eleveTrouve.rang : 'N/A';

  //               console.log("🏆 Rang récupéré :", this.eleve.rang);
  //             });
  //           },
  //           error: (err) => console.error("❌ Erreur récupération absences :", err)
  //         });

  //         if (this.eleve && this.eleve.nom_classe) {
  //           this.eleveService.getRangElevesParClasse(this.eleve.nom_classe).subscribe(eleves => {
  //             console.log("📊 Données reçues pour les rangs :", eleves);
              
  //             const eleveTrouve = eleves.find(e => e.id === this.selectedEleveId);
  //             this.eleve.rang = eleveTrouve ? eleveTrouve.rang : 'N/A';
  //             console.log("Classe trouvée pour le calcul du rang :", this.eleve?.nom_classe)
  //             console.log("🏆 Rang récupéré :", this.eleve.rang);
  //           });
  //         } else {
  //           console.warn("⚠️ Impossible de récupérer le rang, l'élève ou la classe est indéfini !");
  //         }
  //       }
  //     },
  //     error: (err) => console.error("❌ Erreur récupération élève :", err)
  //   });
  // }



  // chargerNotes(): void {
  //   if (!this.selectedEleveId) {
  //     console.error("❌ Erreur : aucun élève sélectionné !");
  //     return;
  //   }

  //   this.isDataLoaded = false; 

  //   this.eleveService.getEleves(this.selectedEleveId).pipe(
  //     switchMap((eleves) => {
  //     console.log("📌 Liste des élèves reçue :", eleves);

  //       this.eleve = eleves.find((e: any) => e.id === this.selectedEleveId);
  //       if (!this.eleve) {
  //         console.warn("⚠️ Élève non trouvé !");
  //         throw new Error("Élève non trouvé !");
  //       }

  //       return forkJoin({
  //         // nbEleves: this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).pipe(catchError(() => [])),
  //         nbEleves: this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe)
  //         .pipe(
  //           map((res: any) => Array.isArray(res) ? res : [{ nom_classe: this.eleve.nom_classe, nb_eleves: res }]), 
  //           catchError(() => [])
  //         ),
  //         notes: this.noteService.getNotesByEleveId(Number(this.selectedEleveId)).pipe(catchError(() => [])),
  //         absences: this.absenceService.getAbsencesByEleveId(Number(this.selectedEleveId)).pipe(catchError(() => []))
  //       });
  //     })
  //   ).subscribe({
  //     next: ({ nbEleves, notes, absences }) => {
  //       console.log("📌 Absences récupérées :", absences);
  //       console.log("📌 Nombre d'élèves dans la classe :", nbEleves);

  //       const classeTrouvee = nbEleves.find((c: any) => c.nom_classe === this.eleve.nom_classe);
  //       this.eleve.nb_eleves = classeTrouvee ? classeTrouvee.nb_eleves : 0;

  //       this.notes = notes;
  //       this.eleve.absences = Array.isArray(absences) ? absences.length : 0;

  //       console.log("📌 Absences finales de l'élève :", this.eleve.absences);
  //       console.log("📌 Rang actuel de l'élève :", this.eleve.rang);

  //       // Ajouter cette partie après avoir récupéré les notes et nbEleves
  //       this.eleve.moyenne_generale = this.calculerMoyenneGenerale(this.notes);

  //       // this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
  //       //   map((eleves) => {
  //       //     let elevesTries = eleves
  //       //       .map(eleve => ({
  //       //         id: eleve.id,
  //       //         moyenne_generale: eleve.moyenne_generale || 0,
  //       //         rang: 0
  //       //       }))
  //       //       .sort((a, b) => b.moyenne_generale - a.moyenne_generale);

  //       //     elevesTries.forEach((eleve, index) => {
  //       //       eleve.rang = index + 1;
  //       //     });

  //       //     return elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
  //       //   })
  //       // ).subscribe(rang => {
  //       //   this.eleve.rang = rang;
  //       //   console.log("📌 Rang calculé de l'élève :", this.eleve.rang);
  //       // });

  //       this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
  //         map((eleves) => {
  //           if (!eleves || !Array.isArray(eleves) || eleves.length === 0) {
  //             console.warn("⚠️ Aucune liste d'élèves reçue !");
  //             return "Non classé";
  //           }

  //           let elevesTries = eleves
  //             .map(eleve => ({
  //               id: eleve.id,
  //               moyenne_generale: eleve.moyenne_generale ?? 0,
  //               rang: 0
  //             }))
  //             .sort((a, b) => b.moyenne_generale - a.moyenne_generale);

  //           elevesTries.forEach((eleve, index) => {
  //             eleve.rang = index + 1;
  //           });

  //           return elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
  //         })
  //       ).subscribe(rang => {
  //         this.eleve.rang = rang;
  //         console.log("📌 Rang calculé de l'élève :", this.eleve.rang);
  //       });





  //       this.isDataLoaded = true; 
  //     },
  //     error: (err) => console.error("❌ Erreur lors du chargement des données :", err)
  //   });
  // }

  chargerNotes(): void {
    if (!this.selectedEleveId) {
      console.error("❌ Erreur : aucun élève sélectionné !");
      return;
    }

    this.isDataLoaded = false;

    this.eleveService.getEleves(this.selectedEleveId).pipe(
      switchMap((eleves) => {
        this.eleve = eleves.find((e: any) => e.id === this.selectedEleveId);
        // this.eleve = eleves;
        if (!this.eleve) {
          console.warn("⚠️ Élève non trouvé !");
          throw new Error("Élève non trouvé !");
        }

        return forkJoin({
          // nbEleves: this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).pipe(
          //   map((res: any) => Array.isArray(res) ? res : [{ nom_classe: this.eleve.nom_classe, nb_eleves: res }]), 
          //   catchError(() => [])
          nbEleves: this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).pipe(
            // map((res: any) => (typeof res === 'number' ? res : (res?.nb_eleves || 0))), 
            map((res: any) => res?.nb_eleves ?? 0),
            catchError(() => of(0)) // En cas d'erreur, retournez 0
            
          ),
          notes: this.noteService.getNotesByEleveId(Number(this.selectedEleveId)).pipe(catchError(() => [])),
          absences: this.absenceService.getAbsencesByEleveId(Number(this.selectedEleveId)).pipe(catchError(() => []))
        });
      })
    ).subscribe({
      next: ({ nbEleves, notes, absences }) => {
        this.notes = notes;
        this.eleve.absences = Array.isArray(absences) ? absences.length : 0;

        this.eleve.moyenne_generale = this.calculerMoyenneGenerale(this.notes);
        console.log("Moyenne générale calculée :", this.eleve.moyenne_generale);

        // ✅ Récupération des élèves et calcul du rang
        // this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
        //   map((eleves) => {
        //     if (!eleves || !Array.isArray(eleves) || eleves.length === 0) {
        //       console.warn("⚠️ Aucune liste d'élèves reçue !");
        //       return "Non classé";
        //     }

        //     // ✅ Mise à jour des moyennes générales
        //     let elevesTries = eleves.map(eleve => ({
        //       id: eleve.id,
        //       moyenne_generale: eleve.id === this.selectedEleveId ? this.eleve.moyenne_generale : (eleve.moyenne_generale ?? 0),
        //       rang: 0
        //     })).sort((a, b) => b.moyenne_generale - a.moyenne_generale);

        //     // ✅ Attribution des rangs
        //     elevesTries.forEach((eleve, index) => {
        //       eleve.rang = index + 1;
        //     });

        //     return elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
        //   })
        // ).subscribe(rang => {
        //   this.eleve.rang = rang;
        //   console.log("📌 Rang calculé de l'élève :", this.eleve.rang);
        // });

        // this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
        //   map((eleves) => {
        //     if (!eleves || !Array.isArray(eleves) || eleves.length === 0) {
        //       console.warn("⚠️ Aucune liste d'élèves reçue !");
        //       return "Non classé";
        //     }

        //     let elevesTries = eleves.map(eleve => ({
        //       id: eleve.id,
        //       // moyenne_generale: eleve.id === this.selectedEleveId ? this.eleve.moyenne_generale : (eleve.moyenne_generale ?? 0),
        //       moyenne_generale: (eleve.id === this.selectedEleveId ? this.eleve.moyenne_generale : parseFloat(eleve.moyenne_generale) || 0),
        //       rang: 0
        //     })).sort((a, b) => b.moyenne_generale - a.moyenne_generale);

        //     elevesTries.forEach((eleve, index) => {
        //       eleve.rang = index + 1;
        //     });

        //     return elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
        //   })
        // ).subscribe(rang => {
        //   this.eleve.rang = rang;
        //   console.log("📌 Rang calculé de l'élève :", this.eleve.rang);
        // });


        // this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
        //   map((eleves) => {
        //     if (!eleves || !Array.isArray(eleves) || eleves.length === 0) {
        //       console.warn("⚠️ Aucune liste d'élèves reçue !");
        //       return "Non classé";
        //     }
        //     let elevesTries = eleves.map(eleve => ({
        //       id: eleve.id,
        //       moyenne_generale: parseFloat(eleve.moyenne_generale) || 0,
        //       rang: 0
              
        //     })).sort((a, b) => b.moyenne_generale - a.moyenne_generale);
            
        //     console.log("Élèves triés par moyenne générale :", elevesTries);

        //     elevesTries.forEach((eleve, index) => {
        //       eleve.rang = index + 1;
        //     });
        //     console.log("Rangs attribués :", elevesTries);

        //     return elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
        //   }),
        //   catchError(() => {
        //     console.error("Erreur lors de la récupération des élèves !");
        //     return of("Non classé");
        //   })
        // ).subscribe(rang => {
        //   this.eleve.rang = rang;
        //   console.log("📌 Rang calculé de l'élève :", this.eleve.rang);
        // });


        this.eleveService.getElevesParClasse(this.eleve.nom_classe).pipe(
          map((eleves) => {
            if (!eleves || !Array.isArray(eleves) || eleves.length === 0) {
              console.warn("⚠️ Aucune liste d'élèves reçue !");
              return "Non classé";
            }
        
            console.log("📌 Liste des élèves avant traitement :", eleves);
        
            let elevesTries = eleves.map(eleve => ({
              id: eleve.id,
              moyenne_generale: parseFloat(eleve.moyenne_generale) || 0,
              rang: 0
            })).sort((a, b) => b.moyenne_generale - a.moyenne_generale);
        
            console.log("📌 Élèves triés :", elevesTries);
        
            elevesTries.forEach((eleve, index) => {
              eleve.rang = index + 1;
            });
        
            console.log("📌 Rangs attribués :", elevesTries);
        
            let rangTrouve = elevesTries.find(e => e.id === this.selectedEleveId)?.rang || "Non classé";
            console.log("📌 Rang trouvé pour l'élève :", rangTrouve);
            
            return rangTrouve;
          }),
          catchError(() => {
            console.error("Erreur lors de la récupération des élèves !");
            return of("Non classé");
          })
        ).subscribe(rang => {
          this.eleve.rang = rang;
          console.log("📌 Rang final attribué :", this.eleve.rang);
        });
        


        this.eleveService.getNombreElevesParClasse(this.eleve.nom_classe).subscribe(nbEleves => {
          console.log("📊 Réponse de getNombreElevesParClasse :", nbEleves);
          if (Array.isArray(nbEleves) && nbEleves.length > 0) {
              const classeTrouvee = nbEleves.find(c => c.nom_classe === this.eleve.nom_classe);
              this.eleve.nb_eleves = classeTrouvee ? classeTrouvee.nb_eleves : 0;
          } else {
              this.eleve.nb_eleves = 0;
          }
          console.log("📌 Nombre d'élèves dans la classe :", this.eleve.nb_eleves);
        });
        



        this.isDataLoaded = true;
      },
      error: (err) => console.error("❌ Erreur lors du chargement des données :", err)
    });
  }


  // calculerMoyenneGenerale(notes: any[]): number {
    
  //   let totalMoyenne = 0;
  //   let totalCoef = 0;

  //   if (totalCoef === 0) {
  //   console.warn("⚠️ Total des coefficients est zéro !");
  //   return 0;
  //   }

  //   console.log("Notes avant calcul:", this.notes);

  //   notes.forEach(note => {
  //     console.log("Note :", note.moyenne, "Coefficient :", note.coefficient);
  //     totalMoyenne += parseFloat(note.moyenne) * parseFloat(note.coefficient);
  //     totalCoef += parseFloat(note.coefficient);

  //     console.log("Notes chargées pour l'élève :", this.notes);
  //     console.log("Élève récupéré :", this.eleve);
  //     console.log("Moyenne calculée avant affectation :", this.eleve.moyenne_generale);
  //   });

  //   return totalCoef ? parseFloat((totalMoyenne / totalCoef).toFixed(2)) : 0;


  // }

  calculerMoyenneGenerale(notes: any[]): number {
    let totalPoints = 0;
    let totalCoefficients = 0;
  
    console.log("📌 Notes avant calcul :", notes);
  
    notes.forEach(note => {
      let devoir1 = parseFloat(note.devoir1);
      let devoir2 = parseFloat(note.devoir2);
      let composition = parseFloat(note.composition);
      let coefficient = parseFloat(note.coefficient);
  
      if (!isNaN(devoir1) && !isNaN(devoir2) && !isNaN(composition) && !isNaN(coefficient) && coefficient > 0) {
        let moyenneMatiere = (devoir1 + devoir2 + composition) / 3;
        totalPoints += moyenneMatiere * coefficient;
        totalCoefficients += coefficient;
      }
    });
  
    return totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;
  }
  

  onEleveSelectionne(id: string) {
  this.eleveSelectionne = this.eleves.find(eleve => eleve.id === id);
  console.log("Élève sélectionné :", this.eleveSelectionne);
  }

  
  // imprimer(): void {
  //   window.print();
  // }
  

  generatePDF(): void {
    const element = document.getElementById('bulletin'); // L'élément contenant le bulletin
    html2canvas(element!).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10,  180, 250);
      pdf.save('bulletin.pdf');
    });


  }
  
  generateBulletinPremier(eleve: any, notes: any[]) {
    console.log("📌 Élève avant génération PDF :", eleve);
    
    console.log("Élève sélectionné :", eleve);
    if (!eleve || typeof eleve !== 'object') {
      console.error("Données de l'élève invalides :", eleve);
      return;
    }

    if (!this.isDataLoaded) {
    console.warn("⏳ Attente des données complètes avant génération du PDF...");
    return;
  }

    const doc = new jsPDF();

    // 🏫 Ajout de l'en-tête
    doc.setFontSize(12);
    doc.text("Thiès", 10, 10);
    doc.text("Touba Toul", 10, 15);
    doc.text("Lycée Touba de toul", 10, 20);
    doc.text("2018-2019", 160, 10);
    doc.text("1er Semestre", 160, 15);
    
    doc.setFontSize(14);
    doc.text("BULLETIN DE NOTES", 70, 30);

    // 🔍 Informations de l'élève
    doc.setFontSize(12);
    doc.text(`Prénom(s) : ${eleve.prenom || 'N/A'}`, 10, 40);
    doc.text(`Nom : ${eleve.nom || 'N/A'}`, 100, 40);
    doc.text(`Né(e) le : ${eleve.date_naissance || 'N/A'}`, 10, 50);
    doc.text(`Classe : ${eleve.nom_classe || 'N/A'}`, 100, 50);
    doc.text(`Matricule : ${eleve.matricule || 'N/A'}`, 10, 60);
    doc.text(`Nbre d'élèves : ${eleve.nb_eleves || 'N/A'}`, 100, 60);

    // 🏅 Calcul du rang pour chaque matière
    notes.forEach(note => {
        note.moyenne = ((parseFloat(note.devoir1) + parseFloat(note.devoir2) + parseFloat(note.composition)) / 3).toFixed(2);
        note.moyX = (parseFloat(note.moyenne) * parseFloat(note.coefficient)).toFixed(2);
    });

    // Trier les notes en fonction de la moyenne pour définir le rang
    let sortedNotes = [...notes].sort((a, b) => parseFloat(b.moyenne) - parseFloat(a.moyenne));

    // Attribution des rangs
    sortedNotes.forEach((note, index) => {
        note.rang = index + 1;
    });

    // Attribution des appréciations
    sortedNotes.forEach(note => {
        const moyX = parseFloat(note.moyenne);
        if (moyX >= 16) note.appreciation = "Très bon travail";
        else if (moyX >= 14) note.appreciation = "Bon travail";
        else if (moyX >= 12) note.appreciation = "A Bien";
        else if (moyX >= 10) note.appreciation = "Moyen";
        else if (moyX >= 8) note.appreciation = "Passable";
        else note.appreciation = "Insuffisant";
    });

    // 📄 Tableau des notes avec rang et appréciations
    autoTable(doc, {
      startY: 70,
      head: [['Discipline', 'Dev 1', 'Dev 2', 'Comp', 'Moy/20', 'Coef', 'Moy x', 'T.H', 'Rang', 'Appréciations']],
      body: notes.map(note => [
        note.matiere_nom,
        note.devoir1,
        note.devoir2,
        note.composition,
        note.moyenne,
        note.coefficient,
        note.moyX,
        "T.H",
        note.rang,
        note.appreciation
      ]),
    });

    // 📊 Calcul de la moyenne générale
    let totalMoyenne = 0;
    let totalCoef = 0;
    notes.forEach(note => {
      totalMoyenne += parseFloat(note.moyenne) * parseFloat(note.coefficient);
      totalCoef += parseFloat(note.coefficient);
    });
    let moyenneGenerale = totalCoef ? (totalMoyenne / totalCoef).toFixed(2) : "N/A";


    // Ajouter la moyenne générale
    // autoTable(doc, {
    //   startY: doc.lastAutoTable.finalY + 10,
    //   body: [['Moyenne Générale', this.eleve.moyenne_generale.toFixed(2)]]
    // });

    // calculerRang(listeEleves) {
    //   let rangs = new Map(); // Stocker le rang par moyenne
    //   let rangActuel = 1;

    //   listeEleves.forEach((eleve, index) => {
    //     if (!rangs.has(eleve.moyenne_generale)) {
    //       rangs.set(eleve.moyenne_generale, rangActuel);
    //     }
    //     rangActuel++;
    //   });

    //   return listeEleves.map(eleve => ({
    //     ...eleve,
    //     rang: rangs.get(eleve.moyenne_generale)
    //   }));
    // }

    /*
     // 🌍 Calcul du rang global de l'élève en fonction de la moyenne générale
     const notesMoyennes = this.notes.map(note => {
      const moyenne = (parseFloat(note.devoir1) + parseFloat(note.devoir2) + parseFloat(note.composition)) / 3;
      return { eleveId: note.eleve_id, moyenne };
    });
    
    // Trier les élèves par moyenne
    notesMoyennes.sort((a, b) => b.moyenne - a.moyenne);
    
    // Trouver le rang de l'élève
    const rang = notesMoyennes.findIndex(n => n.eleveId === this.selectedEleveId) + 1;
    this.eleve.rang = rang || 'N/A';
    */

    doc.text(`TOTAL`, 10, (doc as any).lastAutoTable.finalY + 10);
    doc.text(`Moyenne Générale : ${moyenneGenerale}/20`, 10, (doc as any).lastAutoTable.finalY + 20);
    doc.text(`Rang : ${eleve.rang || 'N/A'}`, 100, (doc as any).lastAutoTable.finalY + 20);
    doc.text(`Retards : ${eleve.retards || 'N/A'}`, 10, (doc as any).lastAutoTable.finalY + 30);
    doc.text(`Absences : ${eleve.absences || 'N/A'}`, 100, (doc as any).lastAutoTable.finalY + 30);

    // 🏆 Observations et signatures
    doc.text(`Observations du conseil des professeurs :`, 10, (doc as any).lastAutoTable.finalY + 50);
    doc.text(`Signature du chef d'établissement`, 140, (doc as any).lastAutoTable.finalY + 80);

    // 📌 Génération du fichier PDF
    doc.save(`Bulletin_${eleve.prenom}_${eleve.nom}.pdf`);
  }


  generateBulletinSecond(eleve: any, notes: any[]) {
    const doc = new jsPDF();

    // 🏫 Ajout du Logo et de l'Entête
    doc.setFontSize(12);
    doc.text("République du Sénégal", 80, 10);
    doc.text("Ministère de l'Éducation Nationale", 65, 15);
    doc.text("Académie de Dakar", 80, 20);
    doc.text("École: Lycée Scientifique", 80, 25);
    doc.setFontSize(14);
    doc.text("BULLETIN DE NOTES", 80, 35);

    // ℹ️ Infos de l’élève
    doc.setFontSize(12);
    doc.text(`Prénom(s) : ${eleve.prenom}`, 10, 45);
    doc.text(`Nom : ${eleve.nom}`, 100, 45);
    doc.text(`Né(e) le : ${eleve.date_naissance}`, 10, 52);
    doc.text(`Classe : ${eleve.classe}`, 100, 52);
    doc.text(`Matricule : ${eleve.matricule}`, 10, 59);
    
    // 📊 Tableau des Notes
    autoTable(doc, {
      startY: 65,
      head: [['Discipline', 'Devoir 1', 'Devoir 2', 'Composition', 'Coef', 'Moyenne']],
      body: notes.map(note => [
        note.matiere,
        note.devoir1 || "-",
        note.devoir2 || "-",
        note.composition || "-",
        note.coefficient || "-",
        ((parseFloat(note.devoir1 || "0") + parseFloat(note.devoir2 || "0") + parseFloat(note.composition || "0")) / 3).toFixed(2)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 112, 192] },
    });

    // let lastY = doc.lastAutoTable.finalY + 10;
    let lastY = (doc as any).lastAutoTable.finalY + 10;

    // 📌 Calcul de la moyenne générale
    let totalMoyenne = 0, totalCoef = 0;
    notes.forEach(note => {
      const moyenneMatiere = (parseFloat(note.devoir1 || "0") + parseFloat(note.devoir2 || "0") + parseFloat(note.composition || "0")) / 3;
      totalMoyenne += moyenneMatiere * parseFloat(note.coefficient || "1");
      totalCoef += parseFloat(note.coefficient || "1");
    });

    let moyenneGenerale = totalCoef ? (totalMoyenne / totalCoef).toFixed(2) : "N/A";

    doc.setFontSize(12);
    doc.text(`Moyenne Générale : ${moyenneGenerale}/20`, 10, lastY);

    // 🔍 Observations
    let mention = "Aucune remarque";
    if (parseFloat(moyenneGenerale) >= 16) mention = "Très Bien";
    else if (parseFloat(moyenneGenerale) >= 14) mention = "Bien";
    else if (parseFloat(moyenneGenerale) >= 12) mention = "Assez Bien";
    else if (parseFloat(moyenneGenerale) >= 10) mention = "Passable";
    else mention = "Insuffisant";

    doc.text(`Appréciation : ${mention}`, 10, lastY + 10);
    doc.text(`Décision du conseil de classe : ${parseFloat(moyenneGenerale) >= 10 ? "Admis" : "Redoublement"}`, 10, lastY + 20);

    // ✍️ Signatures
    doc.text("Signature du Professeur Principal", 10, lastY + 40);
    doc.text("Signature du Directeur", 140, lastY + 40);

    // 📥 Téléchargement
    doc.save(`Bulletin_${eleve.nom}_${eleve.prenom}.pdf`);
  }



}
