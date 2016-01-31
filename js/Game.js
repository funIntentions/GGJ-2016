BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

    placeInSpot: function(character) {
        var scale = 0.25;
        var index;
        for (index = 0; index < this.spots.length; index++) {
            if (!this.spots[index].character) {
                character.sprite.anchor.setTo(0.5, 0.5);
                character.sprite.scale.setTo(this.spots[index].flip ? -scale : scale, scale)
                character.sprite.position = this.spots[index].position;
                this.spots[index].character = character;
                break;
            }
        }
    },

    create: function () {
        this.spots = [];
        this.runes = [];
        this.selectedSpot = 0;
        this.spawnMin = 10;
        this.spawnMax = 15;
        this.runeLifeTime = 6;
        this.runeYOffset = 100;

        var distToFire = 100;

        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX, this.world.centerY + distToFire), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX, this.world.centerY - distToFire), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX - distToFire, this.world.centerY), true, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX + distToFire, this.world.centerY), false, null));


        var background = this.add.sprite(0, 0, 'background');
        var hubert = new Character(this.add.sprite(0, 0, 'hubert'));
        var emmis = new Character(this.add.sprite(0, 0, 'hubert'));

        this.placeInSpot(hubert);
        this.placeInSpot(emmis);

        this.input.keyboard.addKey(Phaser.KeyCode.RIGHT).onDown.add(this.incrementSelectedSpot, this);
        this.input.keyboard.addKey(Phaser.KeyCode.LEFT).onDown.add(this.decrementSelectedSpot, this);

        this.input.keyboard.addKey(Phaser.KeyCode.Z).onDown.add(this.chillaxDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.X).onDown.add(this.wiggleDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.C).onDown.add(this.bopDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.V).onDown.add(this.twirlDance, this);

        this.time.events.add(Phaser.Timer.SECOND * this.spawnMin, this.spawnFireRune, this);
    },

    spawnFireRune: function() {
        var fireSpot = this.rnd.integerInRange(0, this.spots.length - 1);
        var danceType = this.rnd.integerInRange(0, dances.DANCE_COUNT - 1);
        var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'hubert');
        runeSprite.anchor.setTo(0.5, 0.5);
        runeSprite.scale.setTo(0.25);
        var rune = new FireRune(runeSprite, new PIXI.Point(this.spots[fireSpot].position.x, this.spots[fireSpot].position.y - this.runeYOffset), this.runeLifeTime, danceType);
        this.runes.push(rune);
        this.add.tween(runeSprite).to({x: rune.targetPosition.x, y: rune.targetPosition.y}, 5000, 'Linear', true);
        var secondsUntilNextRune = this.rnd.integerInRange(this.spawnMin, this.spawnMax);
        this.time.events.add(Phaser.Timer.SECOND * secondsUntilNextRune, this.spawnFireRune, this);
    },

    updateRunes: function() {
        var index;
        var runesToDestroy = [];

        for (index = 0; index < this.runes.length; index++) {
            var rune = this.runes[index];
            switch (rune.state) {
                case runeStates.MOVING:
                    if (rune.sprite.position.distance(rune.targetPosition) < 0.1) {
                        rune.state = runeStates.ARRIVED;
                    }
                    break;
                case runeStates.ARRIVED:
                    rune.lifeTime -= this.time.physicsElapsed;
                    if (rune.lifeTime < 3) {
                        this.add.tween(rune.sprite).to({alpha: 0}, 1000, 'Linear', true, 0, -1, true);
                        rune.state = runeStates.DYING;
                    }
                    break;
                case runeStates.DYING:
                    rune.lifeTime -= this.time.physicsElapsed;
                    if (rune.lifeTime < 0) {
                        runesToDestroy.push(rune);
                    }
                break;
                default:
                console.log("oops...")
            }
        }

        for (index = 0; index < runesToDestroy.length; index++) {
            var indexOf = this.runes.indexOf(runesToDestroy[index]);
            var removedRune = this.runes.splice(indexOf, 1)[0];
            removedRune.sprite.kill();
        }
    },

    incrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot + 1) % this.spots.length;
    },

    decrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot - 1) % this.spots.length;

        if (this.selectedSpot < 0) {this.selectedSpot = 3;}
    },

    chillaxDance: function() {
        this.spots[this.selectedSpot].character.danceState = dances.CHILLAX;
    },

    wiggleDance: function() {
        this.spots[this.selectedSpot].character.danceState = dances.WIGGLE;
    },

    bopDance: function() {
        this.spots[this.selectedSpot].character.danceState = dances.BOP;
    },

    twirlDance: function() {
        this.spots[this.selectedSpot].character.danceState = dances.TWIRL;
    },

    update: function () {
        this.updateRunes();
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
