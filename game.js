// Create a new Phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 845,
    height: 650,
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

    this.load.image('laatta', 'laatta.png');
    this.load.image('laatta2', 'laatta2.png');

    this.load.image('lightSource', 'lightSource.png');
}

// Create game objects
function create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    // Add the background image as a tile sprite--------------------------------------------------------
    var background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'laatta');
    background.setOrigin(0);
    // Set the scale and size of the tile sprite to create a grid effect
    background.setScale(1); // Adjust the scale factor as needed
    background.setAlpha(0.3);
    var gridSize = 8; // Define the number of tiles in the grid
    background.setSize(game.config.width * gridSize, game.config.height * gridSize);
    background.setDepth(background.depth -1);

    //var imageWidth = game.config.width / gridSize;
    //var imageHeight = game.config.height / gridSize;
    //
    //// Distribute 'laatta' and 'laatta2' images in a grid next to each other
    //for (var i = 0; i < gridSize; i++) {
    //    for (var j = 0; j < gridSize; j++) {
    //        var imageName = (i + j) % 3 === 0 ? 'laatta' : 'laatta2';
    //        var image = this.add.image(i * imageWidth, j * imageHeight, imageName);
    //        image.setOrigin(0);
    //    }
    //}

    player = this.physics.add.sprite(400, 300, 'head');
    armLeft = this.physics.add.sprite(player.x - 20, player.y, 'left_arm');
    armRight = this.physics.add.sprite(player.x + 20, player.y, 'right_arm');

    //shadow or reflection-----------------------------------------------------------------------------
    shadowPlayer = this.add.sprite(player.x, player.y + 10, 'head');
    shadowPlayer.setScale(player.scaleX, player.scaleY);
    shadowPlayer.setDepth(player.depth - 1);
    shadowPlayer.setTint(0x000000); // Set the color of the shadow
    // add blur to the shadow
    shadowPlayer.preFX.addBlur(10);
    shadowPlayer.postFX.addBlur(5);

    // Add shadows to the arms
    shadowArmLeft = this.add.sprite(armLeft.x, armLeft.y + 10, 'left_arm');
    shadowArmLeft.setScale(armLeft.scaleX, armLeft.scaleY);
    shadowArmLeft.setDepth(armLeft.depth - 1);
    shadowArmLeft.setTint(0x000000);
    shadowArmLeft.preFX.addBlur(10);
    shadowArmLeft.postFX.addBlur(5);

    shadowArmRight = this.add.sprite(armRight.x, armRight.y + 10, 'right_arm');
    shadowArmRight.setScale(armRight.scaleX, armRight.scaleY);
    shadowArmRight.setDepth(armRight.depth - 1);
    shadowArmRight.setTint(0x000000);
    shadowArmRight.preFX.addBlur(10);
    shadowArmRight.postFX.addBlur(5);

    // Lisää valot------------------------------------------------------------------------------------
    //this.lights.enable().setAmbientColor(0xffffff);
    //var light = this.lights.addLight(400, 300, 200).setColor(0xffffff).setIntensity(1);

    //player.setPipeline('Light2D');
    //armLeft.setPipeline('Light2D');
    //armRight.setPipeline('Light2D');

    // Update the initial positions of the arms to be on opposite sides of the player's head----------
    armLeft.x = player.x - 20;
    armLeft.y = player.y;

    armRight.x = player.x + 20;
    armRight.y = player.y;

    // Create a graphics object ontop as light?-------------------------------------------------------
    blueLight = this.add.sprite(game.config.width / 2, game.config.height / 2, 'lightSource');
    blueLight.setScale(2, 2);
    blueLight.setDepth(2);
    blueLight.setTint(0x0000ff);
    blueLight.setAlpha(0.5);
    blueLight.preFX.addBlur(10);
    blueLight.postFX.addBlur(5);

    // Set the depth of the objects
    player.setDepth(1);
    armLeft.setDepth(0);
    armRight.setDepth(0);
}


// Update game logic
function update() {
    // Rotate player towards the mouse cursor
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.x, this.input.mousePointer.y) + Math.PI / 2;

    // shadow or reflection
    shadowPlayer.setPosition(player.x, player.y + 10);
    shadowPlayer.rotation = player.rotation;
    shadowPlayer.setAlpha(0.5);
    shadowPlayer.setScale(1);

    // Update the position and rotation of the shadow for the arms
    shadowArmLeft.setPosition(armLeft.x, armLeft.y + 10);
    shadowArmLeft.rotation = armLeft.rotation;
    shadowArmLeft.setAlpha(0.5);
    shadowArmLeft.setScale(1);
    shadowArmRight.setPosition(armRight.x, armRight.y + 10);
    shadowArmRight.rotation = armRight.rotation;
    shadowArmRight.setAlpha(0.5);
    shadowArmRight.setScale(1);

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
