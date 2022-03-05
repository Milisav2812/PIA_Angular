import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validatePass } from '../password.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pass-change',
  templateUrl: './pass-change.component.html',
  styleUrls: ['./pass-change.component.css']
})
export class PassChangeComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, { validators: [ Validators.required ] }),
      oldPass: new FormControl(null, { validators: [ Validators.required ] }),
      password: new FormControl( null, { validators:
        [ Validators.required,
          Validators.pattern(/^(?=(.*[a-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,12}$/)
        ]
      } ),
      confirmPassword: new FormControl(null, { validators: [ Validators.required ] }),

    }, validatePass);
  }

  onPassChange(){
    if(this.form.invalid) return;
    this.authService.passwordChange(this.form);
  }

}
