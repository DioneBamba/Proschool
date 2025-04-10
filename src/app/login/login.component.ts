import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  // email = '';
  // password = '';
  loginForm!: FormGroup;
  anneesScolaires: any[] = [];
  anneeScolaireId!: number;
  anneeScolaireLibelle!: string;

  constructor(
    private anneeService: AnneeScolaireService,
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit (): void {

    // Initialisation du formulaire avec FormGroup et FormControl
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

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
      
    

    setTimeout(() => {
      console.log("🔄 Vérification après redirection");
      console.log("Token dans localStorage:", localStorage.getItem('token'));
      console.log("Rôle dans localStorage:", localStorage.getItem('role'));
    }, 3000);
  }
  
  login(): void {
    if (this.loginForm.invalid) {
      alert('Veuillez remplir correctement le formulaire');
      return;
    }

    const { email, password } = this.loginForm.value;
    
    this.authService.login({ email, password }).subscribe(
      (response: any) => {
        console.log("Réponse de l'API :", response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role); 
          console.log("Rôle enregistré :", localStorage.getItem('role'));
          console.log("✅ Connexion réussie :", localStorage.getItem('token'));
          
          const redirection = response.user.role === 'admin' ? '/admin-dashboard' :
                              response.user.role === 'enseignant' ? '/enseignant-dashboard' :
                              '/eleve-dashboard';
          
          this.router.navigate([redirection]);
        } else {
          alert('Échec de la connexion');
        }
      },
      (error) => {
        alert('Identifiants incorrects');
      }
    );
  }


}
