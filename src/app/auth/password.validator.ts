import { AbstractControl } from '@angular/forms';

// AbstractControl is the base class for form controls as well as form groups and form arrays
export function validatePass(control: AbstractControl): any{
  if(control.get('password').value !== control.get('confirmPassword').value) {
    control.get('confirmPassword').setErrors({ notEqual: true });
  }
}
