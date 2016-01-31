
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('hubert', 'assets/img/Hubert.png');
        this.load.image('gourdis', 'assets/img/Gourdis.png');
        this.load.image('alfonso', 'assets/img/Alfonso.png');
        this.load.image('melvarTheTerrible', 'assets/img/Melvar_the_Terrible.png');
        this.load.image('firePit', 'assets/img/Firepit.png');

        this.load.image('background', 'assets/img/Background.png');

        this.load.image('bopRune', 'assets/img/BopRune.png');
        this.load.image('chillaxRune', 'assets/img/ChillaxRune.png');
        this.load.image('twirlRune', 'assets/img/TwirlRune.png');
        this.load.image('wiggleRune', 'assets/img/WiggleRune.png');

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.state.start('Game');
	}
};
