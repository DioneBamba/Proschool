import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { authGuard } from './app/guards/auth.guard';
import { EleveDashboardComponent } from './app/eleve-dashboard/eleve-dashboard.component';
import { EnseignantDashboardComponent } from './app/enseignant-dashboard/enseignant-dashboard.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { DetailsRechercheComponent } from './app/details-recherche/details-recherche.component';
import { AjoutEleveComponent } from './app/eleves/ajout-eleve/ajout-eleve.component';
import { ElevesComponent } from './app/eleves/eleves.component';
import { ModifEleveComponent } from './app/eleves/modif-eleve/modif-eleve.component';
import { AbsencesComponent } from './app/absences/absences.component';
import { AjoutAbsenceComponent } from './app/absences/ajout-absence/ajout-absence.component';
import { ModifAbsenceComponent } from './app/absences/modif-absence/modif-absence.component';
import { BulletinsComponent } from './app/bulletins/bulletins.component';
import { AjoutClasseComponent } from './app/classes/ajout-classe/ajout-classe.component';
import { ClassesComponent } from './app/classes/classes.component';
import { ModifClasseComponent } from './app/classes/modif-classe/modif-classe.component';
import { AjoutEmargementComponent } from './app/emargements/ajout-emargement/ajout-emargement.component';
import { EmargementsComponent } from './app/emargements/emargements.component';
import { ModifEmargementComponent } from './app/emargements/modif-emargement/modif-emargement.component';
import { AjoutEmploisDuTempsComponent } from './app/emplois-du-temps/ajout-emplois-du-temps/ajout-emplois-du-temps.component';
import { EmploisDuTempsComponent } from './app/emplois-du-temps/emplois-du-temps.component';
import { ModifEmploisDuTempsComponent } from './app/emplois-du-temps/modif-emplois-du-temps/modif-emplois-du-temps.component';
import { AjoutEnseignantComponent } from './app/enseignants/ajout-enseignant/ajout-enseignant.component';
import { EnseignantsComponent } from './app/enseignants/enseignants.component';
import { ModifEnseignantComponent } from './app/enseignants/modif-enseignant/modif-enseignant.component';
import { AjoutMatiereComponent } from './app/matieres/ajout-matiere/ajout-matiere.component';
import { MatieresComponent } from './app/matieres/matieres.component';
import { ModifMatiereComponent } from './app/matieres/modif-matiere/modif-matiere.component';
import { AjoutNoteComponent } from './app/notes/ajout-note/ajout-note.component';
import { ModifNoteComponent } from './app/notes/modif-note/modif-note.component';
import { NotesComponent } from './app/notes/notes.component';
import { AjoutScolariteComponent } from './app/scolarites/ajout-scolarite/ajout-scolarite.component';
import { ModifScolariteComponent } from './app/scolarites/modif-scolarite/modif-scolarite.component';
import { ScolaritesComponent } from './app/scolarites/scolarites.component';




const routes: Routes = [
  { path: 'eleves', component: ElevesComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'ajout-eleve', component: AjoutEleveComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-eleve/:id', component: ModifEleveComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'enseignants', component: EnseignantsComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'ajout-enseignant', component: AjoutEnseignantComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-enseignant/:id', component: ModifEnseignantComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'classes', component: ClassesComponent, canActivate: [authGuard], data: { roles: ['admin','enseignant'] }  },
  { path: 'ajout-classe', component: AjoutClasseComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-classe/:id', component: ModifClasseComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'matieres', component: MatieresComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'ajout-matiere', component: AjoutMatiereComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-matiere/:id', component: ModifMatiereComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'emargements', component: EmargementsComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'ajout-emargement', component: AjoutEmargementComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'modif-emargement/:id', component: ModifEmargementComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },

  { path: 'emplois-du-temps', component: EmploisDuTempsComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant', 'Eleve'] }  },
  { path: 'ajout-emplois-du-temps', component: AjoutEmploisDuTempsComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-emplois-du-temps/:id', component: ModifEmploisDuTempsComponent, canActivate: [authGuard], data: { roles: ['Admin'] }  },
  // { path: 'details-emplois-du-temps', component: DetailsEmploisDuTempsComponent },

  { path: 'absences', component: AbsencesComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'ajout-absence', component: AjoutAbsenceComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'modif-absence/:id', component: ModifAbsenceComponent, canActivate: [authGuard], data: { roles: ['admin', 'Enseignant'] }  },

  { path: 'notes', component: NotesComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] }  },
  { path: 'ajout-note', component: AjoutNoteComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-note/:id', component: ModifNoteComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'scolarites', component: ScolaritesComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'ajout-scolarite', component: AjoutScolariteComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'modif-scolarite/:id', component: ModifScolariteComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },
  { path: 'bulletins/:id', component: BulletinsComponent, canActivate: [authGuard], data: { roles: ['admin'] }  },

  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'enseignant-dashboard', component: EnseignantDashboardComponent, canActivate: [authGuard], data: { roles: ['enseignant'] }},
  { path: 'eleve-dashboard', component: EleveDashboardComponent, canActivate: [authGuard], data: { roles: ['eleve'] }},
  { path: 'register', component: RegisterComponent },
  { path: 'details-recherche/:id/:type', component: DetailsRechercheComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] } },

  { path: '**', redirectTo: 'login' }, // Gérer les routes inexistantes
  { path: 'login', component: LoginComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    
    
  ]
}).catch(err => console.error(err));
console.log("🌍 Application chargée :", new Date());