// Includes
const express = require('express');
const mongoose = require('mongoose');
const User = require('./routes/user');
const Games = require('./routes/games');
const NatGeo = require('./routes/nat-geo');
const path = require('path');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use("/images", express.static( path.join("backend/images") ));

mongoose.connect("mongodb+srv://Milos:NINETAILFOX2812@mean-course-o6wga.mongodb.net/etf-kviz?retryWrites=true&w=majority", { useNewUrlParser: true })
.then( () => {
    // Success
    console.log("Connected to database!");
} )
.catch(()=>{
    // Failure
    console.log("Connection failed!");
});

app.use((req, res, next)=>{

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      // We must include our Interceptor in this list. Otherwise it wont work
      "Origin, X-Requested-With, Content-Type, Accept, Authorization "
      );
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, PUT, OPTIONS"
      );
  // OPTIONS se salje pre npr POST da proveri da li su informacije pravilno unete
  next();
});

app.use('/api/user', User);
app.use('/api/games', Games);
app.use('/api/games/nat-geo', NatGeo);

module.exports = app;
