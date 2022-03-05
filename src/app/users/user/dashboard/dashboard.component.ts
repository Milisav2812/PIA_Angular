import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GamesService } from '../../games.service';
import { GameOfDayData } from '../../admin/game-of-day.model';
import { GODResultData } from '../god-result.model';
import { Subscription } from 'rxjs';
import { Registration } from 'src/app/auth/registration.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  godResult: GODResultData;

  highScore: GODResultData[] = [];
  highScoreSub: Subscription;
  isHighScore: boolean = false;
  myIndex: number = 0;

  userInfo: Registration = null;
  showInfo: boolean = false;

  todayDate: Date;
  username: string;

  constructor(private router: Router, private gameService: GamesService, private authService: AuthService) { }

  ngOnInit() {
    this.todayDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.username = localStorage.getItem('username');

    // Loading User Info
    this.authService.getUserInfoDatabase(this.username, (user: Registration) => {
      this.userInfo = user;
      this.showInfo = true;
    })

    // Loading Game Results
    this.gameService.getOneGODResult(this.username, this.todayDate, (godResult) => {
      this.godResult = godResult;
    })
    this.gameService.getGameForCurrentDateDatabase(this.todayDate);

    this.gameService.getListGODResultForDate(this.todayDate, (godResults: GODResultData[]) => {
      if(godResults.length > 0){
        this.isHighScore = true;
      }
      this.highScore = godResults;
      this.highScore.forEach(elem => {
        elem.gameDate = new Date( new Date(elem.gameDate).getTime() );
      });
      this.highScore.sort( (a,b) => {
        return b.result - a.result;
      })
      this.godResult = this.highScore.find(x => x.username === this.username);
      this.myIndex = this.highScore.indexOf(this.godResult);
    });
  }

  ngOnDestroy(){
  }

  onGameStart(){

    if(this.godResult){
      if(this.godResult.finished){
        alert("Igra dana je već odigrana!");
      }
      else{
        alert("Pronađena je započeta igra!");
      }
      this.router.navigate(['user/game-of-day']);
    }else{
      let gameOfToday: GameOfDayData = this.gameService.getGameForCurrentDate();
      if(!gameOfToday){
        alert("Za današnji datum nije definisana igra dana!");
        return;
      }else{
        this.gameService.createEmptyGODResult(this.username, this.todayDate);
        alert("Igra dana je pronađena");
        this.router.navigate(['user/game-of-day']);
      }
    }
  }

  onHighScore(){
    this.router.navigate(['high-scores']);
  }
}
