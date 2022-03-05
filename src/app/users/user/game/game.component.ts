import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamesService } from '../../games.service';
import { GameOfDayData } from '../../admin/game-of-day.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NatGeoData } from './nat-geo.model';
import { GODResultData } from '../god-result.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  gameOfTODAY: GameOfDayData = null;
  gameOfTODAYSub: Subscription;

  godResult: GODResultData = null;
  godResultSub: Subscription;

  canPlayGame: boolean = true; // Can play or must wait for supervisor
  alreadyPlayed: boolean = false;

  numberOfPoints: number = 0;
  remainingTime: number;
  timer: any;
  needsToBeVerified: boolean = true; // Does the game need to be verified by the supervisor

  // Anagram
  anagramDone: boolean = false;
  anagramTime: number = 60;

  // My Number
  myNumber: boolean = false; // Boolean to disable myNumber mat-card
  myNumberTime: number = 90;
  mainNumber: number = 0; // The number we want to get
  randomNumberTimer: any; // Timer for myNumber
  num: number[] = []; // Buttons for numbers
  numBool: boolean[] = []; // Booleans to disable number buttons
  stop: boolean = false; // Boolean that disables the STOP button
  stringForCalculation: string = "";
  resultOfCalculation: number = 0; // Result of calculation
  wasPreviousNumber: boolean = false; // Was the previous added value a number

  // National Geographic
  myLetter: string = 'S';
  formGeo: FormGroup;
  letterTimer: any; // Timer for random letter display
  stopLetter: boolean = false; // Disables inputs until a letter is selected
  natGeoTime: number = 120;
  // Regex for First letter in Geo
  regex = "^(" + this.myLetter + "|" + this.myLetter.toLowerCase() + ")[a-zA-Z]*";

  now: Date;
  username: string;
  natGeo: NatGeoData;

  constructor(private gameService: GamesService, private router: Router) {
  }

  ngOnInit() {

    this.username = localStorage.getItem('username');

    // BRISATI
    //this.anagramDone = true;
    //this.myNumber = true;

    this.numBool = [false, false, false, false, false, false];
    this.num = [0, 0, 0, 0, 0, 0];

    if(!this.godResult){
      this.now = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      const username = localStorage.getItem('username');
      this.gameService.getOneGODResult(username, this.now, (godResult: GODResultData) => {
        if(godResult){
          this.godResult = godResult;
          if(!this.godResult.verified && this.godResult.finished){
            this.canPlayGame = false;
          }else if(godResult.verified){
            this.alreadyPlayed = true;
            this.canPlayGame = false;
          }
        }
        else{
          this.canPlayGame = true;
        }

        if(this.canPlayGame && !this.alreadyPlayed){
          this.setGameTimer(this.anagramTime);
          // this.letterTimerStart();
        }
      })
    }

    this.godResult = this.gameService.getGODResult();
    this.godResultSub = this.gameService.getGODResultListener()
      .subscribe(result => {
        this.godResult = result;
      })

    // This enables the player to start over if he refreshes the page
    if(!this.gameOfTODAY){
      const now = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      this.gameService.getGameForCurrentDateDatabase(now);
    }

    this.gameOfTODAY = this.gameService.getGameForCurrentDate();
    this.gameOfTODAYSub = this.gameService.getGameForCurrentDateListener()
      .subscribe(result => {
        this.gameOfTODAY = result;
        this.gameOfTODAY.gameDate = new Date( new Date(this.gameOfTODAY.gameDate) );
      });

    // National Geo form
    this.formGeo = new FormGroup({
      country: new FormControl(null),
      city:    new FormControl(null),
      lake:    new FormControl(null),
      mountain:new FormControl(null),
      river:   new FormControl(null),
      animal:  new FormControl(null),
      plant:   new FormControl(null),
      band:    new FormControl(null)
    });
  }

  ngOnDestroy(){
    this.gameOfTODAYSub.unsubscribe();

    clearInterval(this.timer);
    clearInterval(this.randomNumberTimer);
    clearInterval(this.letterTimer);
  }

  setGameTimer(numberOfSeconds: number){
    this.timer = setInterval( () => {
      numberOfSeconds -= 1;
      this.remainingTime = numberOfSeconds;
      if(numberOfSeconds === 0){
        if(!this.anagramDone){
          this.onAnagramSubmit(null);
        }else if(this.anagramDone && !this.myNumber){
          this.onMyNumberSubmit();
        }else if(this.anagramDone && this.myNumber){
          this.finishGameOfDay();
        }
        this.remainingTime = -1;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onAnagramSubmit(form: NgForm){
    if(!form){
      alert("Isteklo vam je vreme!");
    }
    else{
      if(this.gameOfTODAY.anagramResult === form.value.anagramResult.toUpperCase().trim()){
        alert("Anagram je tačan!");
        this.numberOfPoints += 10;
      }else{
        alert("Pogrešili ste!");
      }
    }

    clearInterval(this.timer);
    this.remainingTime = -1;
    this.anagramDone = true;
    this.numberSTART();
  }

  // Displays random numbers
  numberSTART(){
    this.randomNumberTimer = setInterval( () => {
      let number = Math.random()*999;
      this.mainNumber = Math.floor(number) + 1;

      for(var i:number = 0;i<4; i++){
        number = Math.floor( Math.random()*9 ) + 1;
        this.num[i] = number;
      }

      let numbers = [10, 15, 20];
      number = Math.floor( Math.random() * 3 );
      this.num[4] = numbers[number];

      numbers = [25, 50, 75, 100];
      number = Math.floor( Math.random() * 4 );
      this.num[5] = numbers[number];

    }, 100);
  }

  // Stops random number displaying
  numberSTOP(){
    this.stop = true;
    clearInterval(this.randomNumberTimer);
    this.setGameTimer(this.myNumberTime);
  }

  addChartoResult(value: number){
    try{
      switch(value){
        case 40: this.stringForCalculation += '('; this.wasPreviousNumber = false; break;
        case 41: this.stringForCalculation += ')'; this.wasPreviousNumber = false; break;
        case 43: this.stringForCalculation += '+'; this.wasPreviousNumber = false; break;
        case 45: this.stringForCalculation += '-'; this.wasPreviousNumber = false; break;
        case 42: this.stringForCalculation += '*'; this.wasPreviousNumber = false; break;
        case 47: this.stringForCalculation += '/'; this.wasPreviousNumber = false; break;
        default:
        {
          if(this.wasPreviousNumber){
            this.stringForCalculation += " ";
            this.stringForCalculation += value.toString();
            this.resultOfCalculation = -1111; // Error
          }else{
            this.wasPreviousNumber = true;
            this.stringForCalculation += value.toString();
          }
        }
      }
      this.resultOfCalculation = eval(this.stringForCalculation);
    }catch(error){
      console.log("Greska");
    }
  }

  deleteResultString(){
    this.stringForCalculation = "";
    this.resultOfCalculation = 0;
    this.wasPreviousNumber = false;
    this.numBool = [false, false, false, false, false, false];
  }

  onMyNumberSubmit(){

    if(this.remainingTime === 0){
      alert("Isteklo vam je vreme!");
    }else{
      if(this.mainNumber === this.resultOfCalculation){
        this.numberOfPoints += 10;
        alert("Pogodili ste vrednost!");
      }else{
        alert("Pogrešili ste!");
      }
    }

    this.myNumber = true;
    clearInterval(this.timer);
    this.remainingTime = -1;
    this.letterTimerStart();
  }

  // Nat Geo Random Letter Timer
  letterTimerStart(){
    this.letterTimer = setInterval(() => {

      let asciiValue = Math.floor( Math.random()*(90 - 65) ) + 65;
      this.myLetter = String.fromCharCode(asciiValue);
      this.regex = "^(" + this.myLetter + "|" + this.myLetter.toLowerCase() + ")[a-zA-ZćĆčČžŽđĐšŠ ]*";

    }, 100);
  }

  letterTimerStop(){
    // Updating form pattern
    this.formGeo.get('country').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('city').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('lake').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('mountain').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('river').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('animal').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('plant').setValidators([Validators.pattern(this.regex)]);
    this.formGeo.get('band').setValidators([Validators.pattern(this.regex)]);

    this.stopLetter = true;
    clearInterval(this.letterTimer);
    this.setGameTimer(this.natGeoTime);
  }

  finishGameOfDay(){
    let username = localStorage.getItem('username');

    const country = this.formGeo.get('country').value;
    const city = this.formGeo.get('city').value;
    const lake = this.formGeo.get('lake').value;
    const mountain = this.formGeo.get('mountain').value;
    const river = this.formGeo.get('river').value;
    const animal = this.formGeo.get('animal').value;
    const plant = this.formGeo.get('plant').value;
    const band = this.formGeo.get('band').value;

    this.natGeo = {
      _id: null,
      username: username,
      gameDate: this.gameOfTODAY.gameDate,
      country: country ? country.toUpperCase() : null,
      city: city ? city.toUpperCase() : null,
      lake: lake ? lake.toUpperCase() : null,
      mountain: mountain ? mountain.toUpperCase() : null,
      river: river ? river.toUpperCase() : null,
      animal: animal ? animal.toUpperCase() : null,
      plant: plant ? plant.toUpperCase() : null,
      band: band ? band.toUpperCase() : null,
      verified: false
    }

    console.log(this.natGeo);
    this.gameService.checkNatGeo(this.username, this.now, this.natGeo.country, 0, (success) => {
      if(success){
        this.numberOfPoints += 2;
        this.natGeo.country = null;
      }
      this.gameService.checkNatGeo(this.username, this.now, this.natGeo.city, 1, (success) => {
        if(success){
          this.numberOfPoints += 2;
          this.natGeo.city = null;
        }
        this.gameService.checkNatGeo(this.username, this.now, this.natGeo.lake, 2, (success) => {
          if(success){
            this.numberOfPoints += 2;
            this.natGeo.lake = null;
          }
          this.gameService.checkNatGeo(this.username, this.now, this.natGeo.mountain, 3, (success) => {
            if(success){
              this.numberOfPoints += 2;
              this.natGeo.mountain = null;
            }
            this.gameService.checkNatGeo(this.username, this.now, this.natGeo.river, 4, (success) => {
              if(success){
                this.numberOfPoints += 2;
                this.natGeo.river = null;
              }
              this.gameService.checkNatGeo(this.username, this.now, this.natGeo.animal, 5, (success) => {
                if(success){
                  this.numberOfPoints += 2;
                  this.natGeo.animal = null;
                }
                this.gameService.checkNatGeo(this.username, this.now, this.natGeo.plant, 6, (success) => {
                  if(success){
                    this.numberOfPoints += 2;
                    this.natGeo.plant = null;
                  }
                  this.gameService.checkNatGeo(this.username, this.now, this.natGeo.band, 7, (success) => {
                    if(success){
                      this.numberOfPoints += 2;
                      this.natGeo.band = null;
                    }
                    this.gameService.finishGameOfDay(username, this.gameOfTODAY.gameDate, this.numberOfPoints, this.natGeo, this.needToBeVerified());

                    clearInterval(this.timer);
                    this.remainingTime = -1;

                    if(this.needToBeVerified()){
                      this.gameService.uploadNetGeoSuper(this.natGeo);
                    }
                    this.router.navigate(['user/dashboard']);
                  })
                })
              })
            })
          })
        })
      })
    })

  }

  needToBeVerified(): boolean{
    return !( !this.natGeo.country &&
           !this.natGeo.city &&
           !this.natGeo.lake &&
           !this.natGeo.mountain &&
           !this.natGeo.river &&
           !this.natGeo.animal &&
           !this.natGeo.plant &&
           !this.natGeo.band );
  }

}
