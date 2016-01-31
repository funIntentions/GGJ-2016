
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		//this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('hubert', 'assets/img/Hubert.png');
        this.load.image('gourdis', 'assets/img/Gourdis.png');
        this.load.image('alfonso', 'assets/img/Alfonso.png');
        this.load.image('clamdirk', 'assets/img/Clamdirk.png');
        this.load.image('melvarTheTerrible', 'assets/img/Melvar_the_Terrible.png');

        this.load.image('demonAle', 'assets/img/DemonAle.png');
        this.load.image('firePit', 'assets/img/Firepit.png');

        // Load our fire assets
        this.load.spritesheet('largeFire', 'assets/img/FireSheet192x192.png', 192, 192, 5);
        this.load.spritesheet('medFire', 'assets/img/FireSheetMed120x120.png', 120, 120, 5);
        this.load.spritesheet('smallFire', 'assets/img/FireSheetSmall60x60.png', 60, 60, 5);

        // Load the beach background
        this.load.image('background', 'assets/img/Background.png');

        // Load the fire runes
        this.load.image('bopRune', 'assets/img/BopRune.png');
        this.load.image('chillaxRune', 'assets/img/ChillaxRune.png');
        this.load.image('twirlRune', 'assets/img/TwirlRune.png');
        this.load.image('wiggleRune', 'assets/img/WiggleRune.png');
        this.load.image('bopRuneSuccess', 'assets/img/BopRuneSuccess.png');
        this.load.image('chillaxRuneSuccess', 'assets/img/ChillaxRuneSuccess.png');
        this.load.image('twirlRuneSuccess', 'assets/img/TwirlRuneSuccess.png');
        this.load.image('wiggleRuneSuccess', 'assets/img/WiggleRuneSuccess.png');

        // Load gussy for our beautiful summoning
        this.load.image('gussy', 'assets/img/Gussy.png');
        this.load.image('yssug', 'assets/img/Yssug.png');
        this.load.spritesheet('smoke', 'assets/img/Smoke192x192x9.png', 192, 192, 9);

        // Audio to sooth our stress away
        this.load.audio('ocean', ['assets/audio/ocean.mp3', 'assets/audio/ocean.ogg']);
        this.load.audio('campfire', ['assets/audio/campfire.mp3', 'assets/audio/campfire.ogg']);
        this.load.audio('runeActivated', ['assets/audio/runeActivated.mp3', 'assets/audio/runeActivated.ogg']);
        this.load.audio('messedUp', ['assets/audio/messedUp.mp3', 'assets/audio/messedUp.ogg']);
        this.load.audio('summon', ['assets/audio/summon.mp3', 'assets/audio/summon.ogg']);
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.state.start('Game');
	}
};
