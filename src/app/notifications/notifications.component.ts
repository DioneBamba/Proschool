import { Component, OnInit } from '@angular/core';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notificationForm!: FormGroup;
  notifications: any[] = [];
  user: any;
  message = '';
  cible = 'tous';
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;
  lastNotificationId: number | null = null;
  messageComplet: string = '';

  constructor(
    private notifService: NotificationService, 
    public anneeService: AnneeScolaireService,
    private fb: FormBuilder, 
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    this.notificationForm = this.fb.group({
      message: ['', Validators.required],
      cible: ['tous', Validators.required],
    });

    this.anneeService.getAnneesScolaires().subscribe((annees) => {
      this.anneesScolaires = annees;
      const anneeActuelle = this.anneeService.getAnneeActuelle();
      if (!anneeActuelle && annees.length > 0) {
        this.anneeScolaireId = annees[0].id;
        this.anneeService.setAnneeActuelle(this.anneeScolaireId);
      }
      this.loadNotifications(); // On charge les notifs une fois les années scolaires chargées
    });
  }

  loadNotifications() {
    const role = this.user?.role || 'tous';
    const anneeId = this.anneeService.getAnneeActuelle();
    console.log('Chargement notifications pour rôle:', role, 'année:', anneeId);
    
    this.notifService.getNotifications(role).subscribe((data: any) => {
    console.log('Résultat des notifications:', data);
      // this.notifications = data.notifications;
      this.notifications = Array.isArray(data.notifications) ? data.notifications : [];
      
       // Stocke l'ID de la dernière notification
      if (this.notifications.length > 0) {
        this.lastNotificationId = this.notifications[0].id;
      }


    });
  }
  
  sendNotification() {
    if (!this.message || !this.message.trim()) return;

    const notif = {
      user_id: this.user.id,
      message: this.message,
      cible: this.cible,
      annee_scolaire_id: this.anneeService.getAnneeActuelle()
    };

    this.notifService.ajouterNotification(notif).subscribe({
      next: () => {
        this.message = '';
        this.cible = 'tous';
        this.loadNotifications();
      },
      error: (err) => {
        console.error('Erreur d\'enregistrement de la notification :', err);
      }
    });
    console.log('Notification envoyée:', notif);
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
}