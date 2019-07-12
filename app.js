const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// init Nexmo

const nexmo = new Nexmo ({
    apiKey: '560dd9e7',
    apiSecret: 'U2wLrf2MeSPTX9zn'
}, { debug: true });

// init app
const app = express();

// template engine
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// public folder 
app.use(express.static(__dirname + '/public'));

// parser middleware
