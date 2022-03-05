// Includes
const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// Router Middleware
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// Defining a storage space for the images
const storage = multer.diskStorage({
  // Picking the destination folder for the images
  destination: (req, file, callBack) => {
    // The destination is relative to server.js
    callBack(null, 'backend/images');
  },
  // Creating a filename for the images
  filename: (req, file, callBack) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callBack( null, Date.now() + name );
  }
});

// Get User Info
router.get('/get-user-info:username', (req, res) => {
  Users.findOne({username: req.params.username})
    .then(user => {
      if(!user){
        return res.json({
          message: "Korisnik nije pronađen!",
          user: user
        });
      }
      res.json({
        message: "Korisnik je pronađen!",
        user: user
      });
    })
})

// Login
router.post('/login', (req, res) => {
  let foundUser;

  Users.findOne({ username: req.body.username })
    .then(user => {
      if(!user){
        return res.json({
          message: "Pogrešno korisničko ime!",
          type: -1 // Registration not approved yet
        });
      }

      if(!user.registered){
        return res.json({
          message: "Morate da sačekate da vam admin odobri registraciju!",
          type: -1 // Registration not approved yet
        });
      }else{
        foundUser = user;

        bcrypt.compare(req.body.password, foundUser.password, (error,result) => {
          if(!result){
            return res.json({
              message: "Pogrešna lozinka!",
              type: -1 // Wrong Password
            });
          }else{

            // Creating a Token
            const token = jwt.sign({username: foundUser.username},
              'secret_text',
              {expiresIn: "4h"}
            );
            userToken = token;

            res.json({
              message: "Uspešno logovanje!",
              type: foundUser.type,
              token: token,
              expiresIn: 14400,
              username: foundUser.username
            });
          }
        })
      }
    })
});

// SignUp
router.post( '/signup', multer({storage: storage}).single("image"), (req, res) => {
  // This url will be used in the imagePath
  const url = req.protocol + "://" + req.get('host');
  let imagePath = url + "/images/" + req.file.filename;

  bcrypt.hash(req.body.password, 10)
  .then(hash => {

    const user = new Users({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      occupation: req.body.occupation,
      username: req.body.username,
      password: hash,
      gender: req.body.gender,
      jmbg: req.body.jmbg,
      imagePath: imagePath,
      question: req.body.question,
      answer: req.body.answer,
      type: 2,
      registered: false
    });

    user.save()
      .then(result => {
        res.status(200).json({
          message: "Registration created!",
          response: true,
          registration: user
        });
      })
      .catch(error => {
        res.status(401).json({
          message: "Registration failed!",
          response: false,
          registration: null
        });
      });

  });

});

// Get Registrations
router.get('/registrations', checkAuth, (req, res) => {
  Users.find({ registered: false }, (error, users) => {
    res.json({
      registrations: users
    });
  })
});

// Accept Registration
router.post('/registrations/accept',checkAuth, (req, res) => {
  Users.updateOne( {username: req.body.username} , { $set: { registered: true } })
    .then(response => {
      if(response){
        res.status(200).json({
          message: "Korisnik je uspešno primljen!"
        });
      }
    })
})

// Reject Registration
router.post('/registrations/reject',checkAuth, (req, res) => {
  Users.deleteOne({ username: req.body.username })
    .then(response => {
      if(response){
        res.status(200).json({
          deleted: true
        });
      }else{
        res.status(401).json({
          deleted: false
        });
      }
    })
})

// Change Password
router.post('/pass-change', (req, res) => {
  Users.findOne({username: req.body.username})
    .then(user => {
      if(!user){
        return res.json({
          message: "Korisnik ne postoji!",
          changed: false
        });
      }else{
        bcrypt.compare(req.body.oldPass, user.password, (err, result) => {
          if(!result){
            return res.json({
              message: "Uneli ste pogrešnu lozinku",
              changed: false
            });
          }else{
            bcrypt.hash(req.body.password, 10)
              .then(hash => {
                Users.updateOne({username: req.body.username}, { $set: {password: hash} })
                  .then(result => {
                    if(!result){
                      return res.json({
                        message: "Došlo je do greške prilikom promene lozinke! Pokušajte kasnije...",
                        changed: false
                      });
                    }else{
                      res.json({
                        message: "Lozinka je uspešno promenjena!",
                        changed: true
                      });
                    }
                  })
              })

          }
        })
      }
    })
})

// Verify Username and JMBG
router.post('/validate-user', (req, res) => {
  console.log(req.body.username);
  Users.findOne({username: req.body.username, jmbg: req.body.jmbg})
    .then( result => {
      if(result){
        return res.json({
          message: "Korisnik je pronađen!",
          success: true
        });
      }else{
        return res.json({
          message: "Korisnik nije pronađen",
          success: false
        });
      }
    })
})

// Return User Question
router.post('/get-question', (req, res) => {
  Users.findOne({username: req.body.username})
    .then( result => {
      if(result){
        return res.json({
          message: result.question,
          success: true
        });
      }else{
        return res.json({
          message: null,
          success: false
        });
      }
    })
})

// Verify User's Answer
router.post('/validate-answer', (req, res) => {
  Users.findOne({username: req.body.username, answer: req.body.answer})
    .then( result => {
      if(result){
        return res.json({
          success: true
        });
      }else{
        return res.json({
          success: false
        });
      }
    })
})

// Update Password
router.post('/update-pass', (req, res) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      Users.updateOne({username: req.body.username}, { $set: { password: hash } })
        .then( () => {
              res.json({
                message: "Uspešno ažurirana lozinka!"
            })
        })
    })
})

module.exports = router;
