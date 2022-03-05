import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GamesService } from '../games.service';
import { GameOfDayData } from './game-of-day.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnagramData } from '../supervisor/anagram.model';
import { GODResultData } from '../user/god-result.model';
import { Registration } from 'src/app/auth/registration.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  gameOfTODAY: GameOfDayData = null;
  gameOfTODAYSub: Subscription;
  alreadyPlayed: boolean = false; // Cannot update Game of Day if this is true
  gameDefined: boolean = false; // True - Game is defined. False - It is not defined
  gameDate: string = " ";

  todayDate: Date;

  godResults: GODResultData[];
  godResultSub: Subscription;

  userInfo: Registration = null;
  showInfo: boolean = false;

  anagrams: AnagramData[];
  anagramSub: Subscription;

  form: FormGroup = null;

  constructor(private router: Router, private gameService: GamesService, private authService: AuthService) { }

  ngOnInit() {

    this.todayDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const username = localStorage.getItem('username');

    // Loading User Info
    this.authService.getUserInfoDatabase(username, (user: Registration) => {
      this.userInfo = user;
      this.showInfo = true;
    })

    this.gameService.getListGODResultForDate(this.todayDate, (godResults: GODResultData[]) => {
      this.godResults = godResults;

      if(godResults.length > 0){
        this.alreadyPlayed = true;
      }

      if(!this.alreadyPlayed){
        this.gameService.getAnagramsFromDatabase();
        this.gameService.getGameForCurrentDateDatabaseAdmin(this.todayDate, (game: GameOfDayData) => {
          if(game){
            this.gameOfTODAY = game;
            this.gameDate = new Date( new Date(game.gameDate).getTime() ).toString().substr(0,15);
            this.gameDefined = true;
          }
        });
      }

      console.log("AlreadyPlayed: " + this.alreadyPlayed);
      console.log("gameDefined: " + this.gameDefined);

    })

    this.godResults = this.gameService.getGODResults();
    this.godResultSub = this.gameService.getGODResultsListener()
      .subscribe(result => {
        this.godResults = result;
      })

    this.gameOfTODAY = this.gameService.getGameForCurrentDate();
    this.gameOfTODAYSub = this.gameService.getGameForCurrentDateListener()
      .subscribe(result => {
        this.gameOfTODAY = result;
      })

    this.anagrams = this.gameService.getAnagrams();
    this.anagramSub = this.gameService.getGamesAnagramListener()
      .subscribe(result => {
        this.anagrams = result;
      })

    this.form = new FormGroup({
      anagram: new FormControl(null, {validators: [Validators.required]})
    })


  }

  ngOnDestroy(){
    this.godResultSub.unsubscribe();
    this.anagramSub.unsubscribe();
    this.gameOfTODAYSub.unsubscribe();
  }

  onAddGameOfDay(){
    this.router.navigate(['admin/game-of-day']);
  }

  onRegistrationSelect(){
    this.router.navigate(['admin/registrations']);
  }

  onUpdateGameOfDay(){

    const anagram = this.anagrams.find(x => x._id === this.form.get('anagram').value);
    console.log(anagram);
    this.gameOfTODAY.anagramPhrase = anagram.phrase;
    this.gameOfTODAY.anagramResult = anagram.result;
    console.log(this.gameOfTODAY);

    this.gameService.updateGameOfDay(this.gameOfTODAY);
  }

  onDeleteGameOfDay(){
    this.gameService.deleteGameOfDay(this.todayDate);
  }

}
