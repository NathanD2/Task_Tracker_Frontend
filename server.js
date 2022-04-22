const express = require('express');
const favicon = require('express-favicon');
var cors = require('cors')
const path = require('path');
require("dotenv").config();



const port = process.env.PORT || 8080;
const app = express();

// middleware
app.use(cors())
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
 return res.send('pong');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, () => {
  console.log(`Listening (locally) on ${"http://localhost:8080/"}`);
});