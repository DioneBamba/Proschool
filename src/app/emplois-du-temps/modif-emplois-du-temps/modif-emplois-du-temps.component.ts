import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { EmploisDuTempsService } from '../../services/emplois-du-temps.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modif-emplois-du-temps',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
],
  templateUrl: './modif-emplois-du-temps.component.html',
  styleUrl: './modif-emplois-du-temps.component.css'
})
export class ModifEmploisDuTempsComponent implements OnInit {
  emploiForm: FormGroup;
  emploiId!: number;
  heures: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  classes: any[] = [];
  matieres: any[] = [];
  selectedClasse: any;
  emploiTemps: { [key: string]: { [key: string]: any } } = {};

  constructor(
    private emploiService: EmploisDuTempsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.emploiForm = this.fb.group({
      classe_id: ['', Validators.required],
      jour: ['', Validators.required],
      heure: ['', Validators.required],
      matiere_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    


    this.emploiId = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerEmplois();
  }

  chargerEmplois() {
    this.emploiService.getEmploisById(this.emploiId).subscribe(data => {
      this.emploiForm.patchValue(data);
    });
  }

  modifierEmplois() {
    if (this.emploiForm.valid) {
      this.emploiService.modifierEmplois(this.emploiId, this.emploiForm.value).subscribe(() => {
        this.router.navigate(['/emplois-du-temps']);
      });
    }
  }
}
