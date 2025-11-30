// details-cv.component.ts
import { Component, inject, signal, computed, effect } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
  standalone: true,
  imports: [DefaultImagePipe],
})
// details-cv.component.ts - Alternative version
export class DetailsCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  // State signals
  cv = signal<Cv | null>(null);
  loading = signal(true);
  deleting = signal(false);

  ngOnInit() {
    // Subscribe to route changes the traditional way
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      console.log('🔄 Route changed, ID:', id);
      
      if (id) {
        this.loadCv(+id);
      } else {
        this.cv.set(null);
        this.loading.set(false);
      }
    });

    // Initial load
    const initialId = this.activatedRoute.snapshot.params['id'];
    if (initialId && !this.cv()) {
      console.log('🚀 Initial load with ID:', initialId);
      this.loadCv(+initialId);
    }
  }

  private loadCv(id: number) {
    console.log('📡 Loading CV with ID:', id);
    this.loading.set(true);
    this.cv.set(null);

    this.cvService.getCvById(id).subscribe({
      next: (response: any) => {
        console.log('✅ RAW API RESPONSE:', response);
        
        // Map API response to your Cv model
        const cvData: Cv = {
          id: response.id,
          firstname: response.firstname || response.prenom || response.firstName,
          name: response.name || response.nom || response.lastName,
          job: response.job || response.jobTitle || response.position,
          age: response.age,
          cin: response.cin || response.cinNumber,
          path: response.path || response.address || response.location,
        };
        
        console.log('🔄 MAPPED CV DATA:', cvData);
        
        this.cv.set(cvData);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.loading.set(false);
        this.cv.set(null);
        this.toastr.error(`Erreur: ${error.status} - ${error.statusText}`);
      }
    });
  }
  deleteCv(cv: Cv) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${cv.firstname} ${cv.name} ?`)) {
      this.deleting.set(true);
      this.cvService.deleteCvById(cv.id).subscribe({
        next: () => {
          this.toastr.success(`${cv.name} supprimé avec succès`);
          this.router.navigate([APP_ROUTES.cv]);
        },
        error: () => {
          this.deleting.set(false);
          this.toastr.error(`Problème avec le serveur veuillez contacter l'admin`);
        },
      });
    }
  }

  // deleteCv method remains the same...
}