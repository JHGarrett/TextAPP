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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// index route
app.get('/', (req, res) => {
    res.render('index');
});

// catch form
app.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(req.body);
    const { number, text } = req.body;

    nexmo.message.sendSms(
      '18474605091', number, text, {type: 'unicode' },
      (err, responseData) => {
          if(err) {
              console.log(err);
          } else {
              const { messages } = responseData;
              const { ['message-id']: id, ['to']: number, ['error-text']: error } = messages[0];
              console.log(responseData);

            //   get data
            const data = {
                id, 
                number,
                error
            };

            // emmit to client
            io.emit('smsStatus', data);
          }
      }  
    );
});

// port
const port = 8080

// starting server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
});