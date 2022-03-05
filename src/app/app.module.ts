import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, MatExpansionModule, MatSidenavModule, MatStepperModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminComponent } from './users/admin/admin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RegistrationsComponent } from './users/admin/registrations/registrations.component';
import { DashboardComponent } from './users/user/dashboard/dashboard.component';
import { PassChangeComponent } from './auth/pass-change/pass-change.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SupervisorComponent } from './users/supervisor/supervisor.component';
import { GameOfDayComponent } from './users/admin/game-of-day/game-of-day.component';
import { GameComponent } from './users/user/game/game.component';
import { HighScoreComponent } from './users/high-score/high-score.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    AdminComponent,
    SignupComponent,
    RegistrationsComponent,
    DashboardComponent,
    PassChangeComponent,
    ForgotPassComponent,
    SupervisorComponent,
    GameOfDayComponent,
    GameComponent,
    HighScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatExpansionModule,
    MatSidenavModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  // Providing our interceptor
  // multi means that Angular will not overwrite existing interceptors
  // Every request will recieve our token, now that it is registered
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
