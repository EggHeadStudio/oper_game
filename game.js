// Create a new Phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create a new Phaser game instance
var game = new Phaser.Game(config);

// Declare variables
var player;

// Preload game assets
function preload() {
    this.load.image('head', 'head.png');
    this.load.image('left_arm', 'left_arm.png');
    this.load.image('right_arm', 'right_arm.png');
}

// Create game objects
function create() {
    player = this.physics.add.sprite(400, 300, 'head');
    armLeft = this.physics.add.sprite(player.x - 20, player.y, 'left_arm');
    armRight = this.physics.add.sprite(player.x + 20, player.y, 'right_arm');

    // Update the initial positions of the arms to be on opposite sides of the player's head
    armLeft.x = player.x - 20;
    armLeft.y = player.y;

    armRight.x = player.x + 20;
    armRight.y = player.y;
}

// Update game logic
function update() {
    // Rotate player towards the mouse cursor
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.x, this.input.mousePointer.y) + Math.PI / 2;

    // Move player forward when the mouse button is pressed
    if (this.input.activePointer.isDown) {
        this.physics.velocityFromRotation(player.rotation - Math.PI / 2, 200, player.body.velocity);
    } else {
        player.body.setVelocity(0, 0);
    }

    // Define the distance from the head of each hand
    var handDistance = 13;

    // Calculate the offset for the left hand from the player's position
    var offsetLeft = new Phaser.Math.Vector2(-handDistance, 0).rotate(player.rotation + Math.PI / 2);

    // Calculate the offset for the right hand from the player's position
    var offsetRight = new Phaser.Math.Vector2(handDistance, 0).rotate(player.rotation - Math.PI / 2);

    // Define the pivot point for the swinging motion
    var pivot = new Phaser.Math.Vector2(player.x, player.y);

    // Calculate the swing angle for the hands
    var swingAngle = Math.sin(this.time.now / 200) * Math.PI / 4;

    // Update the position and rotation of the hands with the swing motion
    armLeft.x = pivot.x + Math.cos(player.rotation + swingAngle) * offsetLeft.length();
    armLeft.y = pivot.y + Math.sin(player.rotation + swingAngle) * offsetLeft.length();
    armLeft.rotation = player.rotation + swingAngle;

    armRight.x = pivot.x + Math.cos(player.rotation - swingAngle) * offsetRight.length();
    armRight.y = pivot.y + Math.sin(player.rotation - swingAngle) * offsetRight.length();
    armRight.rotation = player.rotation - swingAngle;
}

