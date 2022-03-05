import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './users/admin/admin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RegistrationsComponent } from './users/admin/registrations/registrations.component';
import { DashboardComponent } from './users/user/dashboard/dashboard.component';
import { PassChangeComponent } from './auth/pass-change/pass-change.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { AuthGuard } from './auth/auth.guard';
import { SupervisorComponent } from './users/supervisor/supervisor.component';
import { GameOfDayComponent } from './users/admin/game-of-day/game-of-day.component';
import { GameComponent } from './users/user/game/game.component';
import { HighScoreComponent } from './users/high-score/high-score.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: '', component: LoginComponent },
  { path: 'admin/registrations', component: RegistrationsComponent, canActivate: [AuthGuard] },
  { path: 'admin/game-of-day', component: GameOfDayComponent, canActivate: [AuthGuard] },
  { path: 'user/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/game-of-day', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'pass-change', component: PassChangeComponent },
  { path: 'forgot-pass', component: ForgotPassComponent },
  { path: 'super/dashboard', component: SupervisorComponent, canActivate: [AuthGuard] },
  { path: 'high-scores', component: HighScoreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
