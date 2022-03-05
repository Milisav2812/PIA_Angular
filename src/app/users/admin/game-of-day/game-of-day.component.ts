import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AnagramData } from '../../supervisor/anagram.model';
import { GamesService } from '../../games.service';
import { Subscription } from 'rxjs';
import { GameOfDayData } from '../game-of-day.model';
import { GODResultData } from '../../user/god-result.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-of-day',
  templateUrl: './game-of-day.component.html',
  styleUrls: ['./game-of-day.component.css']
})
export class GameOfDayComponent implements OnInit, OnDestroy {

  form: FormGroup;

  todayDate = new Date();

  godResults: GODResultData[];

  gamesList: GameOfDayData[];
  gameListSub: Subscription;

  anagrams: AnagramData[];
  anagramSub: Subscription;

  constructor(private gameService: GamesService, private router: Router) { }

  ngOnInit() {

    this.todayDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    this.gameService.getAnagramsFromDatabase();
    this.gameService.getAvailableGamesDatabase();

    this.gamesList = this.gameService.getGamesList();
    this.gameListSub = this.gameService.getGamesListListener()
      .subscribe(response => {
        this.gamesList = response;
      })

    // Initializing list of anagrams
    this.anagrams = this.gameService.getAnagrams();
    this.anagramSub = this.gameService.getGamesAnagramListener()
      .subscribe(res => {
        this.anagrams = res;
      });

    this.form = new FormGroup({
      anagram: new FormControl(null, { validators: [Validators.required] }),
      gameDate: new FormControl(null, { validators: [Validators.required] })
    });
  }

  ngOnDestroy(){
    this.anagramSub.unsubscribe();
    this.gameListSub.unsubscribe();

  }

  onCreateGame(){

    let success: boolean = true;

    if(this.form.invalid){
      return;
    }

    if(this.gamesList.length > 0){
      this.gamesList.forEach(game => {
        let timeDifference: number = new Date( new Date(game.gameDate).getTime()).getTime() - this.form.get('gameDate').value.getTime();
        if(  timeDifference === 0){
          alert("Igra dana je već definisana za taj datum!");
          success = false;
        }
      });
    }

    let callBack: any = () => {
      this.gameService.createGameOfDay(this.form);
      this.form.reset();
    };

    // If GameDate is entered correctly
    if(success){
      this.gameService.getOneAnagram(this.form.get('anagram').value, callBack);
      this.router.navigate(['/admin/dashboard']);
    }



  }

}
