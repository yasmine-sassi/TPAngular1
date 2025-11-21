import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-master-detail-cv',
  templateUrl: './masterdetailcv.component.html',
  styleUrls: ['./masterdetailcv.component.css']
})
export class MasterDetailCVComponent {
  isDetailActive = false;

  constructor(private router: Router) {
    // Listen to route changes to show/hide the detail message
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Check if we're on a detail route (has ID in URL)
        this.isDetailActive = event.urlAfterRedirects.includes('/cv/') && 
                             !event.urlAfterRedirects.endsWith('/cv');
      });
  }
}