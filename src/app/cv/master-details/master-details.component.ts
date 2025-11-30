// master-details.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // Add ActivatedRoute
import { CvService } from '../services/cv.service';
import { Cv } from '../model/cv';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { ListComponent } from '../list/list.component';
import { DetailsCvComponent } from '../details-cv/details-cv.component';

@Component({
  selector: 'app-master-details',
  standalone: true,
  imports: [CommonModule, ListComponent, DetailsCvComponent],
  templateUrl: './master-details.component.html',
  styleUrls: ['./master-details.component.css']
})
export class MasterDetailsComponent implements OnInit {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute); // Add this

  authService = inject(AuthService);

  // Signals
  cvs = signal<Cv[]>([]);
  selectedCvId = signal<number | null>(null);
  loading = signal(true);

  // Computed: Selected CV
  selectedCv = computed(() => {
    const id = this.selectedCvId();
    return id ? this.cvs().find(cv => cv.id === id) || null : null;
  });

  ngOnInit() {
    // Listen to route changes to update selected CV
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedCvId.set(+id);
      } else {
        this.selectedCvId.set(null);
      }
    });

    // Load CVs
    this.loadCvs();
  }

  loadCvs() {
    this.loading.set(true);
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        this.cvs.set(cvs);
        this.loading.set(false);
      },
      error: () => {
        this.cvs.set(this.cvService.getFakeCvs());
        this.loading.set(false);
        this.toastr.warning('Données fictives chargées');
      },
    });
  }

  selectCv(cv: Cv) {
    console.log('Selecting CV:', cv.id); // Debug
    this.router.navigate(['/cv', cv.id]);
  }

  onCvDeleted() {
    // Reload the list when a CV is deleted
    this.loadCvs();
    this.selectedCvId.set(null);
    this.router.navigate(['/cv']);
  }
}