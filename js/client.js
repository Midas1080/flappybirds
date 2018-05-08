var Client = {};

//This will create a socket. Sockets are endpoints in the communication between server and client
//we store the socket of the client in Client.socket for future use.
Client.socket = io.connect(); // initialize connection to server (localhost)

Client.askNewPlayer = function() {
    //send message to the server
    Client.socket.emit('newPlayer');
}

