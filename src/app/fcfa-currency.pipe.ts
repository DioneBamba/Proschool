import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fcfaCurrency',
  standalone: true
})
export class FcfaCurrencyPipe implements PipeTransform {

  // transform(value: any): string {
  //   if (value == null) return '';
  //   return `${value.toFixed(0)} Fcfa`;
  // }
    
    transform(value: any): string {
      // Vérifie que la valeur est un nombre valide
      if (value == null || isNaN(value)) {
        return 'Non disponible';  // Retourne un message par défaut si la valeur est invalide
      }
      return `${value.toFixed(0)} Fcfa`;  // Formate la valeur et ajoute "Fcfa"
    }

}
