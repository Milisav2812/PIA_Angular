import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authStatusSub: Subscription;

  menu: boolean = false;

  type: number;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    // Tye of user logged in
    this.type = this.authService.getType();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(response => {
        this.type = response;
      });
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }

  onMenuClick(){
    if(this.menu){
      this.menu = false;
    }else{
      this.menu = true;
    }
  }

}
