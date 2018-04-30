/*var height = window.innerHeight;
var width = window.innerWidth;

//http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });*/

function preload() {

    game.load.image('water', 'Images/water.png');
    game.load.image("kayak", "Images/kayak.png");
    game.load.image("paddle", "Images/paddle.png");
    game.load.image("rock", "Images/rock.png");

}

var kayak;
var cursors;
var rocks;
var paddle;
var speed = -50;
var numOfReset = 0;
var score = 0;
var scoreText;
var releaseText;
var release = 1.3;
var random;
var paddleAngleVelocity = 8;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //BACKGROUND

    game.add.sprite(0, 0, 'water');

    //KAYAK

    kayak = game.add.sprite(100, 100, "kayak");
    game.physics.arcade.enable(kayak);
    kayak.body.collideWorldBounds = true;


    //PADDLE

    paddle = game.add.sprite(17, 65, "paddle");
    game.physics.arcade.enable(paddle);
    kayak.addChild(paddle);
    paddle.anchor.setTo(0.5, 0.5);


    //ROCKS

    rocks = game.add.group();
    rocks.enableBody = true;
    for (var a = 0; a < 4; a++) {
        var rock = rocks.create((width / 6) * (a + 1), (height / 6) * (6 - a / 2), "rock");

        random = Math.random();
        if (random < 0.25) {
            rock.scale.setTo(0.5, 0.5 * 0.96);
        } else if (random >= 0.25 && random <= 0.5) {
            rock.scale.setTo(0.75, 0.75 * 0.96);
        } else if (random > 0.5 && random <= 0.75) {
            rock.scale.setTo(1, 1 * 0.96);
        } else {
            rock.scale.setTo(1.5, 1.5 * 0.96);
        }

        var newYSpeed = (speed)
        rock.body.velocity.y = newYSpeed;
        rock.body.damping = 0;
        rock.checkWorldBounds = true;
        rock.events.onOutOfBounds.add(rockReset, this);
    }

    //SCORE

    scoreText = game.add.text(20, 20, "Score: 0", {
        font: "20px Arial",
        fill: "#000000"
    });

    //RELEASE

    releaseText = game.add.text(width - 70, height - 20, "Version: " + release, {
        font: "12px Arial",
        fill: "#000000"
    });

    //CURSORS

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(rocks, rocks);

    game.physics.arcade.overlap(kayak, rocks, hitRock, null, this);

    //LEFT
    if (cursors.left.isDown) {

        kayak.body.velocity.x = -300;

        if (paddle.angle > 45) {
            paddleAngleVelocity = -8;
        }
        else if (paddle.angle < -45) {
            paddleAngleVelocity = 8;
        }
    }

    //RIGHT
    else if (cursors.right.isDown) {

        kayak.body.velocity.x = 300;

        if (paddle.angle > 45) {
            paddleAngleVelocity = -8;
        }
        else if (paddle.angle < -45) {
            paddleAngleVelocity = 8;
        }

    }

    else {
        kayak.body.velocity.x = 0;
    }

    //DOWN
    if (cursors.down.isDown) {

        kayak.body.velocity.y = 150;
        if (paddle.angle > 45) {
            paddleAngleVelocity = -8;
        }
        else if (paddle.angle < -45) {
            paddleAngleVelocity = 8;
        }
    }

    else {
        kayak.body.velocity.y = speed;
    }

    if (cursors.down.isDown || cursors.left.isDown || cursors.right.isDown) {
        paddle.angle += paddleAngleVelocity;
    }



}

function hitRock(kayak, rock) {
    this.game.state.end();
}

function rockReset(rock) {

    score++;
    scoreText.setText("Score: " + score);
    numOfReset = numOfReset + 0.25;

    rock.kill();

    var randomWidth = width * Math.random();
    var rock = rocks.create(randomWidth, height, "rock");

    random = Math.random();
    if (random < 0.25) {
        rock.scale.setTo(0.5, 0.5 * 0.96);
    } else if (random >= 0.25 && random <= 0.5) {
        rock.scale.setTo(0.75, 0.75 * 0.96);
    } else if (random > 0.5 && random <= 0.75) {
        rock.scale.setTo(1, 1 * 0.96);
    } else {
        rock.scale.setTo(1.5, 1.5 * 0.96);
    }

    var newYSpeed = (speed)
    rock.body.velocity.y = newYSpeed;
    rock.body.damping = 0;
    rock.checkWorldBounds = true;
    rock.events.onOutOfBounds.add(rockReset, this);



    if (numOfReset % 5 == 0) {

        speed = speed - 20;

        var randomWidth = width * Math.random();
        var rock = rocks.create(randomWidth, height, "rock");

        random = Math.random();
        if (random < 0.25) {
            rock.scale.setTo(0.5, 0.5 * 0.96);
        } else if (random >= 0.25 && random <= 0.5) {
            rock.scale.setTo(0.75, 0.75 * 0.96);
        } else if (random > 0.5 && random <= 0.75) {
            rock.scale.setTo(1, 1 * 0.96);
        } else {
            rock.scale.setTo(1.5, 1.5 * 0.96);
        }

        var newYSpeed = (speed)
        rock.body.velocity.y = newYSpeed;
        rock.body.damping = 0;
        rock.checkWorldBounds = true;
        rock.events.onOutOfBounds.add(rockReset, this);
    }

}

function rockOverlap(rock1, rock2) {
    rock1.kill();
    rock2.kill();
    for (var a = 0; a < 2; a++) {
        var rock = rocks.create(width * Math.random(), height, "rock");

        random = Math.random();
        if (random < 0.25) {
            rock.scale.setTo(0.5, 0.5 * 0.96);
        } else if (random >= 0.25 && random <= 0.5) {
            rock.scale.setTo(0.75, 0.75 * 0.96);
        } else if (random > 0.5 && random <= 0.75) {
            rock.scale.setTo(1, 1 * 0.96);
        } else {
            rock.scale.setTo(1.5, 1.5 * 0.96);
        }

        var newYSpeed = (speed)
        rock.body.velocity.y = newYSpeed;
        rock.body.damping = 0;
        rock.checkWorldBounds = true;
        rock.events.onOutOfBounds.add(rockReset, this);
    }
}