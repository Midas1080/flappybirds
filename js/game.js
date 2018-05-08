// Initializing Phaser and setting game dimensions is done in main.js

var Game = {};

Game.init = function () {
    //This makes sure the server keeps listening to requests even when the window is out of focus
    game.stage.disableVisibilityChange = true;
};


Game.preload = function () {
    // This function will be executed once at the beginning     
    // load images and sounds here 
    game.load.image('bird', 'assets/bird_1.png');
    game.load.image('pipe', 'assets/pipe.png');
},

Game.create = function () {
    // This function is called after the preload function     
    // set up the game, display sprites, etc.

    // to keep track of where the players are
    Game.playerMap = {};

    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird at the position x=100 and y=245
    this.bird = game.add.sprite(100, 245, 'bird');

    // Add physics to the bird
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.bird);

    // Add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

    // Create an empty group of pipes
    this.pipes = game.add.group();

    // call pipe function every 1.5 seconds 
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    //add scoring to top left corner
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
    { font: "30px Arial", fill: "#ffffff" });

    //shift anchor from bird so that animation looks nice 
    this.bird.anchor.setTo(-0.2, 0.5);

    // the client will tell the server to create a new player
    Client.askNewPlayer();
},

Game.update = function () {
    // This function is called 60 times per second    
    // It contains the game's logic   

    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

    // cal restartGame whenever collision happens
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.angle < 20)
        this.bird.angle += 1;
},

Game.jump = function () {

    // check if bird is dead because then it can't jump
    if (this.bird.alive == false)
        return;

    // Add a vertical velocity to the bird to bring it up
    this.bird.body.velocity.y = -350;

    // Create an animation on the bird
    var animation = game.add.tween(this.bird);

    // Change the angle of the bird to -20° in 100 milliseconds
    animation.to({ angle: -20 }, 100);

    // And start the animation
    animation.start();
},

// Restart the game
Game.restartGame = function () {
    // Start the 'Game' state, which restarts the game
    game.state.start('Game');
},

Game.addOnePipe = function (x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe 
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},

Game.addRowOfPipes = function () {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(400, i * 60 + 10);

    this.score += 1;
    this.labelScore.text = this.score;
},

Game.hitPipe = function () {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function (p) {
        p.body.velocity.x = 0;
    }, this);
};
