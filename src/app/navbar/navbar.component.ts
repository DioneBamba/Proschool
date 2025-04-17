import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RechercheService } from '../services/recherche.service';
import { AuthService } from '../services/auth.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  // @Input() username: { prenom: string, nom: string } | null = null;
  @Input() username: { id: number, prenom: string, nom: string, role?: string } | null = null;
  currentDate: Date = new Date(); 
  searchText: string = '';
  role: string | null = '';

  searchQuery = '';
  searchResults: any[] = [];
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  notifications: any[] = [];
  messageComplet: string = '';
  unreadCount: number = 0;

  constructor(
  private rechercheService: RechercheService, 
  private router: Router, 
  private authService: AuthService,
  private anneeService: AnneeScolaireService,
  private notifService: NotificationService
  ) {}

  ngOnInit() {
    // this.role = localStorage.getItem('role'); // Récupère le rôle
    // const userData = localStorage.getItem('user'); // Récupérer l'utilisateur depuis le localStorage
    // console.log('🔄 Vérification du token :', localStorage.getItem('token'));
    // console.log('🔄 Vérification du rôle :', localStorage.getItem('role'));
    // console.log("🔍 Données récupérées du localStorage :", userData);

    // 🧠 Récupère les infos utilisateur depuis le localStorage/sessionStorage au démarrage
    this.role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    this.username = userData ? JSON.parse(userData) : null;
    // if (userData) {
    //   // this.username = JSON.parse(userData); // Convertir la chaîne JSON en objet
    //   this.username = userData ? JSON.parse(userData) : null;
    //   console.log("📌 Utilisateur après initialisation :", this.username);
    // }

    // 👁️‍🗨️ Met à jour dynamiquement si AuthService émet un nouvel utilisateur
    this.authService.user$.subscribe(user => {
      this.username = user;
      this.role = user.role;
    });

     // Vérifie si l'utilisateur est toujours authentifié
     // 🧼 Si l'utilisateur n'est pas authentifié, nettoyer les données
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

    // 🔄 Vérifie expiration de session
    const expiration = localStorage.getItem('sessionExpiration');
    if (expiration && new Date().getTime() > parseInt(expiration)) {
      console.log("🕒 Session expirée, suppression des données.");
      localStorage.clear();
      this.role = null;
      this.username = null;
    }

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

    // setInterval(() => {
    //   this.currentDate = new Date();
    // }, 1000);

    // this.notifService.getNotifications(this.authService.getCurrentUser().role).subscribe((data: any) => {
    //   this.notifications = Array.isArray(data.notifications) ? data.notifications : [];
    // });

    // this.loadNotifications();

    this.currentDate = new Date();

    // 🔔 Charge les notifications au démarrage
    this.chargerNotifications();

    // setInterval(() => {
    //   this.currentDate = new Date(); // mise à jour de l'heure
  
    //   // mise à jour des notifications toutes les 30 secondes
    //   const now = new Date();
    //   if (now.getSeconds() % 30 === 0) {
    //     this.loadNotifications();
    //   }
    // }, 1000);

    // Récupérer les notifs toutes les 10s // ⏱️ Rafraîchit les notifications toutes les 10 secondes
    setInterval(() => {
      console.log("🔄 Vérification périodique des notifications...");
      this.chargerNotifications();
      
    }, 10000); // toutes les 10 secondes
  }

  /*
  loadNotifications() {
    this.notifService.getNotifications(this.role).subscribe(data => {
      this.notifications = data || [];
    });
  }
  */

  // loadNotifications() {
  //   this.notifService.getNotifications(this.authService.getCurrentUser().role).subscribe((data: any) => {
  //     this.notifications = Array.isArray(data.notifications) ? data.notifications : [];
  //   });
  // }

  // loadNotifications() {
  //   const currentUser = this.authService.getCurrentUser();
  //   this.notifService.getNotifications(currentUser.role).subscribe((data: any) => {
  //     const notifs = Array.isArray(data.notifications) ? data.notifications : [];
  //     this.notifications = notifs.filter((n: any) => n.destinataire === currentUser.id);
  //   });
  // }

  /*
  loadNotifications() {
    const currentUser = this.username ?? this.authService.getCurrentUser();
  
    if (!currentUser || !currentUser.role || !currentUser.id) {
      console.warn("❗ Utilisateur ou rôle manquant lors du chargement des notifications.");
      return;
    }
  
    // 📥 Récupère toutes les notifications et filtre celles du destinataire actuel
    this.notifService.getNotifications(currentUser.role).subscribe((data: any) => {
      const notifs = Array.isArray(data.notifications) ? data.notifications : [];
      this.notifications = notifs.filter((n: any) => n.destinataire === currentUser.id);
    });
  }
  */

  // loadNotifications() {
  //   const currentUser = this.username ?? this.authService.getCurrentUser();
  //   const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  //   const user = storedUser ? JSON.parse(storedUser) : currentUser;
  
  //   if (!user || !user.role || !user.id) {
  //     console.warn("❗ Utilisateur invalide ou rôle manquant lors du chargement des notifications.");
  //     return;
  //   }
  
  //   this.notifService.getNotifications(user.role).subscribe((data: any) => {
  //     const notifs = Array.isArray(data.notifications) ? data.notifications : [];
  
  //     // 👇 On filtre les notifs destinées à l'utilisateur connecté
  //     this.notifications = notifs.filter((n: any) => n.destinataire === user.id);
  
  //     // 👇 On calcule les non lues
  //     this.unreadCount = this.notifications.filter((n: any) => n.lue === 0).length;
  
  //     console.log("🔔 Total notifications non lues :", this.unreadCount);
  //   }, error => {
  //     console.error("❌ Erreur lors du chargement des notifications :", error);
  //   });
  // }

  chargerNotifications() {
    if (!this.role || !this.username) return;

    this.notifService.getNotifications(this.role).subscribe((data) => {
      // Filtrer les notifications destinées à cet utilisateur
      const notificationsUtilisateur = data.filter(n => n.destinataire == this.username?.id);
      
      this.notifications = notificationsUtilisateur;

      // Badge : compte des non lues
      this.unreadCount = this.notifications.filter(n => n.lue == 0).length;

      console.log("🔔 Notifications pour cet utilisateur :", this.notifications);
      console.log("📬 Notifications non lues :", this.unreadCount);
    });
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

  // hasUnread(): boolean {
  //   return this.notifications.some(n => !n.lue);
  // }

  hasUnread(): boolean {
    if (!this.username || !this.username.id) return false;
    return this.notifications.some(n => !n.lue && n.destinataire === this.username?.id);
  }

  afficherMessageComplet(notification: any) {
    this.messageComplet = notification.message;

    // Marquer comme lue si ce n'est pas encore fait
    if (!notification.lue) {
      this.notifService.marquerCommeLue(notification.id).subscribe(() => {
        notification.lue = true; // Mettre à jour localement
      });
    }

    const modal = new (window as any).bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
  }

  formatMessage(message: string): string {
    // Ajoute des sauts de ligne propres, gestion des titres et sections
    return message
      .replace(/\n/g, '<br>') // Convertit les sauts de ligne en <br>
      .replace(/(\*.+?\*):/g, '<strong>$1</strong>:') // met en gras les titres entre *
      .replace(/(Tableau de bord|Menu latéral|Options en haut à droite)/gi, '<h6 class="mt-3 text-primary">$1</h6>'); // Mise en évidence
  }

  // marquerCommeLue(id: number) {
  //   this.notifService.marquerCommeLue(id).subscribe(() => {
  //     const notif = this.notifications.find(n => n.id === id);
  //     if (notif) notif.lue = 1;
  
  //     // Recharger proprement les notifications à jour
  //     this.loadNotifications();
  //   });
  // }

  marquerCommeLue(notificationId: number) {
    this.notifService.marquerCommeLue(notificationId).subscribe(() => {
      // ✅ Met à jour localement pour éviter de recharger depuis l'API
      const notif = this.notifications.find(n => n.id === notificationId);
      if (notif) {
        notif.lue = 1;
      }
  
      // 🧮 Recalcule les non lues pour le badge
      this.unreadCount = this.notifications.filter(n => n.lue == 0).length;
    }, error => {
      console.error("❌ Erreur lors du marquage comme lue :", error);
    });
  }
  
  
}