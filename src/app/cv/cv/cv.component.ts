import { Component } from '@angular/core';
import { Cv } from '../model/cv';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent {
  cvs$: Observable<Cv[]> = this.cvService.getCvs().pipe(
    catchError((error) => {
      this.toastr.error(`
          Attention !! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.
        `);
      return of(this.cvService.getFakeCvs()); // fallback data
    })
  );
  selectedCv$ = this.cvService.selectCv$;
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    // Use async pipe in template instead of subscribe

    // Logs / info
    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }

  // Called when a CV is selected from ListComponent
  selectCv(cv: Cv) {
    this.cvService.selectCv(cv);
  }
}
