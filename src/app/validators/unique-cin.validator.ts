// validators/unique-cin.validator.ts
import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take } from 'rxjs/operators';
import { CvService } from '../cv/services/cv.service';

@Injectable({ providedIn: 'root' })
export class UniqueCinValidator implements AsyncValidator {
  private cvService = inject(CvService); // inject() au lieu de constructor → plus moderne

  validate(
    control: AbstractControl<string | null>
  ): Observable<ValidationErrors | null> {
    const cin = control.value?.trim();

    // Si vide → on laisse Validators.required faire le job
    if (!cin) {
      return of(null);
    }

    return of(cin).pipe(
      debounceTime(500), // 500ms est plus doux que 400ms
      switchMap(() =>
        this.cvService.selectByProperty('cin', cin).pipe(
          map((cvs) => (cvs?.length > 0 ? { cinExists: true } : null)),
          catchError(() => of(null)) // jamais bloquer l'utilisateur
        )
      ),
      take(1)
    );
  }
}
