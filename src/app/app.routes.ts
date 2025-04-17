import { Routes } from '@angular/router';
import { ElevesComponent } from './eleves/eleves.component';
import { EnseignantsComponent } from './enseignants/enseignants.component';
import { AbsencesComponent } from './absences/absences.component';
import { EmploisDuTempsComponent } from './emplois-du-temps/emplois-du-temps.component';
import { PaiementsComponent } from './paiements/paiements.component';
import { authGuard } from './guards/auth.guard';
// import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ScolaritesComponent } from './scolarites/scolarites.component';
import { EmargementsComponent } from './emargements/emargements.component';
import { ClassesComponent } from './classes/classes.component';
import { AjoutEleveComponent } from './eleves/ajout-eleve/ajout-eleve.component';
import { ModifEleveComponent } from './eleves/modif-eleve/modif-eleve.component';
import { AjoutClasseComponent } from './classes/ajout-classe/ajout-classe.component';
import { ModifClasseComponent } from './classes/modif-classe/modif-classe.component';
import { ModifMatiereComponent } from './matieres/modif-matiere/modif-matiere.component';
import { AjoutMatiereComponent } from './matieres/ajout-matiere/ajout-matiere.component';
import { MatieresComponent } from './matieres/matieres.component';
import { AjoutEnseignantComponent } from './enseignants/ajout-enseignant/ajout-enseignant.component';
import { ModifEnseignantComponent } from './enseignants/modif-enseignant/modif-enseignant.component';
import { AjoutEmploisDuTempsComponent } from './emplois-du-temps/ajout-emplois-du-temps/ajout-emplois-du-temps.component';
import { ModifEmploisDuTempsComponent } from './emplois-du-temps/modif-emplois-du-temps/modif-emplois-du-temps.component';
import { ModifAbsenceComponent } from './absences/modif-absence/modif-absence.component';
import { AjoutAbsenceComponent } from './absences/ajout-absence/ajout-absence.component';
import { NotesComponent } from './notes/notes.component';
import { AjoutNoteComponent } from './notes/ajout-note/ajout-note.component';
import { ModifNoteComponent } from './notes/modif-note/modif-note.component';
import { AjoutScolariteComponent } from './scolarites/ajout-scolarite/ajout-scolarite.component';
import { ModifScolariteComponent } from './scolarites/modif-scolarite/modif-scolarite.component';
import { DetailsEmploisDuTempsComponent } from './emplois-du-temps/details-emplois-du-temps/details-emplois-du-temps.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { EleveDashboardComponent } from './eleve-dashboard/eleve-dashboard.component';
import { EnseignantDashboardComponent } from './enseignant-dashboard/enseignant-dashboard.component';
import { AjoutEmargementComponent } from './emargements/ajout-emargement/ajout-emargement.component';
import { ModifEmargementComponent } from './emargements/modif-emargement/modif-emargement.component';
import { BulletinsComponent } from './bulletins/bulletins.component';
import { DetailsRechercheComponent } from './details-recherche/details-recherche.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant', 'eleve'] }},
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
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: 'login' }, // Gérer les routes inexistantes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'enseignant-dashboard', component: EnseignantDashboardComponent, canActivate: [authGuard], data: { roles: ['enseignant'] }},
  { path: 'eleve-dashboard', component: EleveDashboardComponent, canActivate: [authGuard], data: { roles: ['eleve'] }},

  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant','eleve'] }},

  { path: 'unauthorized', component: UnauthorizedComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' }
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'details-recherche/:id/:type', component: DetailsRechercheComponent, canActivate: [authGuard], data: { roles: ['admin', 'enseignant'] } }
];
