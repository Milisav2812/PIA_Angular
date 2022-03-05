// Includes
const express = require('express');
const mongoose = require('mongoose');
const GameOfDay = require('../models/gameOfDay');
const NatGeo = require('../models/nat-geo');
const GODResults = require('../models/god-results');

// Nat Geo Terms
const Country = require('../models/natGeo/country');
const City = require('../models/natGeo/city');
const Lake = require('../models/natGeo/lake');
const Mountain = require('../models/natGeo/mountain');
const River = require('../models/natGeo/river');
const Animal = require('../models/natGeo/animal');
const Plant = require('../models/natGeo/plant');
const Band = require('../models/natGeo/band');

// route: /api/games/nat-geo
const router = express.Router();

// Verify Game
router.post('/verify-game', (req, res) => {
  NatGeo.deleteOne({_id: new mongoose.Types.ObjectId(req.body.natGeo._id)})
    .then(result => {
      if(!result){
        return res.json({
          message: "Došlo je do greške!"
        })
      }

      GODResults.update({username: req.body.natGeo.username, gameDate: req.body.natGeo.gameDate}, { $set: { verified: true } })
        .then(result => {
          if(!result){
            return res.json({
              message: "Došlo je do greške!"
            })
          }
        })
    })
})

// Update Nat Geo
router.post('/update-nat-geo', (req, res) => {
  NatGeo.updateOne({_id: new mongoose.Types.ObjectId(req.body.natGeo._id)}, req.body.natGeo)
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Došlo je do greške!"
        })
      }

      res.status(200).json({
        message: "Uspešno ažurirana Igra Nat Geo!"
      })
    })
})

// Delete Nat Geo Word
router.delete('/delete-nat-geo-word:type:_id', (req, res) => {
  switch(parseInt(req.params.type)){
    case 0: Country.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 1: City.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 2: Lake.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 3: Mountain.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 4: River.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 5: Animal.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 6: Plant.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
    case 7: Band.deleteOne({_id: new mongoose.Types.ObjectId(req.params._id)}).then(result => {
      res.json({ success: result ? true : false });
    }); break;
  }
})

// Get List of Nat Geo Words
router.get('/get-list-nat-geo-words:type', (req, res) => {
  switch(parseInt(req.params.type)){
    case 0: Country.find().then(result => { res.json({ foundWords: result })}); break;
    case 1: City.find().then(result => { res.json({ foundWords: result })}); break;
    case 2: Lake.find().then(result => { res.json({ foundWords: result })}); break;
    case 3: Mountain.find().then(result => { res.json({ foundWords: result })}); break;
    case 4: River.find().then(result => { res.json({ foundWords: result })}); break;
    case 5: Animal.find().then(result => { res.json({ foundWords: result })}); break;
    case 6: Plant.find().then(result => { res.json({ foundWords: result })}); break;
    case 7: Band.find().then(result => { res.json({ foundWords: result })}); break;
  }
})

// Add NatGeo Word
router.post('/add-nat-geo-word', (req, res) => {
  switch(req.body.type){
    case 0: // Country
      const country = new Country({
        word: req.body.word
      })
      country.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: country })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 1: // City
      const city = new City({
        word: req.body.word
      })
      city.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: city })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 2: // Lake
      const lake = new Lake({
        word: req.body.word
      })
      lake.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: lake })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 3: // Mountain
      const mountain = new Mountain({
        word: req.body.word
      })
      mountain.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: mountain })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 4: // River
      const river = new River({
        word: req.body.word
      })
      river.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true,addElem: river })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 5: // Animal
      const animal = new Animal({
        word: req.body.word
      })
      animal.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: animal })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 6: // Plant
      const plant = new Plant({
        word: req.body.word
      })
      plant.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: plant })
        }).catch(error => { res.json({ success: false }) });
      break;
    case 7: // Band
      const band = new Band({
        word: req.body.word
      })
      band.save().then(result => {
          if(!result){ return res.json({ success: false }) }
          res.status(200).json({ success: true, addElem: band })
        }).catch(error => { res.json({ success: false }) });
      break;
  }
})

// Return list of nat geo for super
router.get('/get-nat-geo-list', (req, res) => {
  NatGeo.find()
    .then(natGeos => {
      res.status(200).json({
        natGeos: natGeos
      });
    })
})

// Upload Nat Geo results for super
router.post('/upload-nat-geo', (req, res) => {
  const natGeo = new NatGeo({
    _id: req.body._id,
    username: req.body.username,
    gameDate: req.body.gameDate,
    country: req.body.country,
    city: req.body.city,
    lake: req.body.lake,
    mountain: req.body.mountain,
    river: req.body.river,
    animal: req.body.animal,
    plant: req.body.plant,
    band: req.body.band,
    verified: false
  });

  natGeo.save()
    .then(result => {
      if(!result){
        return res.json({
          success: false
        });
      }

      res.status(200).json({
        success: true
      });
    })
})

// Check Nat Geo
router.post('/check-nat-geo', (req, res) => {
  switch(req.body.type){
    case 0: // Country
      Country.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 1: // City
      City.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 2: // Lake
      Lake.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 3: // Mountain
      Mountain.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 4: // River
      River.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 5: // Animal
      Animal.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 6: // Plant
      Plant.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
    case 7: // Band
      Band.findOne({word: req.body.word})
        .then(result => {
          if(!result){ return res.json({ success: false }); }
          res.json({success: true})
        }); break;
  }
})


module.exports = router;
