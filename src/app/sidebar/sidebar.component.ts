import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // this.role = localStorage.getItem('role'); // Récupère le rôle stocké
     // 🔹 Écoute les changements de l'utilisateur connecté
    this.authService.user$.subscribe(user => {
      this.role = user?.role || null;
    });
  }

  logout() {
    // localStorage.clear();
    // window.location.href = '/login'; // Redirige après déconnexion
    this.authService.logout();
    this.role = null; // Supprime le rôle après la déconnexion
  }
}