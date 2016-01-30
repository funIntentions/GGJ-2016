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

    dances: {
        CHILLAX: 0,
        WIGGLE: 1,
        BOP: 2,
        TWIRL: 3
    },

    placeInSpot: function(character) {
        var scale = 0.25;
        var index;
        for (index = 0; index < this.spots.length; index++) {
            if (!this.spots[index].character) {
                console.log(this.spots[index]);
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
        this.selectedSpot = 0;

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

        this.input.keyboard.addKey(Phaser.KeyCode.Z).onDown.add(this.incrementSelectedSpot, this);
        this.input.keyboard.addKey(Phaser.KeyCode.X).onDown.add(this.decrementSelectedSpot, this);
        this.input.keyboard.addKey(Phaser.KeyCode.C).onDown.add(this.incrementSelectedSpot, this);
        this.input.keyboard.addKey(Phaser.KeyCode.V).onDown.add(this.decrementSelectedSpot, this);
    },

    incrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot + 1) % this.spots.length;
    },

    decrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot - 1) % this.spots.length;

        if (this.selectedSpot < 0) {this.selectedSpot = 3;}
    },

    update: function () {

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
