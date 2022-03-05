import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { validatePass } from '../password.validator';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit, OnDestroy {

  validateUserForm: FormGroup;
  questionForm: FormGroup;
  newPassForm: FormGroup;

  answer: string;
  username: string;

  // Validate Answer
  correctAnswer: boolean;

  // Username & JMBG
  correctUsername: boolean;
  validateUserSub: Subscription;

  // Question
  question: string;
  questionSub: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.correctAnswer = false;

    // Question Observable
    this.question = this.authService.getQuestion();
    this.questionSub = this.authService.getAuthQuestionListener()
      .subscribe(response => {
        this.question = response;
      })

    // Username Observable
    // this.correctUsername = this.authService.getCorrectUsername();
    this.correctUsername = false;
    this.validateUserSub = this.authService.getAuthValidateListener()
      .subscribe(result => {
        this.correctUsername = result;
      });

    // First Form
    this.validateUserForm = new FormGroup({
      username: new FormControl( null, { validators: [ Validators.required, Validators.minLength(3) ] } ),
      jmbg: new FormControl( null, { validators: [ Validators.required, Validators.pattern('((0[1-9]|[1-2][0-9]|3[0-1])(0(1|3|5|7|8)|1(0|2))|(0[1-9]|[1-2][0-9]|30)(0(2|4|6|9)|11)|(0[1-9]|[1-2][0-8])02)(9[0-9]{2}|0[0-9]{2})[0-9]{2}[0-9]{3}[0-9]') ] } ),
    });

    // Second Form
    this.questionForm = new FormGroup({
      answer: new FormControl( null, { validators: [ Validators.required, Validators.minLength(2) ] } ),
    });

    // Third Form
    this.newPassForm = new FormGroup({
      password: new FormControl( null, { validators:
        [ Validators.required,
          Validators.pattern(/^(?=(.*[a-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,12}$/)
        ]
      } ),
      confirmPassword: new FormControl(null, { validators: [ Validators.required ] })
    }, validatePass);
  }

  ngOnDestroy(){
    this.validateUserSub.unsubscribe();
    this.questionSub.unsubscribe();
  }

  // Validate Username & JMBG
  onValidateUser(){
    if(this.validateUserForm.invalid) return;

    this.authService.verifyUsernameAndJMBG(this.validateUserForm.get('username').value, this.validateUserForm.get('jmbg').value);
    this.authService.getUserQuestion(this.validateUserForm.get('username').value);
    this.username = this.validateUserForm.get('username').value;
  }

  // Validate Question and Answer
  onAnswerSubmit(){
    if(this.questionForm.invalid) return;

    // Callback function for validateAnswer()
    var t: any = (success) => {

      this.correctAnswer = success;
      if(this.correctAnswer){
        alert("Tačan odgovor!");
      }else{
        alert("Netačan odgovor! Prebacujemo vas nazad...");
        this.router.navigate(['/']);
      }

    };
    this.authService.validateAnswer(this.username, this.questionForm.get('answer').value, t );
  }

  onNewPassword(){
    if(this.newPassForm.invalid) return;

    this.authService.updatePassword(this.username, this.newPassForm.get('password').value);
  }

}
