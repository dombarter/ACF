var height = window.innerHeight;
var width = window.innerWidth;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet("climber", "img/climber.png", 70, 135, 5);
    game.load.image("wall", "img/wall.png");
    game.load.image("star", "img/star.png");
    game.load.image("rock1", "img/rock1.png");
    game.load.image("rock2", "img/rock2.png");
    game.load.image("rock3", "img/rock3.png");
    game.load.image("rock4", "img/rock4.png");
    game.load.image("rock5", "img/rock5.png");
    game.load.image("rock6", "img/rock6.png");
    game.load.image("rock7", "img/rock7.png");
    game.load.image("heart1", "img/heart.png");
    game.load.image("heart2", "img/heart.png");
    game.load.image("heart3", "img/heart.png");

}

var climber;
var wall;
var cursors;
var scoreText;
var startText;
var score = 0;
var stars;
var speed = 210;
var rocks;
var rock;
var numberOfRocks = 0;
var rockAdditionNumber = 12;
var gameStarted = false;
var heart1;
var heart2;
var heart3;
var livesLeft = 3;
var endText;
var extraRock = 0;
var climberSpeed = 350;


function create() {
    //background
    wall = game.add.sprite(0, 0, 'wall');

    //cursors
    cursors = game.input.keyboard.createCursorKeys();

    //star
    stars = game.add.group();

    //score
    scoreText = game.add.text(10, 10, " ", {
        font: "20px Arial",
        fill: "#383838"
    });

    //rocks
    rocks = game.add.group();

    //bounds
    game.physics.setBoundsToWorld();

    //start text
    startText = game.add.text(width / 2, height / 2, "Press Any Key To Start", {
        font: "50px Arial",
        fill: "#383838"
    });
    startText.anchor.setTo(0.5, 0.5);

    //end text
    endText = game.add.text(width / 2, height / 2, "", {
        font: "50px Arial",
        fill: "#383838"
    });
    endText.anchor.setTo(0.5, 0.5);
}

function update() {

    if (gameStarted == false) {
        //key press
        this.game.input.keyboard.onDownCallback = function (e) {
            if (gameStarted == false) {
                startText.setText(""); gameStarted = true; addAllAssets();
            }
        };

        //mouse click
        if (this.game.input.activePointer.isDown) {
            startText.setText(""); gameStarted = true; addAllAssets();
        }
    }
    else {
        game.physics.arcade.overlap(climber, stars, collectStar, null, this);

        game.physics.arcade.overlap(rocks, climber, hitRock, null, this);

        //left
        if (cursors.left.isDown) {
            climber.body.velocity.x = -(climberSpeed);

        }
        //right
        else if (cursors.right.isDown) {
            climber.body.velocity.x = climberSpeed;
        }


        else if (this.game.input.activePointer.isDown) {

            if (this.input.activePointer.x < (width / 2)) {
                climber.body.velocity.x = -200;
            }
            if (this.input.activePointer.x > (width / 2)) {
                climber.body.velocity.x = 200;
            }
        }
        else {
            climber.body.velocity.x = 0;
        }

    }
}

function starReset(star) {
    star.kill();

    var star = stars.create((width - 50) * Math.random(), 0, "star");
    star.events.onOutOfBounds.add(starReset, this);
    game.physics.arcade.enable(star);
    star.checkWorldBounds = true;
    star.body.velocity.y = speed;
}

function collectStar(climber, star) {
    star.kill();

    var star = stars.create((width - 50) * Math.random(), 0, "star");
    game.physics.arcade.enable(star);
    star.checkWorldBounds = true;
    star.events.onOutOfBounds.add(starReset, this);
    star.body.velocity.y = speed;

    score++
    scoreText.setText("Score: " + score);
    return null;
}

function randomRock() {
    var random = game.rnd.integerInRange(0, 6);
    if (random == 0) {
        return "rock1";
    }
    else if (random == 1) {
        return "rock2";
    }
    else if (random == 2) {
        return "rock3";
    }
    else if (random == 3) {
        return "rock4";
    }
    else if (random == 4) {
        return "rock5";
    }
    else if (random == 5) {
        return "rock6";
    }
    else if (random == 6) {
        return "rock7";
    }
}

function rockReset(rock) {
    numberOfRocks++;
    speed = speed + 0.5;
    climberSpeed = climberSpeed + 0.5;
    rock.kill();
    rock = rocks.create((width - 80) * Math.random(), 0, randomRock());
    rock.events.onOutOfBounds.add(rockReset, this);
    game.physics.arcade.enable(rock);
    rock.checkWorldBounds = true;
    rock.body.velocity.y = speed;




    if (numberOfRocks >= (rockAdditionNumber * 2)) {

        rockAdditionNumber = numberOfRocks;

        rock = rocks.create((width - 80) * Math.random(), 15, randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);
        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;

        var star = stars.create((width - 50) * Math.random(), 15, "star");
        star.events.onOutOfBounds.add(starReset, this);
        game.physics.arcade.enable(star);
        star.checkWorldBounds = true;
        star.body.velocity.y = speed;
    }
    var amount = extraRock;
    for (var a = 0; a < amount; a++) {
        rock = rocks.create((width - 80) * Math.random(), 0, randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);
        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;
        extraRock = extraRock - 1;
    }
}

function hitRock(player, rock) {
    rock.kill();
    livesLeft = livesLeft - 1;
    extraRock += 1;
    if (livesLeft == 0) {
        heart1.kill();
        player.kill();

        rocks.forEach(function (rock) { rock.kill(); });
        stars.forEach(function (star) { star.kill(); });
        endText.setText("Game Over");
    }
    else {
        if (livesLeft == 2) {
            heart3.kill();
        }
        if (livesLeft == 1) {
            heart2.kill();
        }
    }

}

function addAllAssets() {
    //rocks
    for (var a = 0; a < 3; a++) {
        rock = rocks.create((width - 80) * Math.random(), a * 100, randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);

        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;
    }

    //score
    scoreText.setText("Score: " + score);

    //star
    var star = stars.create((width - 50) * Math.random(), 50, "star");
    star.events.onOutOfBounds.add(starReset, this);
    game.physics.arcade.enable(star);
    star.checkWorldBounds = true;

    star.body.velocity.y = speed;
    //climber
    climber = game.add.sprite(500, height - (height / 10 + 100), "climber");
    game.physics.arcade.enable(climber);
    climber.body.collideWorldBounds = true;

    //animations
    climber.animations.add("climb", [0, 1, 2, 3, 4, 3, 2, 1], 10, true, true);
    climber.animations.play("climb");

    heart1 = game.add.image(width - 50, 10, "heart1");
    heart2 = game.add.image(width - 90, 10, "heart2");
    heart3 = game.add.image(width - 130, 10, "heart3");
    heart1.scale.setTo(0.7, 0.7);
    heart2.scale.setTo(0.7, 0.7);
    heart3.scale.setTo(0.7, 0.7);
}