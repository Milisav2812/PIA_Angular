import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Registration } from './registration.model';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AuthService{

  private token: string;
  private tokenTimer: any;

  userInfo: Registration;
  userInfoListener = new Subject<Registration>();

  registrations: Registration[] = [];
  correctUsername: boolean = false;
  correctAnswer: boolean = false;
  question: string = "";

  // The type of user that is logged in
  private type: number = -1;

  // Listeners
  private authTypeListener = new Subject<number>();
  private authRegisterListener = new Subject<Registration[]>();
  private authValidateListener = new Subject<boolean>();
  private authQuestionListener = new Subject<string>();
  private authAnswerListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router ){}

  getUserInfo(){
    return this.userInfo;
  }

  getUserInfoListener(){
    return this.userInfoListener.asObservable();
  }

  // Get Token
  getToken(){
    return this.token;
  }

  // Get Type of User
  getType(){
    return this.type;
  }

  // Automatically Authenticate User
  autoAuthUser(){
    const authInfo = this.getAuthData();

    if(!authInfo){
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.setAuthTimer(expiresIn / 1000);
      this.type = authInfo.type;
      this.authTypeListener.next(this.type);
    }
  }

  // Login
  login(username: string, password: string){
    const loginData = {
      username: username.trim(),
      password: password.trim()
    };

    this.http.post<{ message: string, type: number, token: string, expiresIn: number, username: string }>('http://localhost:3000/api/user/login', loginData)
      .subscribe( res => {
        alert(res.message);
        this.token = res.token;
        if(this.token){
            // AuthTimer
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);

            // Type of user
            this.type = res.type;
            this.authTypeListener.next(this.type);

            // Save Auth Data
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
            this.saveAuthData(this.token, expirationDate, this.type, res.username);

            // Navigation
            if(this.type === 0){
              this.router.navigate(['admin/dashboard']);
            }
            else if(this.type === 1){
              this.router.navigate(['super/dashboard']);
            }
            else if(this.type === 2){
              this.router.navigate(['user/dashboard']);
            }
          }
      });
  }

  // Set Authentication Timer
  private setAuthTimer(expiresInDuration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  // Save Authentication Data
  private saveAuthData(token: string, expirationDate: Date, type: number, username: string){
    localStorage.setItem('token', token);
    // ISOString is serialized form of Date
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('type', type.toString());
    localStorage.setItem('username', username);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('type');
    localStorage.removeItem('username');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const type = parseInt(localStorage.getItem('type'));
    if(!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      type: type
    }
  }

  // Logout
  logout(){
    this.token = null;
    this.type = -1;
    this.authTypeListener.next(this.type);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getUserInfoDatabase(username: string, callBack){
    this.http.get<{message: string, user: Registration}>('http://localhost:3000/api/user/get-user-info' + username)
      .subscribe(result => {
        this.userInfo = result.user;
        this.userInfoListener.next(this.userInfo);
        callBack(result.user);
      })
  }

  // Registration
  signup(form: FormGroup, image: File){

    const postData = new FormData();
    postData.append("name", form.get('name').value );
    postData.append("surname", form.get('surname').value);
    postData.append("email", form.get('email').value);
    postData.append("occupation", form.get('occupation').value);
    postData.append("username", form.get('username').value);
    postData.append("password", form.get('password').value);
    postData.append("gender", form.get('gender').value);
    postData.append("jmbg", form.get('jmbg').value);
    postData.append("image", image, image.name);
    postData.append("question", form.get('question').value);
    postData.append("answer", form.get('answer').value);


    this.http.post<{message: string, response: boolean, registration: Registration}>('http://localhost:3000/api/user/signup', postData)
      .subscribe( res => {
        if(res.response){
          alert("Uspešno ste se registrovali! Molimo Vas sačekajte da vam admin odobri registraciju.");
          this.registrations.push(res.registration);
          this.authRegisterListener.next([...this.registrations]);
          this.router.navigate(['/']);
        }
      });
  }

  // Return Type Observable
  getAuthStatusListener(){
    return this.authTypeListener.asObservable();
  }

  // Return Registrations Observable
  getAuthRegistrationListener(){
    return this.authRegisterListener.asObservable();
  }

  // Return Validation Observable
  getAuthValidateListener(){
    return this.authValidateListener.asObservable();
  }

  // Return Question Observable
  getAuthQuestionListener(){
    return this.authQuestionListener.asObservable();
  }

  // Return Answer Observable
  getAuthAnswerListener(){
    return this.authAnswerListener.asObservable();
  }

  // Retrieve list of Registrations
  getRegistrationsFromServer(){
    this.http.get<{ registrations: Registration[] }>('http://localhost:3000/api/user/registrations')
      .pipe( map( resData => {
        // Pipe allows us to do something with the objects we've revieved before we get into subscribe
        return resData.registrations.map( registration => {

          return {
            name: registration.name,
            surname: registration.surname,
            email: registration.email,
            occupation: registration.occupation,
            username: registration.username,
            password: registration.password,
            gender: registration.gender,
            jmbg: registration.jmbg,
            imagePath: registration.imagePath,
            question: registration.question,
            answer: registration.answer
          };

        })
      }))
      .subscribe( transformedReg => {
        this.registrations = transformedReg;
        this.authRegisterListener.next([...this.registrations]);
      });
  }

  getRegistrations(){
    return this.registrations;
  }

  // Accept Registration
  acceptRegistration(registration: Registration){
    this.http.post<{message: string}>('http://localhost:3000/api/user/registrations/accept', registration)
      .subscribe(response => {
        alert(response.message);
        const updatedRegs = this.registrations.filter( reg => reg.username != registration.username);
        this.registrations = updatedRegs;
        this.authRegisterListener.next([...this.registrations]);
      });
  }

  // Reject registration
  rejectRegistration(registration: Registration){
    this.http.post<{ deleted: boolean }>('http://localhost:3000/api/user/registrations/reject', registration)
      .subscribe(resposne => {
        if(resposne.deleted === true){
          alert('Registracija je uspešno odbijena!');
          const updatedRegs = this.registrations.filter( reg => reg.username != registration.username);
          this.registrations = updatedRegs;
          this.authRegisterListener.next([...this.registrations]);
        }else{
          alert('Došlo je do greške prilikom odbijanja registracije!');
        }
      })
  }

  // Password Change
  passwordChange(form: FormGroup){
    const passData = {
      username: form.get('username').value,
      oldPass: form.get('oldPass').value,
      password: form.get('password').value
    };

    this.http.post<{message: string, changed:boolean}>('http://localhost:3000/api/user/pass-change', passData)
      .subscribe(response => {
        alert(response.message);
        if(response.changed){
          this.router.navigate(['/']);
        }
      });

  }


  // Forgot Password
  verifyUsernameAndJMBG(userName: string, JMBG: string){

    const user = {
      username: userName,
      jmbg: JMBG
    };

    this.http.post<{ message: string, success: boolean }>('http://localhost:3000/api/user/validate-user', user)
      .subscribe(response => {
        alert(response.message);
        this.correctUsername = response.success;
        this.authValidateListener.next(this.correctUsername);
      })
  }

  // Get correctUsername
  getCorrectUsername(){
    return this.correctUsername;
  }

  // Get Question for Validation
  getUserQuestion(userName: string){

    const user = {
      username: userName
    };

    this.http.post<{ message: string, success: boolean }>('http://localhost:3000/api/user/get-question', user)
      .subscribe(response => {
        this.question = response.message;
        this.authQuestionListener.next(this.question);
      });

  }

  getQuestion(){
    return this.question;
  }

  // Validate User's Answer
  validateAnswer( passedUsername: string, passedAnswer: string, callback: Function){

  const user = {
    username: passedUsername,
    answer: passedAnswer
  }

  this.http.post<{success: boolean}>('http://localhost:3000/api/user/validate-answer', user)
    .subscribe(response => {
      callback(response.success);
    })

  }

  // Update Password - Forgot Password
  updatePassword(userName: string, pass: string){

    const user = {
      username: userName,
      password: pass
    }

    this.http.post<{message: string}>('http://localhost:3000/api/user/update-pass', user)
      .subscribe(response => {
        alert(response.message);
        this.router.navigate(['/']);
      })

  }

  getAnswer(){
    return this.correctAnswer;
  }
}
