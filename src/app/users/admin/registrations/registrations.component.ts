import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Registration } from 'src/app/auth/registration.model';

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.css']
})
export class RegistrationsComponent implements OnInit, OnDestroy {

  registrations: Registration[];
  registerSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getRegistrationsFromServer();
    this.registrations = this.authService.getRegistrations();
    this.registerSub = this.authService.getAuthRegistrationListener().subscribe(response => {
      this.registrations = response;
    });
  }

  ngOnDestroy() {
    this.registerSub.unsubscribe();
  }

  onAccept(registration: Registration){
    this.authService.acceptRegistration(registration);
  }

  onReject(registration: Registration){
    this.authService.rejectRegistration(registration);
  }
}
