// Si tu veux être ultra-précis sur le typage :
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function cinAgeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) return null;

    const cin = control.get('cin')?.value?.toString().trim();
    const age = control.get('age')?.value;

    if (!cin || age === null || age === undefined || !/^\d{8}$/.test(cin)) {
      return null; // autres validateurs gèrent ça
    }

    const firstTwo = parseInt(cin.slice(0, 2), 10);
    const expectedRange = age >= 60 ? '00-19' : '20-99';

    const isValid = age >= 60 ? firstTwo <= 19 : firstTwo >= 20;

    return isValid
      ? null
      : {
          cinAgeInconsistent: {
            actual: firstTwo,
            age,
            expectedRange,
          },
        };
  };
}
