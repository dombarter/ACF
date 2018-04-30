var height = window.innerHeight;
var width = window.innerWidth;


var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image("scope", "img/scope.png");
    game.load.image("pigeon", "img/pigeon.png");
    game.load.image("sky", "img/back.png");
}

var scope;
var sky;
var piegons;
var pigeon;
var score = 0;
var scoreText;
var highScore = 0;
var highScoreText;
var speed = 350;
var numberOfPigeon = 0;
var endText;
var refreshNumber = 10;
var clickOff = true;
var overPigeon = false;

function create() {
    //background
    //game.stage.backgroundColor = "#A0FFF2";
    game.add.sprite(0, 0, "sky");


    document.body.style.cursor = 'none';

    //scope
    scope = game.add.sprite(100, 100, "scope");
    game.physics.arcade.enable(scope);

    //score
    scoreText = game.add.text(10, 10, "Score: " + score, {
        font: "20px Arial",
        fill: "#383838"
    });

    //high score text
    highScoreText = game.add.text(10, 30, "High Score: " + highScore, {
        font: "20px Arial",
        fill: "#383838"
    });

    //end text
    endText = game.add.text(width / 2, height / 2, "", {
        font: "50px Arial",
        fill: "#383838"
    });
    endText.anchor.setTo(0.5, 0.5);

    pigeons = game.add.group();

    var side = leftOrRight();
    pigeon = pigeons.create(side, (height) * Math.random(), "pigeon");
    game.physics.arcade.enable(pigeon);
    pigeon.checkWorldBounds = true;
    pigeon.events.onOutOfBounds.add(pigeonReset, this);
    if (side == 0) {
        pigeon.body.velocity.x = speed;
    }
    else {
        pigeon.body.velocity.x = -(speed);
    }
    pigeon.body.velocity.y = game.rnd.integerInRange(-100, 100);
    speed += 0.5;
    numberOfPigeon++;

}

function update() {


    if (score < 0) {
        scope.kill();
        pigeons.forEach(function (pigeon) { pigeon.kill(); });
        endText.setText("Game Over");
    }

    game.world.bringToTop(scope);
    scope.body.x = this.input.activePointer.x - 35;
    scope.body.y = this.input.activePointer.y - 35;

    game.physics.arcade.overlap(scope, pigeons, hoverPigeon, null, this);


    if (numberOfPigeon == refreshNumber * 3) {

        refreshNumber = numberOfPigeon;

        var side = leftOrRight();
        pigeon = pigeons.create(side, (height) * Math.random(), "pigeon");
        game.physics.arcade.enable(pigeon);
        pigeon.checkWorldBounds = true;
        pigeon.events.onOutOfBounds.add(pigeonReset, this);
        if (side == 0) {
            pigeon.body.velocity.x = speed;
        }
        else {
            pigeon.body.velocity.x = -(speed);
        }
        pigeon.body.velocity.y = game.rnd.integerInRange(-100, 100);
        speed += 0.5;
        numberOfPigeon++;
    }

}

function leftOrRight() {
    var random = game.rnd.integerInRange(0, 1);
    if (random == 0) {
        return (0);
    }
    else if (random == 1) {
        return (width - 70);
    }
    else {
        return (0);
    }
}

function pigeonReset(pigeon) {
    pigeon.kill();
    score = score - 2;
    scoreText.setText("Score: " + score);



    var side = leftOrRight();
    pigeon = pigeons.create(side, (height) * Math.random(), "pigeon");
    game.physics.arcade.enable(pigeon);

    pigeon.checkWorldBounds = true;
    pigeon.events.onOutOfBounds.add(pigeonReset, this);

    if (side == 0) {
        pigeon.body.velocity.x = speed;
    }
    else {
        pigeon.body.velocity.x = -(speed);
    }
    pigeon.body.velocity.y = game.rnd.integerInRange(-100, 100);
    speed += 0.5;
    numberOfPigeon++;
}

function hoverPigeon(scope, pigeon) {

    if (this.game.input.activePointer.isDown) {

        pigeon.kill();

        score += 1;
        scoreText.setText("Score: " + score);

        if (score >= highScore) {
            highScore += 1;
            highScoreText.setText("High Score: " + score);
        }


        var side = leftOrRight();
        pigeon = pigeons.create(side, (height) * Math.random(), "pigeon");
        game.physics.arcade.enable(pigeon);
        pigeon.checkWorldBounds = true;
        pigeon.events.onOutOfBounds.add(pigeonReset, this);
        if (side == 0) {
            pigeon.body.velocity.x = speed;
        }
        else {
            pigeon.body.velocity.x = -(speed);
        }
        pigeon.body.velocity.y = game.rnd.integerInRange(-50, 50);

        speed += 0.5;
        numberOfPigeon++;


    }

}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}