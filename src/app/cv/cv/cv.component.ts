import { Component, inject, signal, computed, effect } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  standalone: true,
  imports: [
    ListComponent,
    CvCardComponent,
    EmbaucheComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  cvs = signal<Cv[]>([]);
  
  selectedCv = toSignal(this.cvService.selectCv$);
  
  date = signal(new Date());
  

  loading = signal(true);
  
  hasError = signal(false);

  constructor() {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    
    // Charger les CVs et mettre à jour le signal
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs.set(cvs);
        this.loading.set(false);
        this.hasError.set(false);
      },
      error: () => {
        this.cvs.set(this.cvService.getFakeCvs());
        this.loading.set(false);
        this.hasError.set(true);
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
  }
}