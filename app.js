const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();
global.utils = require('./utils/global');
require('./routes')(app);

require('./utils/cron').setCron();

let server;
switch(process.env.NODE_ENV){
  case 'development':    
    server = http.Server(app);    
    break;

  case 'production':
    // Certificate
    try {
      const privateKey = fs.readFileSync('/etc/letsencrypt/live/dna.soyoungpark.me/privkey.pem', 'utf8');
      const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain/cert.pem', 'utf8');
      const ca = fs.readFileSync('/etc/letsencrypt/live/dna.soyoungpark.me/chain.pem', 'utf8');

      const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
      };
      
      server = https.Server(credentials, app);
    } catch (error) {
      console.log(error);
    }
    break;

  default:
    return;
}

server.listen(process.env.PORT, process.env.HOST, () => {
  console.info('[DNA-UserApiServer] Listening on port %s at %s', 
  process.env.PORT, process.env.HOST);
});

module.exports = app;