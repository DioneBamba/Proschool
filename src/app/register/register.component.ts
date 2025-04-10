import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AnneeScolaireService } from '../services/annee-scolaire.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    RouterModule,
    CommonModule,
   
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  // nom = '';
  // prenom = '';
  // email = '';
  // password = '';
  // role = 'eleve';
  registerForm!: FormGroup;
    anneesScolaires: any[] = [];
    anneeScolaireId!: number;
    anneeScolaireLibelle!: string;

  constructor(
    private authService: AuthService, 
    private anneeService: AnneeScolaireService,
        private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialisation du formulaire avec FormGroup et FormControl
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['admin', Validators.required]
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
  }

  // register(): void {
  //   const user = { nom: this.nom, prenom: this.prenom, email: this.email, password: this.password, role: this.role };
  //   console.log('Données envoyées :', user); // Vérifie les valeurs avant envoi

  //   this.authService.register(user).subscribe(
  //     () => {
  //       alert('Inscription réussie');
  //       this.router.navigate(['/login']);
  //     },
  //     () => {
  //       alert('Erreur d’inscription');
  //     }
  //   );
  // }

  register(): void {
    if (this.registerForm.invalid) {
      alert("Veuillez remplir correctement le formulaire !");
      return;
    }

    const user = this.registerForm.value;
    console.log('🔹 Données envoyées :', user); // Vérifie les valeurs avant envoi

    this.authService.register(user).subscribe(
      () => {
        alert('✅ Inscription réussie !');
        this.router.navigate(['/login']);
      },
      () => {
        alert('❌ Erreur lors de l’inscription !');
      }
    );
  }

}
