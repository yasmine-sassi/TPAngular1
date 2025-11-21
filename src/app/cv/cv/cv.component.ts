import { Component } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent {
  cvs$: Observable<Cv[]>;            
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService,
    private router: Router
  ) {
    this.cvs$ = this.cvService.getCvs().pipe(
      catchError((error) => {
        this.toastr.error(`
          Attention !! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.
        `);
        return of(this.cvService.getFakeCvs());
      })
    );

    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }

  // Navigate to detail view - this will update the child route
  selectCv(cv: Cv) {
    this.router.navigate(['/cv', cv.id]);
  }
}