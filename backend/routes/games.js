// Includes
const express = require('express');
const Anagram = require('../models/anagram');
const mongoose = require('mongoose');
const GameOfDay = require('../models/gameOfDay');
const GODResults = require('../models/god-results');

mongoose.set('useFindAndModify', false);

const router = express.Router();

// Get List of GODResult for 20 Days
router.get('/get-list-god-20-days', (req, res) => {
  GODResults.find({finished: true, verified: true})
    .then(godResults => {
      if(!godResults){
        return res.json({
          message: "Nije pronađen ni jedan GODResult!",
          godResults: null
        })
      }

      const todayDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      const newArray = godResults.filter(elem => {
        return todayDate.getTime() - elem.gameDate.getTime() < 86400000 * 20; // Amount of milliseconds in a day
      })

      res.status(200).json({
        message: "Pronađena je lista GODResult!",
        godResults: newArray
      })
    })
})

// Get List of GODResult for MONTH
router.get('/get-list-god-month', (req, res) => {
  GODResults.find({finished: true, verified: true})
    .then(godResults => {
      if(!godResults){
        return res.json({
          message: "Nije pronađen ni jedan GODResult!",
          godResults: null
        })
      }

      const currentMonth = new Date().getMonth();
      const newArray = godResults.filter(elem => {
        return elem.gameDate.getMonth() === currentMonth;
      })

      res.status(200).json({
        message: "Pronađena je lista GODResult!",
        godResults: newArray
      })
    })
})

// Get List GODResult for Username
router.get('/get-list-god-result:username', (req, res) => {
  GODResults.find({username: req.params.username, verified: true, finished: true})
    .then(godResults => {
      if(!godResults){
        return res.json({
          message: "Nije pronađen ni jedan GODResult!",
          godResults: null
        })
      }

      res.status(200).json({
        message: "Pronađena je lista GODResult!",
        godResults: godResults
      })
    })
})

// Delete Game of Day
router.post('/delete-game-of-day', (req, res) => {
  GODResults.find({gameDate: req.body.gameDate})
    .then(games => {
      if(games.length > 0){
        return res.json({
          message: "Igra dana ne može da se obriše nakon što je odigrana!"
        })
      }

      GameOfDay.deleteOne({gameDate: req.body.gameDate})
      .then(result => {
        if(result.deletedCount === 0){
          return res.json({
            message: "Za današnji datum nije definisana igra dana!"
          })
        }

        res.status(200).json({
          message: "Uspešno je obrisana Igra dana!"
        })
      })
    })
})

// Update GOD Result
router.post('/update-god-result', (req, res) => {
  GODResults.updateOne({username: req.body.username, gameDate: req.body.gameDate}, { $inc: { result: 2 } })
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Došlo je do greške!"
        })
      }

      res.status(200).json({
        message: "Uspešno ažuriran GOD Result!"
      })
    })
})

// Create a GOD Result
router.post('/create-god-result', (req, res) => {
  const result = new GODResults({
    username: req.body.username,
    gameDate: req.body.gameDate,
    result: 0,
    verified: false,
    finished: false
  })

  result.save()
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Nije se sačuvao GOD Result!"
        })
      }

      res.status(200).json({
        message: "Uspešno se napravio GOD Result!"
      })
    })
})

// Get List of GODResult BASED on Date
router.get('/get-list-god-date:date', (req, res) => {
  GODResults.find({gameDate: req.params.date, finished: true, verified: true})
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Nije pronađen ni jedan GODResult!",
          godResults: null
        })
      }

      res.status(200).json({
        message: "Pronađena je lista GODResult!",
        godResults: result
      })
    })
    .catch(error => {
      res.status(400).json({
        message: "CATCH Error GODResult!",
        godResults: null
      })
    })
})

// Update Game of Day
router.post('/update-game-of-day', (req, res) => {
  GameOfDay.updateOne({_id: new mongoose.Types.ObjectId(req.body.god._id) }, req.body.god)
    .then(result => {
      if(!result){
        return res.json({
          message: "Došlo je do greške prilikom ažuriranja igre"
        })
      }

      res.json({
        message: "Uspešno ažurirana igra!"
      })
    })
})

// Get one game of day result
router.post('/get-one-god-result', (req, res) => {
  GODResults.findOne({username: req.body.username, gameDate: req.body.gameDate})
    .then(godResult => {
      if(!godResult){
        return res.json({
          message: "Nisu pronađeni rezultati koje tražite!",
          godResult: null
        });
      }

      res.status(200).json({
        message: "Uspeh!",
        godResult: godResult
      });
    })
})

// Store Game of Day Result - Update Existing One
router.post('/finish-game-of-day', (req, res) => {
  GODResults.update({username: req.body.username, gameDate: req.body.gameDate},
      { $set: {
        result: req.body.result,
        verified: req.body.verified,
        finished: true
      } })
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "GREŠKA: Nije se ažurirao GOD Result"
        });
      }
      res.status(200).json({
        message: "Uspešno ste završili igru dana!"
      });
    })
})

// Get Game for Today
router.get('/get-game-today:date', (req, res) => {
  GameOfDay.findOne({gameDate: req.params.date})
    .then(foundGame => {
      if(!foundGame){
        return res.status(400).json({
          message: "GREŠKA: IGRA NIJE PRONAĐENA!",
          game: null
        });
      }

      res.status(200).json({
        message: "PRONAĐENA JE IGRA!",
        game: foundGame
      });
    })
})


// Get Game for Today ADMIN
router.get('/get-game-admin:date', (req, res) => {
  GameOfDay.findOne({gameDate: req.params.date})
    .then(foundGame => {
      if(!foundGame){
        return res.json({
          message: "Došlo je do greške!",
          game: null
        });
      }

      res.status(200).json({
        message: "Uspeh!",
        game: foundGame
      });
    })
})

// Get List of Available Dates
router.get('/get-available-dates', (req, res) => {
  GameOfDay.find()
    .then(games => {
      if(!games){
        return res.status(400).json({
          message: "Trenutno nema definisanih igara dana!",
          games: games
        });
      }

      res.status(200).json({
        message: "Success!",
        games: games
      });
    })
})


// Add game of the day in the database
router.post('/create-game-of-day', (req, res) => {
  let game = new GameOfDay({
    _id: req.body._id,
    gameDate: req.body.gameDate,
    gameDateOffset: req.body.gameDateOffset,
    anagramPhrase: req.body.anagramPhrase,
    anagramResult: req.body.anagramResult
  });

  game.save()
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Došlo je do greške!"
        });
      }

      res.status(200).json({
        message: "Igra dana je uspešno napravljena!",
        game: game
      })
    })
})

// Get ONE Anagram from database
router.get('/get-one-anagram:id', (req, res) => {
  Anagram.findOne( { _id: new mongoose.Types.ObjectId(req.params.id.substr(3)) })
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Anagram ne postoji! Došlo je do greške!",
          anagram: result
        });
      }

      res.status(200).json({
        message: "Success!",
        anagram: result
      });
    })

})

// Get list of anagrams from database
router.get('/get-anagram', (req, res) => {
  Anagram.find()
    .then(anagrams => {
      res.status(200).json({
        anagrams: anagrams
      });
    })
})

// Delete Anagram from database
router.delete('/delete-one-anagram:id', (req, res) => {
  Anagram.deleteOne({_id: new mongoose.Types.ObjectId(req.params.id.substr(3)) })
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Greška!",
          success: false
        });
      }

      res.status(200).json({
        message: "Uspeh!",
        success: true
      });

    })
})

// Add Anagram Info to database
router.post('/add-anagram-to-db', (req, res) => {
  if(!req.body.phrase || !req.body.result){
    return res.status(400).json({
      message: "Došlo je do greške zbog unetih podataka! Pokušajte ponovo"
    });
  }

  let anagram = new Anagram({
    _id: req.body._id,
    phrase: req.body.phrase,
    result: req.body.result
  });

  anagram.save()
    .then(result => {
      if(!result){
        return res.status(400).json({
          message: "Došlo je do greške prilikom čuvanja anagrama na bazu!",
          anagram: null
        });
      }else{
        return res.status(200).json({
          message: "Uspešno postavljen anagram!",
          anagram: anagram
        });
      }
    })
})

module.exports = router;
