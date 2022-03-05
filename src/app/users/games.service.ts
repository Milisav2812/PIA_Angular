import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnagramData } from './supervisor/anagram.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { GameOfDayData } from './admin/game-of-day.model';
import { NatGeoData } from './user/game/nat-geo.model';
import { GODResultData } from './user/god-result.model';
import { NatGeoWord } from './supervisor/nat-geo-word.model';

@Injectable({providedIn: 'root'})
export class GamesService implements OnInit, OnDestroy{

  private gameOfDayAnagram: AnagramData;

  private godResults: GODResultData[];
  private godResultsListener = new Subject<GODResultData[]>();

  private godResult: GODResultData;
  private godResultListener = new Subject<GODResultData>();

  private natGeoSuper: NatGeoData[];
  private natGeoSuperListener = new Subject<NatGeoData[]>();

  private gameOfDayTODAY: GameOfDayData;
  private gameOfTODAYListener = new Subject<GameOfDayData>();

  private gamesList: GameOfDayData[];
  private gameListListener = new Subject<GameOfDayData[]>();

  private anagrams: AnagramData[];
  private gameAnagramListener = new Subject<AnagramData[]>();

  // Nat Geo Word Lists
  countryList: NatGeoWord[] = [];
  countryListListener = new Subject<NatGeoWord[]>();

  cityList: NatGeoWord[] = [];
  cityListListener = new Subject<NatGeoWord[]>();

  lakeList: NatGeoWord[] = [];
  lakeListListener = new Subject<NatGeoWord[]>();

  mountainList: NatGeoWord[] = [];
  mountainListListener = new Subject<NatGeoWord[]>();

  riverList: NatGeoWord[] = [];
  riverListListener = new Subject<NatGeoWord[]>();

  animalList: NatGeoWord[] = [];
  animalListListener = new Subject<NatGeoWord[]>();

  plantList: NatGeoWord[] = [];
  plantListListener = new Subject<NatGeoWord[]>();

  bandList: NatGeoWord[] = [];
  bandListListener = new Subject<NatGeoWord[]>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }

  ngOnDestroy(){
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      NAT GEO WORD LISTS    ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  getCountryList(){ return this.countryList; }
  getCountryListListener(){ return this.countryListListener.asObservable(); }

  getCityList(){ return this.cityList; }
  getCityListListener(){ return this.cityListListener.asObservable(); }

  getLakeList(){ return this.lakeList; }
  getLakeListListener(){ return this.lakeListListener.asObservable(); }

  getMountainList(){ return this.mountainList; }
  getMountainListListener(){ return this.mountainListListener.asObservable(); }

  getRiverList(){ return this.riverList; }
  getRiverListListener(){ return this.riverListListener.asObservable(); }

  getAnimalList(){ return this.animalList; }
  getAnimalListListener(){ return this.animalListListener.asObservable(); }

  getPlantList(){ return this.plantList; }
  getPlantListListener(){ return this.plantListListener.asObservable(); }

  getBandList(){ return this.bandList; }
  getBandListListener(){ return this.bandListListener.asObservable(); }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      RETURN VALUES     ///////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  getGODResults(){
    return this.godResults;
  }

  getGODResultsListener(){
    return this.godResultsListener.asObservable();
  }

  // Return list of natgeo for super
  getNatGeoSuper(){
    return this.natGeoSuper;
  }

  // Return GOD results
  getGODResult(){
    return this.godResult;
  }

  // Return Available dates
  getGamesList(){
    return this.gamesList;
  }

  getNatGeoSuperListener(){
    return this.natGeoSuperListener.asObservable();
  }

  // Return GOD Result Listener
  getGODResultListener(){
    return this.godResultListener.asObservable();
  }

  // Return Game Date Listener
  getGamesListListener(){
    return this.gameListListener.asObservable();
  }

  // Return game of day
  getGameForCurrentDate(){
    return this.gameOfDayTODAY;
  }

  // Return game of Day Listener
  getGameForCurrentDateListener(){
    return this.gameOfTODAYListener.asObservable();
  }

  // Return list of anagrams from gameService
  getAnagrams(){
    return this.anagrams;
  }

  // Return Anagram Listener
  getGamesAnagramListener(){
    return this.gameAnagramListener.asObservable();
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      GAME OF DAY     /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Delete Game of Day
  deleteGameOfDay(gameDate: Date){
    const data = {
      gameDate: gameDate
    }

    this.http.post<{message: string}>('http://localhost:3000/api/games/delete-game-of-day', data)
      .subscribe(result => {
        alert(result.message);
      })
  }

  // Return game for current Date
  getGameForCurrentDateDatabase(date: Date){
    this.http.get<{message: string, game: GameOfDayData}>('http://localhost:3000/api/games/get-game-today:date' + date)
      .subscribe(result => {
        if(result.game){
          this.gameOfDayTODAY = result.game;
          this.gameOfTODAYListener.next(this.gameOfDayTODAY);
        }
      })
  }

  // Return game for current Date For Admin
  getGameForCurrentDateDatabaseAdmin(date: Date, callBack: any){
    this.http.get<{message: string, game: GameOfDayData}>('http://localhost:3000/api/games/get-game-admin:date' + date)
      .subscribe(result => {
        if(result.game){
          this.gameOfDayTODAY = result.game;
          this.gameOfTODAYListener.next(this.gameOfDayTODAY);
        }
        callBack(result.game);
      })
  }

  // Return list of available games
  getAvailableGamesDatabase(){
    this.http.get<{message: string, games: GameOfDayData[]}>('http://localhost:3000/api/games/get-available-dates')
      .pipe(
        map(resData => {
          return resData.games.map( game => {

            return {
              _id: game._id,
              gameDate: game.gameDate,
              anagramPhrase: game.anagramPhrase,
              anagramResult: game.anagramResult
            }

          })
        })
      )
      .subscribe(transformedGameList => {
        this.gamesList = transformedGameList;
        this.gameListListener.next([...this.gamesList]);
      })
  }

  // Create a game of the day in the database
  createGameOfDay(form: FormGroup){

    const gameData = {
      _id: null,
      anagramPhrase: this.gameOfDayAnagram.phrase,
      anagramResult: this.gameOfDayAnagram.result,
      gameDate: form.get('gameDate').value,
      gameDateOffset: form.get('gameDate').value.getTimezoneOffset()
    }

    this.http.post<{message: string, game: GameOfDayData}>('http://localhost:3000/api/games/create-game-of-day', gameData)
      .subscribe(result => {
        alert(result.message);
        this.gamesList.push(result.game);
        this.gameListListener.next([...this.gamesList]);
      })

  }

  // Update Game of Day
  updateGameOfDay(gameOfDay: GameOfDayData){
    const data = { god: gameOfDay };
    this.http.post<{message: string}>('http://localhost:3000/api/games/update-game-of-day', data)
      .subscribe(result => {
        alert(result.message);
      })
  }

  // GAME OF DAY
  finishGameOfDay(username: string, gameDate: Date, result: number, natGeo: NatGeoData, needsToBeVerified: boolean ){
    const data = {
      _id: null,
      username: username,
      gameDate: gameDate,
      result: result,
      verified: needsToBeVerified ? false : true
    }

    this.http.post<{message: string}>('http://localhost:3000/api/games/finish-game-of-day', data)
      .subscribe(result => {
        alert(result.message);
      })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      ANAGRAMS     /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////


  // Return ONE Anagram from database
  getOneAnagram(id: string, callBack){
    this.http.get<{message: string, anagram: AnagramData}>('http://localhost:3000/api/games/get-one-anagram:id' + id,)
      .pipe(
        map(resData => {
            return {
              _id: resData.anagram._id,
              phrase: resData.anagram.phrase,
              result: resData.anagram.result
          }
        })
      )
      .subscribe(res => {
        this.gameOfDayAnagram = res;
        callBack();
      })
  }

  // Return list of anagrams from database
  getAnagramsFromDatabase()
  {
    this.http.get<{anagrams: AnagramData[]}>('http://localhost:3000/api/games/get-anagram')
      .pipe(
        map( resData => {
          return resData.anagrams.map( anagram => {
            return {
              _id: anagram._id,
              phrase: anagram.phrase,
              result: anagram.result
            }
          })
        })
      )
      .subscribe( transformedAnagram => {
        this.anagrams = transformedAnagram;
        this.gameAnagramListener.next([...this.anagrams]);
      })
  }

  // Delete one anagram from database
  public deleteOneAnagramDatabase(id: string){
    this.http.delete<{message: string, success: boolean}>('http://localhost:3000/api/games/delete-one-anagram:id' + id)
      .subscribe(result => {
        if(result.success){
          this.anagrams = this.anagrams.filter( (anagram) => {
            if(anagram._id != id){
              return anagram;
            }
          });
          this.gameAnagramListener.next([...this.anagrams]);
        }
      })
  }

  // Supervisor - Add Anagram info to Database
  addAnagramToDatabase(phrase: string, result: string){

    const anagramData: AnagramData = {
      _id: null,
      phrase: phrase.toUpperCase(),
      result: result.toUpperCase()
    };

    this.http.post<{message: string, anagram: AnagramData}>('http://localhost:3000/api/games/add-anagram-to-db', anagramData)
      .subscribe(result => {
        this.anagrams.push(result.anagram);
        this.gameAnagramListener.next([...this.anagrams]);
        alert(result.message);
        this.router.navigate(['super/dashboard']);
      })
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      GOD RESULT     /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////



  // Update GOD Result
  updateGODResult(username: string, gameDate: Date){
    const data = {
      username: username,
      gameDate: gameDate
    }

    this.http.post<{message: string}>('http://localhost:3000/api/games/update-god-result', data)
    .subscribe(result => {
      // alert(result.message);
    })
  }

  // Create Empty GOD Result
  createEmptyGODResult(username: string, gameDate: Date){
    const data = {
      username: username,
      gameDate: gameDate
    }
    this.http.post<{message: string}>('http://localhost:3000/api/games/create-god-result', data)
      .subscribe(result => {
        // alert(result.message)
      })
  }

  // Get specific game of day result
  getOneGODResult(username: string, gameDate: Date, callBack){
    const data = {
      username: username,
      gameDate: gameDate
    }

    this.http.post<{message: string, godResult: GODResultData}>('http://localhost:3000/api/games/get-one-god-result', data)
      .subscribe(result => {
        this.godResult = result.godResult;
        this.godResultListener.next(this.godResult);
        callBack(result.godResult);
      })
  }

  getListGODResultForMonth(callBack){
    this.http.get<{messages: string, godResults: GODResultData[]}>('http://localhost:3000/api/games/get-list-god-month')
      .pipe(map(mapData => {
        return mapData.godResults.map(godResult => {
          return {
            _id: godResult._id,
            username: godResult.username,
            gameDate: godResult.gameDate,
            result: godResult.result,
            verified: godResult.verified,
            finished: godResult.finished,
          }
        })
      }))
      .subscribe(transGodResults => {
        this.godResults = transGodResults;
        this.godResultsListener.next([...this.godResults]);
        callBack(transGodResults);
      })
  }

  getListGODResultFor20Days(callBack){
    this.http.get<{messages: string, godResults: GODResultData[]}>('http://localhost:3000/api/games/get-list-god-20-days')
      .pipe(map(mapData => {
        return mapData.godResults.map(godResult => {
          return {
            _id: godResult._id,
            username: godResult.username,
            gameDate: godResult.gameDate,
            result: godResult.result,
            verified: godResult.verified,
            finished: godResult.finished,
          }
        })
      }))
      .subscribe(transGodResults => {
        // this.godResults = transGodResults;
        // this.godResultsListener.next([...this.godResults]);
        callBack(transGodResults);
      })
  }

  // Get List of GOD Results for Username
  getListGODResultForUsername(username: string, callBack){
    this.http.get<{message: string, godResults: GODResultData[]}>('http://localhost:3000/api/games/get-list-god-result' + username)
      .pipe(map(mapData => {
        return mapData.godResults.map(godResult => {
          return {
            _id: godResult._id,
            username: godResult.username,
            gameDate: godResult.gameDate,
            result: godResult.result,
            verified: godResult.verified,
            finished: godResult.finished,
          }
        })
      }))
      .subscribe(transGodResults => {
        this.godResults = transGodResults;
        this.godResultsListener.next([...this.godResults]);
        callBack(transGodResults);
      })
  }

  // Get List of GODResult BASED on Date
  getListGODResultForDate(date: Date, callBack){
    this.http.get<{message: string, godResults: GODResultData[]}>('http://localhost:3000/api/games/get-list-god-date:' + date)
      .pipe(map(resData => {
        return resData.godResults.map(data => {
          return {
            _id: data._id,
            username: data.username,
            gameDate: data.gameDate,
            result: data.result,
            verified: data.verified,
            finished: data.finished
          }
        })
      }))
      .subscribe(transData => {
        this.godResults = transData;
        this.godResultsListener.next([...this.godResults]);
        callBack(transData);
      })
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      NAT GEO     /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  deleteNatGeoWord(type: number, id: string){
    this.http.delete<{success: boolean}>('http://localhost:3000/api/games/nat-geo/delete-nat-geo-word' + type + id)
      .subscribe(result => {
        if(result.success){
          alert("Uspešno ste obrisali reč iz baze");
          switch(type){
            case 0: this.countryList = this.countryList.filter(x => x._id !== id); this.countryListListener.next([...this.countryList]); break;
            case 1: this.cityList = this.cityList.filter(x => x._id !== id); this.cityListListener.next([...this.cityList]); break;
            case 2: this.lakeList = this.lakeList.filter(x => x._id !== id); this.lakeListListener.next([...this.lakeList]); break;
            case 3: this.mountainList = this.mountainList.filter(x => x._id !== id); this.mountainListListener.next([...this.mountainList]); break;
            case 4: this.riverList = this.riverList.filter(x => x._id !== id); this.riverListListener.next([...this.riverList]); break;
            case 5: this.animalList = this.animalList.filter(x => x._id !== id); this.animalListListener.next([...this.animalList]); break;
            case 6: this.plantList = this.plantList.filter(x => x._id !== id); this.plantListListener.next([...this.plantList]); break;
            case 7: this.bandList = this.bandList.filter(x => x._id !== id); this.bandListListener.next([...this.bandList]); break;
          }
        }else{
          alert("Došlo je do greške prilikom brisanja reči!");
        }
      })
  }

  getListNatGeoWords(type: number){
    this.http.get<{foundWords: NatGeoWord[]}>('http://localhost:3000/api/games/nat-geo/get-list-nat-geo-words' + type)
      .pipe(map(data => {
        return data.foundWords.map(resData => {
          return {
            _id: resData._id,
            word: resData.word
          }
        })
      }))
      .subscribe(transWords => {
        switch(type){
          case 0: this.countryList = transWords; this.countryListListener.next([...this.countryList]); break;
          case 1: this.cityList = transWords; this.cityListListener.next([...this.cityList]); break;
          case 2: this.lakeList = transWords; this.lakeListListener.next([...this.lakeList]); break;
          case 3: this.mountainList = transWords; this.mountainListListener.next([...this.mountainList]); break;
          case 4: this.riverList = transWords; this.riverListListener.next([...this.riverList]); break;
          case 5: this.animalList = transWords; this.animalListListener.next([...this.animalList]); break;
          case 6: this.plantList = transWords; this.plantListListener.next([...this.plantList]); break;
          case 7: this.bandList = transWords; this.bandListListener.next([...this.bandList]); break;
        }
      })

  }

  // Check values for NatGeo
  checkNatGeo(username: string, gameDate: Date, word: string, type: number, callBack){
    const data = {
      word: word,
      type: type,
      username: username,
      gameDate: gameDate
    }
    if(word){
      this.http.post<{success: boolean}>('http://localhost:3000/api/games/nat-geo/check-nat-geo', data)
      .subscribe(result => {
        callBack(result.success);
      })
    }else{
      console.log("Nije proslo");
      callBack(false);
    }

  }

  // Upload Nat geo to database for SUPER
  uploadNetGeoSuper(natGeo: NatGeoData){
    this.http.post<{success: boolean}>('http://localhost:3000/api/games/nat-geo/upload-nat-geo', natGeo)
      .subscribe(result => {

      })
  }

  // Return list of Nat Geo Results for Super
  getNatGeoListDatabase(){
    this.http.get<{natGeos: NatGeoData[]}>('http://localhost:3000/api/games/nat-geo/get-nat-geo-list')
      .pipe( map(resData => {
        return resData.natGeos.map(natGeo => {
          return {
            _id: natGeo._id,
            username: natGeo.username,
            gameDate: natGeo.gameDate,
            country: natGeo.country,
            city: natGeo.city,
            lake: natGeo.lake,
            mountain: natGeo.mountain,
            river: natGeo.river,
            animal: natGeo.animal,
            plant: natGeo.plant,
            band: natGeo.band,
            verified: natGeo.verified
          }
        })
      }))
      .subscribe(transformedNatGeos => {
         this.natGeoSuper = transformedNatGeos;
         this.natGeoSuperListener.next([...this.natGeoSuper]);
      })
  }

  // Add new word to Database
  addNatGeoWordDatabase(type: number, word: string, callBack){
    const data = {
      _id: null,
      type: type,
      word: word
    }

    this.http.post<{success: boolean, addElem: NatGeoWord}>('http://localhost:3000/api/games/nat-geo/add-nat-geo-word', data)
      .subscribe(result => {
        if(result.addElem){
          switch(type){
            case 0: this.countryList.push(result.addElem); this.countryListListener.next([...this.countryList]); break;
            case 1: this.cityList.push(result.addElem); this.cityListListener.next([...this.cityList]); break;
            case 2: this.lakeList.push(result.addElem); this.lakeListListener.next([...this.lakeList]); break;
            case 3: this.mountainList.push(result.addElem); this.mountainListListener.next([...this.mountainList]); break;
            case 4: this.riverList.push(result.addElem); this.riverListListener.next([...this.riverList]); break;
            case 5: this.animalList.push(result.addElem); this.animalListListener.next([...this.animalList]); break;
            case 6: this.plantList.push(result.addElem); this.plantListListener.next([...this.plantList]); break;
            case 7: this.bandList.push(result.addElem); this.bandListListener.next([...this.bandList]); break;
          }
        }
        callBack(result.success);
      })
  }

  // Update Game Points and Nat Geo
  updateNatGeo(natGeo: NatGeoData){
    const data = {
      natGeo: natGeo
    }

    this.http.post('http://localhost:3000/api/games/nat-geo/update-nat-geo', data)
      .subscribe(result => {
      })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////      OTHER     /////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // Verify Game
  verifyGame(natGeo: NatGeoData){

    const data = {
      natGeo: natGeo
    }
    this.http.post<{message: string}>('http://localhost:3000/api/games/nat-geo/verify-game', data)
      .subscribe(result => {
      })
  }

}
