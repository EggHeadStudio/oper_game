//asennettavat plugarit:
// npm install phaser3-lights-plugin


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
    this.cameras.main.setBackgroundColor('#ffffff'); // Valkoinen tausta

    player = this.physics.add.sprite(400, 300, 'head');
    armLeft = this.physics.add.sprite(player.x - 20, player.y, 'left_arm');
    armRight = this.physics.add.sprite(player.x + 20, player.y, 'right_arm');

    // Lisää valot ja varjot
    this.lights.enable().setAmbientColor(0xffffff);
    var light = this.lights.addLight(400, 300, 200).setColor(0xffffff).setIntensity(1);

    player.setPipeline('Light2D');
    armLeft.setPipeline('Light2D');
    armRight.setPipeline('Light2D');

    // Update the initial positions of the arms to be on opposite sides of the player's head
    armLeft.x = player.x - 20;
    armLeft.y = player.y;

    armRight.x = player.x + 20;
    armRight.y = player.y;

    // Set the depth of the objects
    player.setDepth(1);
    armLeft.setDepth(0);
    armRight.setDepth(0);
}


// Update game logic
function update() {
    // Rotate player towards the mouse cursor
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.x, this.input.mousePointer.y) + Math.PI / 2;

    // Move player forward when the mouse button is pressed
    if (this.input.activePointer.isDown) {
        this.physics.velocityFromRotation(player.rotation - Math.PI / 2, 200, player.body.velocity);

        // Define the pivot point for the swinging motion
        var pivot = new Phaser.Math.Vector2(player.x, player.y);

        // Calculate the swing angle for the hands
        var swingAngle = Math.sin(this.time.now / 200) * Math.PI / 8;

        // Update the position and rotation of the hands with the swing motion
        armLeft.x = pivot.x - 25 * Math.cos(player.rotation) + Math.sin(player.rotation) * swingAngle * 25;
        armLeft.y = pivot.y - 25 * Math.sin(player.rotation) - Math.cos(player.rotation) * swingAngle * 25;
        armLeft.rotation = player.rotation;

        armRight.x = pivot.x + 25 * Math.cos(player.rotation) - Math.sin(player.rotation) * swingAngle * 25;
        armRight.y = pivot.y + 25 * Math.sin(player.rotation) + Math.cos(player.rotation) * swingAngle * 25;
        armRight.rotation = player.rotation;
    } else {
        player.body.setVelocity(0, 0);
        // Set the arms to the sides of the player and rotate them with the player's head
        var pivot = new Phaser.Math.Vector2(player.x, player.y);
        
        // Simulate breathing by moving arms in and out in x-direction
        var breathAmount = Math.sin(this.time.now / 500) * 2;
        
        armLeft.x = pivot.x - (25 + breathAmount) * Math.cos(player.rotation);
        armLeft.y = pivot.y - (25 + breathAmount) * Math.sin(player.rotation);
        armLeft.rotation = player.rotation;
        
        armRight.x = pivot.x + (25 + breathAmount) * Math.cos(player.rotation);
        armRight.y = pivot.y + (25 + breathAmount) * Math.sin(player.rotation);
        armRight.rotation = player.rotation;
    }  
}
