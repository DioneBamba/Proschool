import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmploisDuTempsService } from '../../services/emplois-du-temps.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-emplois-du-temps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './details-emplois-du-temps.component.html',
  styleUrl: './details-emplois-du-temps.component.css'
})
export class DetailsEmploisDuTempsComponent implements OnInit {
  emplois: any = {};
  selectedClasse!: number;
  classes: any[] = [];
  matieres: any[] = [];
  heures: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private emploiService: EmploisDuTempsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const emploiTempsId = this.route.snapshot.paramMap.get('id');
    if (emploiTempsId) {
      this.chargerEmploiTemps(emploiTempsId);
    }
  }

  chargerEmploiTemps(id: string) {
    this.emploiService.getEmploisById(Number(id)).subscribe((data) => {
      this.emplois = data;
    });
  }

  retournerEmplois() {
    console.log("Retourner à la modification de l'emploi du temps");
  }
}