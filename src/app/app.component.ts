import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { GamesService } from './users/games.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'etf-kviz';

  constructor(private authService: AuthService, private gameService: GamesService){}

  ngOnInit(){
    // Authenticating User
    this.authService.autoAuthUser();
    // Getting list of Anagrams
    this.gameService.getAnagramsFromDatabase();
    // Get List of available Game of Day
    this.gameService.getAvailableGamesDatabase();
  }
}
