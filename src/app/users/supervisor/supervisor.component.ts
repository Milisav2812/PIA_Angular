import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnagramData } from './anagram.model';
import { NgForm } from '@angular/forms';
import { GamesService } from '../games.service';
import { Subscription } from 'rxjs';
import { NatGeoData } from '../user/game/nat-geo.model';
import { DatePipe } from '@angular/common';
import { Registration } from 'src/app/auth/registration.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NatGeoWord } from './nat-geo-word.model';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit, OnDestroy {

  // Nat Geo Add Words
  country: string = null;
  city: string = null;
  lake: string = null;
  mountain: string = null;
  river: string = null;
  animal: string = null;
  plant: string = null;
  band: string = null;

  // Nat Geo Lists
  countryList: NatGeoWord[] = [];
  countryListSub: Subscription;
  countryID: string = "";

  cityList: NatGeoWord[] = [];
  cityListSub: Subscription;
  cityID: string = "";

  lakeList: NatGeoWord[] = [];
  lakeListSub: Subscription;
  lakeID: string = "";

  mountainList: NatGeoWord[] = [];
  mountainListSub: Subscription;
  mountainID: string = "";

  riverList: NatGeoWord[] = [];
  riverListSub: Subscription;
  riverID: string = "";

  animalList: NatGeoWord[] = [];
  animalListSub: Subscription;
  animalID: string = "";

  plantList: NatGeoWord[] = [];
  plantListSub: Subscription;
  plantID: string = "";

  bandList: NatGeoWord[] = [];
  bandListSub: Subscription;
  bandID: string = "";

  deleteWordID: string = "";

  anagrams: AnagramData[];
  anagramSub: Subscription;
  deleteAnagramID: string;

  userInfo: Registration = null;
  showInfo: boolean = false;

  natGeos: NatGeoData[];
  natGeosSub: Subscription;

  constructor(private gamesService: GamesService, private authService: AuthService) { }

  ngOnInit() {

    const username = localStorage.getItem('username');
    // Loading User Info
    this.authService.getUserInfoDatabase(username, (user: Registration) => {
      this.userInfo = user;
      this.showInfo = true;
    })

    this.gamesService.getAnagramsFromDatabase();
    this.gamesService.getNatGeoListDatabase();

    this.natGeos = this.gamesService.getNatGeoSuper();
    this.natGeosSub = this.gamesService.getNatGeoSuperListener()
      .subscribe(result => {
        this.natGeos = result;

        this.natGeos.forEach(nat => {
          console.log(nat.band);
          nat.gameDate = new Date( new Date(nat.gameDate).getTime() );
        })
      })

    this.anagrams = this.gamesService.getAnagrams();
    this.anagramSub = this.gamesService.getGamesAnagramListener()
      .subscribe(result => {
        this.anagrams = result;
      })

    // Nat Geo Lists
    for(var i = 0; i <= 7; i ++){
      this.gamesService.getListNatGeoWords(i);
    }

    this.countryList = this.gamesService.getCountryList();
    this.countryListSub = this.gamesService.getCountryListListener()
      .subscribe(result => {
        this.countryList = result;
      })

    this.cityList = this.gamesService.getCityList();
    this.cityListSub = this.gamesService.getCityListListener()
      .subscribe(result => {
        this.cityList = result;
      })

    this.lakeList = this.gamesService.getLakeList();
    this.lakeListSub = this.gamesService.getLakeListListener()
      .subscribe(result => {
        this.lakeList = result;
      })

    this.mountainList = this.gamesService.getMountainList();
    this.mountainListSub = this.gamesService.getMountainListListener()
      .subscribe(result => {
        this.mountainList = result;
      })

    this.riverList = this.gamesService.getRiverList();
    this.riverListSub = this.gamesService.getRiverListListener()
      .subscribe(result => {
        this.riverList = result;
      })

    this.animalList = this.gamesService.getAnimalList();
    this.animalListSub = this.gamesService.getAnimalListListener()
      .subscribe(result => {
        this.animalList = result;
      })

    this.plantList = this.gamesService.getPlantList();
    this.plantListSub = this.gamesService.getPlantListListener()
      .subscribe(result => {
        this.plantList = result;
      })

    this.bandList = this.gamesService.getBandList();
    this.bandListSub = this.gamesService.getBandListListener()
      .subscribe(result => {
        this.bandList = result;
      })
  }

  ngOnDestroy(){
    this.anagramSub.unsubscribe();
  }

  onAddAnagram(form: NgForm){
    if(form.invalid){
      return;
    }
    this.gamesService.addAnagramToDatabase(form.value.phrase, form.value.result);
    form.resetForm();
  }

  onAnagramDelete(){
    if(this.deleteAnagramID){

      this.gamesService.deleteOneAnagramDatabase(this.deleteAnagramID);

    }else{
      alert("Morate izabrati anagram za brisanje!");
    }

  }

  addNatGeoInfo(type: number, word: string){
    this.gamesService.addNatGeoWordDatabase(type, word, (success) => {
      if(!success){
        alert("Došlo je do greške!");
      }else{
        alert("Uspešno je dodat element u bazu!");
        this.deleteNatGeoElem(type, word, true);
      }
    });
  }

  deleteNatGeoElem(type: number, word: string, givePoints: boolean = false){
    let natGeo: NatGeoData;
    switch(type){
      case 0: natGeo = this.natGeos.find(x => x.country === word); natGeo.country = null; break;
      case 1: natGeo = this.natGeos.find(x => x.city === word); natGeo.city = null; break;
      case 2: natGeo = this.natGeos.find(x => x.lake === word); natGeo.lake = null; break;
      case 3: natGeo = this.natGeos.find(x => x.mountain === word); natGeo.mountain = null; break;
      case 4: natGeo = this.natGeos.find(x => x.river === word); natGeo.river = null; break;
      case 5: natGeo = this.natGeos.find(x => x.animal === word); natGeo.animal = null; break;
      case 6: natGeo = this.natGeos.find(x => x.plant === word); natGeo.plant = null; break;
      case 7: natGeo = this.natGeos.find(x => x.band === word); natGeo.band = null; break;
    }

    if(givePoints){
      this.gamesService.updateGODResult(natGeo.username, natGeo.gameDate);
    }
    this.gamesService.updateNatGeo(natGeo);

  }

  verifyGame(id: string){
    const natGeo = this.natGeos.find(x => x._id === id);

    if(natGeo.country || natGeo.city || natGeo.lake || natGeo.mountain || natGeo.river || natGeo.animal || natGeo.plant || natGeo.band){
      alert("Niste obradili sva polja!");
    }
    else{
      natGeo.verified = true;
      this.gamesService.verifyGame(natGeo);
    }

  }

  // Add Nat Geo Words
  addNatGeoWord(type: number, word: string){
    if(!word){
      console.log(type + " " + word);
      alert("Greska");
      return;
    }else{

      this.gamesService.addNatGeoWordDatabase(type, word.toUpperCase().trim(), (success: boolean) => {
        if(!success){
          alert("Došlo je do greške prilikom dodavanja reči u bazu!");
        }else{
          alert("Uspešno ste dodali reč u bazu!");
        }
      })

      // Flush values
      this.country = null;
      this.city = null;
      this.lake = null;
      this.mountain = null;
      this.river = null;
      this.animal = null;
      this.plant = null;
      this.band = null;

    }
  }

  deleteNatGeoWord(type: number, id: string){
    if(id){
      this.gamesService.deleteNatGeoWord(type, id);
      this.countryID = this.cityID = this.lakeID = this.mountainID = this.riverID = this.animalID = this.plantID = this.bandID = "";
    }
  }

}
