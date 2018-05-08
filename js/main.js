var game = new Phaser.Game(400, 490, Phaser.AUTO, document.getElementById('game'));

// Add the 'Game state' and call it 'Game'
game.state.add('Game', Game);

// Start the state to actually start the game
game.state.start('Game');
