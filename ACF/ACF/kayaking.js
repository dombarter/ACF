var height = window.innerHeight;
var width = window.innerWidth;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('water', 'img/water.png');
    game.load.image("kayak", "img/kayak.png");
    game.load.spritesheet("kayakbody", "img/kayakbody.png", 200, 136, 9);
    game.load.image("rock1", "img/rock1.png");
    game.load.image("rock2", "img/rock2.png");
    game.load.image("rock3", "img/rock3.png");
    game.load.image("rock4", "img/rock4.png");
    game.load.image("rock5", "img/rock5.png");
    game.load.image("rock6", "img/rock6.png");
    game.load.image("rock7", "img/rock7.png");
    game.load.image("log1", "img/log1.png");
    game.load.image("log2", "img/log2.png");
    game.load.image("heart1", "img/heart.png");
    game.load.image("heart2", "img/heart.png");
    game.load.image("heart3", "img/heart.png");
}

function randomRock() {
    var random = game.rnd.integerInRange(0, 8);
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
    else if (random == 7) {
        return "log1";
    }
    else if (random == 8) {
        return "log2";
    }
}

var kayak;
var kayakBody;
var cursors;
var scoreText;
var score = 0;
var rocks;
var rock;
var speed = -120
var heart1;
var heart2;
var heart3;
var kayakSpeed = 300;
var extraRock = 0;
var numberOfRocks = 0;
var rockAdditionNumber = 10;
var livesLeft = 3;
var endText;

function create() {
    //background
    game.add.sprite(0, 0, 'water');

    //kayak
    kayak = game.add.sprite(100, 100, "kayak");
    game.physics.arcade.enable(kayak);
    kayak.body.collideWorldBounds = true;

    //kayak body
    kayakBody = game.add.sprite(21, 145, "kayakbody");
    game.physics.arcade.enable(kayakBody);
    kayak.addChild(kayakBody);
    kayakBody.anchor.setTo(0.5, 0.5);
    kayakBody.frame = 4;

    //kayak body animations
    kayakBody.animations.add("paddle-forwards", [4, 5, 6, 5, 4, 3, 2, 3], 10, true, true);
    kayakBody.animations.play("paddle-forwards");

    //cursors
    cursors = game.input.keyboard.createCursorKeys();

    //score
    scoreText = game.add.text(10, 10, "Score: " + score, {
        font: "20px Arial",
        fill: "#383838"
    });

    //hearts
    heart1 = game.add.image(width - 50, 10, "heart1");
    heart2 = game.add.image(width - 90, 10, "heart2");
    heart3 = game.add.image(width - 130, 10, "heart3");
    heart1.scale.setTo(0.7, 0.7);
    heart2.scale.setTo(0.7, 0.7);
    heart3.scale.setTo(0.7, 0.7);

    //rocks
    rocks = game.add.group();

    for (var a = 0; a < 5; a++) {
        rock = rocks.create((width - 80) * Math.random(), (height - 50) - (a * 50), randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);
        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;
    }

    //end text
    endText = game.add.text(width / 2, height / 2, "", {
        font: "50px Arial",
        fill: "#383838"
    });
    endText.anchor.setTo(0.5, 0.5);

}

function update() {

    game.physics.arcade.overlap(rocks, kayak, hitRock, null, this);

    //left
    if (cursors.left.isDown) {
        kayak.body.velocity.x = -(kayakSpeed);
    }
    //right
    else if (cursors.right.isDown) {
        kayak.body.velocity.x = (kayakSpeed);
    }
    else {
        kayak.body.velocity.x = 0;
    }

    //down
    if (cursors.down.isDown) {
        kayak.body.velocity.y = 100;
    }
    else {
        kayak.body.velocity.y = speed;
    }

    if (this.game.input.activePointer.isDown) {

        game.physics.arcade.moveToPointer(kayak, kayakSpeed);
    }


}

function hitRock(player, rock) {
    rock.kill();
    livesLeft = livesLeft - 1;
    extraRock += 1;
    if (livesLeft == 0) {
        heart1.kill();
        kayak.kill();
        rocks.forEach(function (rock) { rock.kill(); });
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

function rockReset(rock) {
    numberOfRocks++;
    speed = speed + 0.5;
    kayakSpeed = kayakSpeed + 0.5;
    rock.kill();
    score = score + 1;
    scoreText.setText("Score: " + score);

    rock = rocks.create((width - 80) * Math.random(), height - 80, randomRock());
    rock.events.onOutOfBounds.add(rockReset, this);
    game.physics.arcade.enable(rock);
    rock.checkWorldBounds = true;
    rock.body.velocity.y = speed;

    if (numberOfRocks >= (rockAdditionNumber * 2)) {

        rockAdditionNumber = numberOfRocks;

        rock = rocks.create((width - 80) * Math.random(), height - 110, randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);
        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;

    }
    var amount = extraRock;
    for (var a = 0; a < amount; a++) {
        rock = rocks.create((width - 80) * Math.random(), height - 95, randomRock());
        rock.events.onOutOfBounds.add(rockReset, this);
        game.physics.arcade.enable(rock);
        rock.checkWorldBounds = true;
        rock.body.velocity.y = speed;
        extraRock = extraRock - 1;
    }
}