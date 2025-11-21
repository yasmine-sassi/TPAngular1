import { Component, OnInit } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent implements OnInit {
  cv$: Observable<Cv | null>;

  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    this.cv$ = of(null);
  }

  ngOnInit() {
    this.cv$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.cvService.getCvById(id).pipe(
          catchError((error) => {
            this.toastr.error('CV non trouvé.');
            return of(null);
          })
        );
      })
    );
  }

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        // Navigate back to just the list (remove the ID from URL)
        this.router.navigate(['/cv']);
      },
      error: () => {
        this.toastr.error(`Problème avec le serveur veuillez contacter l'admin`);
      },
    });
  }
}