function gameGo(game) {
    document.getElementById("main-page").style.display = "none";
    if (game == "pigeon") {       
        pigeon();
    }
    else if (game == "kayaking") {       
        kayaking();
    }
    else if (game == "climbing") {        
        climbing();
    }
}

function climbing() {

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

        //end text
        endText = game.add.text(width / 2, height / 2, "", {
            font: "50px Arial",
            fill: "#383838"
        });
        endText.anchor.setTo(0.5, 0.5);

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

    function update() {



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


}

function kayaking() {
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
}

function pigeon() {
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
}
