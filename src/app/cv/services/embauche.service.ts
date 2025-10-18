import { Injectable , signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  private embauchees = signal<Cv[]>([]);

  constructor() {}

  /**
   *
   * Retourne la liste des embauchees
   *
   * @returns CV[]
   *
   */
  getEmbauchees(){
    return this.embauchees.asReadonly();
  }

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    const index = this.embauchees().findIndex((c) => c.id === cv.id);
    if (index === -1) {
      this.embauchees.set([...this.embauchees(), cv]);
      return true;
    }
    return false;
  }
}
