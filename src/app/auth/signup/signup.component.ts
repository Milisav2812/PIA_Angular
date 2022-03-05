import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validatePass } from '../password.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({

      name: new FormControl( null, { validators: [ Validators.required ] } ),
      surname: new FormControl( null, { validators: [ Validators.required ] } ),
      email: new FormControl( null, { validators: [ Validators.required, Validators.email ] } ),
      occupation: new FormControl( null, { validators: [ Validators.required ] } ),
      username: new FormControl( null, { validators: [ Validators.required ] } ),
      password: new FormControl( null, { validators:
        [ Validators.required,
          Validators.pattern(/^(?=(.*[a-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,12}$/)
        ]
      } ),
      confirmPassword: new FormControl( null, { validators: [ Validators.required ] } ),
      gender: new FormControl( 0, { validators: [ Validators.required ] } ), // 0 - male, 1 - female
      jmbg: new FormControl( null, { validators: [ Validators.required, Validators.pattern('((0[1-9]|[1-2][0-9]|3[0-1])(0(1|3|5|7|8)|1(0|2))|(0[1-9]|[1-2][0-9]|30)(0(2|4|6|9)|11)|(0[1-9]|[1-2][0-8])02)(9[0-9]{2}|0[0-9]{2})[0-9]{2}[0-9]{3}[0-9]') ] } ),
      image: new FormControl( null, { validators: [ Validators.required ] } ),
      question: new FormControl( null, { validators: [ Validators.required ] } ),
      answer: new FormControl( null, { validators: [ Validators.required ] } )

    }, validatePass);
  }

  // Provera ispravnosti forme
  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  onRegister(){
    if(this.form.invalid){
      alert("Došlo je do greške! Proverite da li ste uneli sve podatke");
      return;
    }

    // Picking a gender based on the JMBG
    let userGender;
    const stringPart: number = parseInt( this.form.get('jmbg').value.substr(9,1) );
    if( stringPart > 4 ) { userGender = 1; } // female
    else { userGender = 0; } // male

    this.form.patchValue({gender: userGender});

    this.authService.signup(this.form, this.form.value.image);

  }

  onImagePicked(event: Event){

    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const fileReared = new FileReader();

    // Callback function for readAsDataUrl()
    fileReared.onload = () => {
      const img = new Image();
      img.onload = () => {
        if( img.width > 300 || img.height > 300 ){
          alert('Maksimalna veličina slike je 300x300!');
          return;
        }

        this.imagePreview = img.src;
      };

      img.src = ( fileReared.result as string );

    };

    fileReared.readAsDataURL(file);
  }


}
