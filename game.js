// Create a new Phaser game configuration
var config = {
    type: Phaser.AUTO,
    width: 1560,
    height: 1560,
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
var obstacle;

// Preload game assets
function preload() {
    this.load.image('head', 'head.png');
    this.load.image('left_arm', 'left_arm.png');
    this.load.image('right_arm', 'right_arm.png');

    this.load.image('laatta', 'laatta.png');
    this.load.image('laatta2', 'laatta2.png');

    this.load.image('lightSource', 'lightSource.png');

    this.load.image('wall', 'seinä.png');
}

// Create game objects
function create() {
    //kamera asetukset----------------------------------------------------------------------------------
    this.cameras.main.setBackgroundColor('#ffffff');
    var worldSize = 1560;
    this.physics.world.setBounds(0, 0, worldSize, worldSize);
    player = this.physics.add.sprite(worldSize / 2, worldSize / 2, 'head');
    player.setOrigin(0.5, 0.5);
    
    var camera = this.cameras.main;
    camera.startFollow(player, true, 0.1, 0.1);
    camera.zoom = 1;

    // Add the background image as a tile sprite--------------------------------------------------------
    var tileWidth = 65; // laatan leveys pikseleissä
    var tileHeight = 65; // laatan korkeus pikseleissä
    var gridWidth = game.config.width / tileWidth;
    var gridHeight = game.config.height / tileHeight;
    //random distribution for the wafers
    for (var i = 0; i < gridWidth * gridHeight; i++) {
        var x = (i % gridWidth) * tileWidth;
        var y = Math.floor(i / gridWidth) * tileHeight;

        // Valitse satunnaisesti 'laatta' tai 'laatta2'
        var tileKey = Math.random() < 0.5 ? 'laatta' : 'laatta2';

        var tile = this.add.image(x, y, tileKey);
        tile.setOrigin(0);
        tile.setAlpha(0.3);
        tile.setDepth(-1);
    }

    //player = this.physics.add.sprite(400, 300, 'head');
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

    // Luo seinät-------------------------------------------------------------------------------------
    var wallThickness = 25;
    var leftWall = this.add.tileSprite(0, game.config.height / 2, wallThickness, game.config.height, 'wall');
    var rightWall = this.add.tileSprite(game.config.width, game.config.height / 2, wallThickness, game.config.height, 'wall');
    var topWall = this.add.tileSprite(game.config.width / 2, 0, game.config.width, wallThickness, 'wall');
    var bottomWall = this.add.tileSprite(game.config.width / 2, game.config.height, game.config.width, wallThickness, 'wall');

    // Aseta seinät staattisiksi
    this.physics.add.existing(leftWall, true);
    this.physics.add.existing(rightWall, true);
    this.physics.add.existing(topWall, true);
    this.physics.add.existing(bottomWall, true);

    // Aseta pelaaja ja seinät törmäämään
    this.physics.add.collider(player, [leftWall, rightWall, topWall, bottomWall]);

    // Luo este---------------------------------------------------------------------------------------
    obstacle = this.physics.add.sprite(400, 300, 'obstacle');
    // Aseta törmäykset pelaajan ja esteen välillä
    this.physics.add.collider(player, obstacle);
}
this.physics.add.collider(player, obstacle, handleCollision, null, this);

function handleCollision(player, obstacle) {
    // Törmäyksen käsittelykoodi tulee tänne
    // Esimerkiksi, vähennä pelaajan elämää
    playerHealth -= 10;
}

// Update game logic----------------------------------------------------------------------------------------------------------
function update() {
    // Rotate player towards the mouse cursor
    var pointer = this.input.activePointer;
    var angle = Phaser.Math.Angle.Between(
        player.x, 
        player.y, 
        pointer.worldX, 
        pointer.worldY
    );
    // Update player rotation in pointermove event instead of update function
    this.input.on('pointermove', function () {
        player.rotation = angle + Math.PI / 2;
    });
    // Update the pointer world coordinates
    pointer.worldX = pointer.x + this.cameras.main.scrollX;
    pointer.worldY = pointer.y + this.cameras.main.scrollY;

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
        player.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);

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
