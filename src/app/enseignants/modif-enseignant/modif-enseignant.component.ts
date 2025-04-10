import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnseignantService } from '../../services/enseignant.service';
import { Observable } from 'rxjs';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';

@Component({
  selector: 'app-modif-enseignant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    
  ],
  templateUrl: './modif-enseignant.component.html',
  styleUrl: './modif-enseignant.component.css'
})
export class ModifEnseignantComponent implements OnInit {
  enseignantForm!: FormGroup;
  anneesScolaires: any[] = [];
  enseignantId!: number;
  idEnseignant: string | null = '';
  anneeScolaireId!: number;

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private route: ActivatedRoute,
    private router: Router,
    private anneeService: AnneeScolaireService
  ) {}

  ngOnInit(): void {
    const annee = this.anneeService.getAnneeActuelle();
        this.anneeScolaireId = annee !== null ? annee : 0;
        
        this.enseignantId = this.route.snapshot.params['id'];
        this.enseignantForm = this.fb.group({
          prenom: ['', Validators.required],
          nom: ['', Validators.required],
          date_naissance: ['', Validators.required],
          lieu_naissance: ['', Validators.required],
          telephone: ['', Validators.required],
          profession: ['', Validators.required],
          annee_scolaire_id: [this.anneeScolaireId, Validators.required]
        });
    
        this.enseignantService.getEnseignantById(this.enseignantId).subscribe(enseignant => {
          this.enseignantForm.patchValue(enseignant);
        });
    
  }
   
  modifierEnseignant(): void {
    console.log('Données envoyées:', this.enseignantForm);
    console.log('ID Enseignant :', this.enseignantId);
    this.enseignantService.modifierEnseignant(Number(this.enseignantId), this.enseignantForm.value).subscribe(
      () => {
        console.log('Données envoyées :', this.enseignantForm.value);

        alert('Enseignant modifiée avec succès');
        this.router.navigate(['/enseignants']);
      },
      (error) => {
        console.error('Erreur lors de la modification', error);
      }
    );
  }

  annuler(): void {
    this.router.navigate(['/enseignants']);
  }

  // modifierEnseignant(): void {
  //   if (this.enseignantForm.invalid) return;
  //   const formData = new FormData();
  //   Object.keys(this.enseignantForm.value).forEach((key) => {
  //     formData.append(key, this.enseignantForm.value[key]);
  //   });
  //   if (this.id) {
  //     formData.append('id', this.id);
  //   }
  //   if (this.id) {
  //     this.enseignantService.modifierEnseignant(this.id, formData).subscribe(
  //       () => {
  //         alert('Enseignant modifié avec succès');
  //         console.log('Données envoyées :', this.id);
  //         formData.forEach((value, key) => console.log(`${key}:`, value));
  //         this.router.navigate(['/enseignants']);
  //       },
  //       (error: any) => console.error('Erreur lors de la modification', error)
        
  //     );
  //   }
  //   console.log('Reponse Backend', FormData);
  // }

  // modifierEnseignant(): void {
  //   if (this.enseignantForm.invalid) return;
  
  //   const formData = new FormData();
    
  //   formData.append('nom', this.enseignantForm.get('nom')?.value || '');
  //   formData.append('prenom', this.enseignantForm.get('prenom')?.value || '');
  //   formData.append('dateNaissance', this.enseignantForm.get('dateNaissance')?.value || '');
  //   formData.append('lieuNaissance', this.enseignantForm.get('lieuNaissance')?.value || '');
  //   formData.append('telephone', this.enseignantForm.get('telephone')?.value || '');
  //   formData.append('profession', this.enseignantForm.get('profession')?.value || '');

  //   // Vérifie si un fichier est bien sélectionné avant de l'ajouter
  //   if (this.selectedFile) {
  //     formData.append('photo', this.selectedFile);
  //   }

  //   console.log('FormData envoyée:');
  //   formData.forEach((value, key) => {
  //     console.log(`${key}: ${value}`);
  //   });

  //   Object.keys(this.enseignantForm.value).forEach((key) => {
  //     formData.append(key, this.enseignantForm.value[key]);
  //   });
  
  //   if (this.file) {
  //     formData.append('photo', this.file);
  //   } else {
  //     // Si aucune photo n'est sélectionnée, garder l'ancienne photo (ou gérer l'absence de photo)
  //     formData.append('photo', this.enseignant.photo || '');
  //   }
  
  //   if (this.id) {
  //     formData.append('id', this.id);  // Assurez-vous que l'ID est bien ajouté
  //   }
  
  //   console.log('FormData envoyée:', formData);  // Afficher ce qui est envoyé
  //   if (!this.id) {
  //     console.error("ID manquant lors de la modification");
  //     return;
  //   }
  
  //   this.enseignantService.modifierEnseignant(this.id!, formData).subscribe(
  //     (response) => {
  //       console.log('Réponse backend:', response);
  //       alert('Enseignant modifié avec succès');
  //       this.router.navigate(['/enseignants']);
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la modification', error);
  //       alert('Erreur lors de la modification de l\'enseignant');
  //     }
  //  );

  //  this.route.paramMap.subscribe(params => {
  //   this.id = params.get('id') ?? ''; // Assigne une chaîne vide si `id` est `null`
  // });

  // }

  // modifierEnseignant() {
  //   const formData = new FormData();
  //   formData.append('nom', this.enseignant.nom);
  //   formData.append('prenom', this.enseignant.prenom);
  //   formData.append('dateNaissance', this.enseignant.dateNaissance || '');
  //   formData.append('lieuNaissance', this.enseignant.lieuNaissance || '');
  //   formData.append('telephone', this.enseignant.telephone);
  //   formData.append('profession', this.enseignant.profession);
    
  //   if (this.selectedFile) {
  //     formData.append('photo', this.selectedFile, this.selectedFile.name);
  //   }
  
  //   this.enseignantService.modifierEnseignant(Number(this.id), formData).subscribe({
  //     next: (response) => {
  //       console.log("Réponse du serveur:", response);
  //       if (response && response.status === 'success') {
  //         console.log('Enseignant modifié avec succès');
  //       } else {
  //         console.log('Erreur lors de la modification');
  //       }
  //     },
  //     error: (error) => {
  //       console.error("Erreur lors de la modification", error);
  //     }
  //   });
  // }

  // resizeImage(file: File): Observable<Blob> {
  //   return new Observable(observer => {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.src = e.target.result;
  
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         const maxWidth = 500;
  //         const maxHeight = 500;
          
  //         let width = img.width;
  //         let height = img.height;
  
  //         // Si l'image est trop large, la redimensionner
  //         if (width > maxWidth) {
  //           height = Math.floor((height * maxWidth) / width);
  //           width = maxWidth;
  //         }
  
  //         if (height > maxHeight) {
  //           width = Math.floor((width * maxHeight) / height);
  //           height = maxHeight;
  //         }
  
  //         canvas.width = width;
  //         canvas.height = height;
  //         ctx?.drawImage(img, 0, 0, width, height);
  
  //         canvas.toBlob((blob: Blob | null) => {
  //           if (blob) {
  //             observer.next(blob);
  //             observer.complete();
  //           }
  //         }, 'image/png');
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }
}



