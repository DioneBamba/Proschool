import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AjoutEleveComponent } from "./eleves/ajout-eleve/ajout-eleve.component"
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proSchool';

  constructor(public authService: AuthService) {}

  // username: string = ''; // Remplace par un service d'authentification pour un utilisateur dynamique
  username: { prenom: string, nom: string } | null = null;
  currentDate: Date = new Date();

  // logout() {
  //   // Logique de déconnexion
  //   console.log('Déconnexion...');
  // }
}
