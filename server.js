var express = require('express'); // Express is used to serve files to client
var app = express(); // Create new Express instance called app
var server = require('http').Server(app); // Combine Express with the http module so that Express will act as http server
var io = require('socket.io').listen(server); // Require socket.io so that it can listen to the Express server

// This is how static files are served that are not accesible directly but are needed by the game
// app.use() creates virtual paths to the resources that scripts can access later 
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

// Specify what file to serve as root
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Listens to port 8080
server.listen(8080, function(){ 
    console.log('Listening on ' + server.address().port);
});

// this is to keep track of last added player ID
server.lastPlayerID = 0;

//listen for the connection event (io.connect() from client) and then fire the callback
io.on('connection', function(socket) {
    socket.on('newPlayer', function() {
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(0, 100),
            y: randomInt(20, 470)
        };
        socket.emit('allplayers', getAllPlayers());
        socket.broadcast.emit('newplayer', socket.player);
    });
});

function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID){
        var player = io.sockets.connected[socketID].player;
        //if new player connects, add him to the players array
        if (player) {
            players.push(player);
        }
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}