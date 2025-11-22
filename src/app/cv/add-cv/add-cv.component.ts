import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CvService } from '../services/cv.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from 'src/config/routes.config';
import { Cv } from '../model/cv';
import { UniqueCinValidator } from '../../validators/unique-cin.validator';
import { cinAgeValidator } from 'src/app/validators/cin-age.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinct, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-cv',
  templateUrl: './add-cv.component.html',
  styleUrls: ['./add-cv.component.css'],
})
export class AddCvComponent {

  private cvService = inject (CvService);
  private router = inject (Router);
  private toastr = inject (ToastrService);
  private formBuilder = inject (FormBuilder);
  private uniqueCinValidator = inject (UniqueCinValidator);
  private destroyRef = inject(DestroyRef);
  isMinor = signal(false);

  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      path: [{ value: '', disabled: false }],
      job: ['', Validators.required],
      cin: [
        '',
        {
          validators: [Validators.required, Validators.pattern('[0-9]{8}')],
          asyncValidators: [
            this.uniqueCinValidator.validate.bind(this.uniqueCinValidator),
          ],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required, Validators.min(0), Validators.max(120)],
        },
      ],
    },
    { validators: cinAgeValidator() }
  );


  constructor() {
    //localStorage
    this.restoreFormFromLocalStorage();
    //age change
    this.form.get('age')?.valueChanges.pipe(
      takeUntilDestroyed()).subscribe((age) => {
      const ageNum = Number(age) || 0;
      this.isMinor.set(ageNum < 18);

      const pathControl = this.form.get('path');
      if (ageNum < 18) {
        pathControl?.disable({ emitEvent: false });
        pathControl?.setValue('', { emitEvent: false });
      } else {
        pathControl?.enable({ emitEvent: false });
      }
    });
    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.form.valid) {
        localStorage.setItem('addCvForm', JSON.stringify(value));
        }
    });

    effect(() => {
      console.log('isMinor changed:', this.isMinor());
    });

  }



  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        localStorage.removeItem('addCvForm');
        this.form.reset();
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  private restoreFormFromLocalStorage() {
    const savedForm = localStorage.getItem('addCvForm');
    if (savedForm) {
      try {
        const formData = JSON.parse(savedForm);
        this.form.patchValue(formData);

        if (formData.age < 18) {
          this.form.get('path')?.disable({ emitEvent: false });
          this.isMinor.set(true);
        }
      } catch (error) {
        console.warn('Error parsing saved form data:', error);
        localStorage.removeItem('addCvForm');
      }
    }
  }
  get name(): AbstractControl {
    return this.form.get('name')!;
  }
  get firstname() {
    return this.form.get('firstname');
  }
  get age(): AbstractControl {
    return this.form.get('age')!;
  }
  get job() {
    return this.form.get('job');
  }
  get path() {
    return this.form.get('path');
  }
  get cin(): AbstractControl {
    return this.form.get('cin')!;
  }
}
