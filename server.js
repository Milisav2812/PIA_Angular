// Includes
const app = require('./backend/app');
const http = require('http');

// Creating and  setting up the Port on which the server will run
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT);


