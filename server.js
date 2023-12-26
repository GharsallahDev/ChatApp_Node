var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
const db = require('./database/database');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./controllers/indexController');
var chatRouter = require('./controllers/chatController');

var { socketIO } = require('./services/chatService')

app.use('/', indexRouter);
app.use('/chat', chatRouter);

var server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    var notification = '';
    console.log('A user connected with socket ID: ' + socket.id);
    notification = 'A user connected with socket ID: ' + socket.id;

    io.emit('connected', notification);

    socket.on('userMessage', (message) => {
        io.emit('userMessage', message);
    });

    socket.on('typingStarted', (username) => {
        io.emit('typingStarted', username);
    });

    socket.on('typingEnded', (username) => {
        io.emit('typingEnded', username);
    });

    socket.on('disconnect', () => {
        notification = 'A user disconnected with socket ID: ' + socket.id;
        io.emit('disconnected', notification);
    });
});

server.listen(3000, () => {
    console.log("Server Started");
});