import { Component, inject, signal } from "@angular/core";
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";

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
        AutocompleteComponent,
    ],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);

  // ✅ SIGNAL pour le terme de recherche
  searchTerm = signal<string>('');
  
  // Liste complète des CVs
  allCvs: Cv[] = [];
  
  // ✅ Liste filtrée basée sur le searchTerm
  filteredCvs = signal<Cv[]>([]);
  
  selectedCv: Cv | null = null;
  date = new Date();

  constructor(...args: unknown[]);

  constructor() {
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.allCvs = cvs;
        this.filteredCvs.set(cvs); // ✅ Initialiser avec tous les CVs
      },
      error: () => {
        this.allCvs = this.cvService.getFakeCvs();
        this.filteredCvs.set(this.allCvs); // ✅ Initialiser avec tous les CVs
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    this.cvService.selectCv$.subscribe((cv) => (this.selectedCv = cv));
  }

  // ✅ MÉTHODE POUR FILTRER LA LISTE PRINCIPALE
  onSearchTermChanged(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    
    if (!searchTerm || searchTerm.length < 2) {
      this.filteredCvs.set(this.allCvs); // ✅ Afficher tous les CVs si recherche vide
    } else {
      // ✅ Filtrer la liste principale
      const filtered = this.allCvs.filter(cv => 
        cv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.firstname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.filteredCvs.set(filtered);
    }
  }

  // ✅ MÉTHODE POUR SÉLECTIONNER UN CV (sans vider la recherche)
  onCvSelected(cv: Cv) {
    this.selectedCv = cv;
    this.cvService.selectCv(cv);
    // ✅ NE PAS VIDER LA RECHERCHE - la liste filtrée reste visible
  }
}