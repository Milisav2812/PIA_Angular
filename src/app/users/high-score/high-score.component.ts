import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamesService } from '../games.service';
import { GODResultData } from '../user/god-result.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-high-score',
  templateUrl: './high-score.component.html',
  styleUrls: ['./high-score.component.css']
})
export class HighScoreComponent implements OnInit, OnDestroy {

  highScoreMonth: GODResultData[];
  highScoreMonthSub: Subscription;

  highScore20Days: GODResultData[];

  username: string;

  constructor(private gameService: GamesService) { }

  ngOnInit() {

    this.username = localStorage.getItem('username');

    const token = localStorage.getItem('token');
    if(!token){
      alert("Uspešno ste ušli kao GOST! Da biste učestvovali u kvizu, molimo vas da napravite nalog");
    }

    this.gameService.getListGODResultForMonth((godResults: GODResultData[]) => {
      if(godResults.length > 0){
        this.highScoreMonth = godResults;
        this.highScoreMonth.forEach(elem => {
          elem.gameDate = new Date( new Date(elem.gameDate).getTime() );
        });
        this.highScoreMonth.sort( (a,b) => {
          return b.result - a.result;
        })
      }
    })

    this.gameService.getListGODResultFor20Days((godResults: GODResultData[]) => {
      if(godResults.length > 0){
        this.highScore20Days = godResults;
        this.highScore20Days.forEach(elem => {
          elem.gameDate = new Date( new Date(elem.gameDate).getTime() );
        });
        this.highScore20Days.sort( (a,b) => {
          return b.result - a.result;
        })
      }
    })

    this.highScoreMonth = this.gameService.getGODResults();
    this.highScoreMonthSub = this.gameService.getGODResultsListener()
      .subscribe(result => {
        this.highScoreMonth = result;
      })
  }

  ngOnDestroy(){
    this.highScoreMonthSub.unsubscribe();
  }

}
