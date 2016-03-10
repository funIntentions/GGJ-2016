var GameState = {
    MENU: 0,
    RUNNING: 1,
    WISDOM: 2
};

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
        var scale = 1;
        var index;
        for (index = 0; index < this.spots.length; index++) {
            if (!this.spots[index].character) {
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
        this.spotChoices = [];
        this.selectedSpot = 0;
        this.spawnMin = 4;
        this.spawnMax = 5;
        this.wisdomDisplayTime = 10;
        this.runeLifeTime = 6;
        this.runeYOffset = 130;
        this.requiredWisdom = 5;
        this.currentWisdom = 0;
        this.messedUp = false;
        this.currentState = GameState.RUNNING;
        this.previousState = GameState.RUNNING;
        this.wisdomImparted = false;

        this.wisdom = ["At night some stars come out, but some are too shy and stay in instead.",
                        "We all keep killing time... It's no wonder time kills us all in the end.",
                        "We live in the present, but the past lives in us."];

        this.wisdom = this.shuffle(this.wisdom);

        var distToFire = 220;
        var spotYOffset = 220;

        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX - distToFire, this.world.centerY - spotYOffset/2), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX - distToFire, this.world.centerY + spotYOffset/2), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX, this.world.centerY + distToFire), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX + distToFire, this.world.centerY + spotYOffset/2), false, null));
        this.spots.push(new FireSpot(new PIXI.Point(this.world.centerX + distToFire, this.world.centerY - spotYOffset/2), false, null));

        var background = this.add.sprite(0, 0, 'background');
        var firePit = this.add.sprite(this.world.centerX, this.world.centerY, 'firePit');
        firePit.anchor.setTo(0.5, 0.3);

        // Load the fire spritesheets
        var outerFire = this.add.sprite(firePit.x, firePit.y, 'largeFire');
        outerFire.anchor.setTo(0.5, 0.7);
        outerFire.animations.add('burn');
        outerFire.animations.play('burn', 8, true);

        var middleFire = this.add.sprite(firePit.x, firePit.y, 'medFire');
        middleFire.anchor.setTo(0.5, 0.65);
        middleFire.animations.add('burn');
        middleFire.animations.play('burn', 8.5, true);

        var innerFire = this.add.sprite(firePit.x, firePit.y, 'smallFire');
        innerFire.anchor.setTo(0.5, 0.45);
        innerFire.animations.add('burn');
        innerFire.animations.play('burn', 9, true);

        this.smoke = this.add.sprite(firePit.x, firePit.y - outerFire.height / 2, 'smoke');
        this.smoke.animations.add('coalesce');
        this.smoke.visible = false;
        this.smoke.anchor.setTo(0.5, 0.5);

        this.gussy = this.add.sprite(this.smoke.x, this.smoke.y, 'gussy');
        this.gussy.anchor.setTo(0.5, 0.5);
        this.gussy.visible = false;

        this.yssug = this.add.sprite(this.smoke.x, this.smoke.y, 'yssug');
        this.yssug.anchor.setTo(0.5, 0.5);
        this.yssug.visible = false;

        var melvarTheTerrible = new Character(this.add.sprite(0, 0, 'melvarTheTerrible'), this);
        var alfonso = new Character(this.add.sprite(0, 0, 'alfonso'), this);
        var hubert = new Character(this.add.sprite(0, 0, 'hubert'), this);
        var gourdis = new Character(this.add.sprite(0, 0, 'gourdis'), this);
        var clamdirk = new Character(this.add.sprite(0, 0, 'clamdirk'), this);

        this.tome = this.add.sprite(0, 0, 'tome');
        this.tomeDisplayPosition = {x: this.world.centerX - this.tome.width/2, y: this.world.centerY};
        this.tomeHiddenPosition = {x: this.world.centerX - this.tome.width/2, y: this.world.centerY + this.world.height};
        this.tome.x = this.tomeHiddenPosition.x;
        this.tome.y = this.tomeHiddenPosition.y;

        this.placeInSpot(melvarTheTerrible);
        this.placeInSpot(gourdis);
        this.placeInSpot(alfonso);
        this.placeInSpot(hubert);
        this.placeInSpot(clamdirk);

        // Lol hacky af
        hubert.addPositionDependentTweens(this);
        alfonso.addPositionDependentTweens(this);
        gourdis.addPositionDependentTweens(this);
        melvarTheTerrible.addPositionDependentTweens(this);
        clamdirk.addPositionDependentTweens(this);

        hubert.tweens[hubert.danceState].tween.start();
        gourdis.tweens[gourdis.danceState].tween.start();
        alfonso.tweens[alfonso.danceState].tween.start();
        melvarTheTerrible.tweens[melvarTheTerrible.danceState].tween.start();
        clamdirk.tweens[clamdirk.danceState].tween.start();

        this.indicatorOffsets = [{x: this.spots[0].character.sprite.x + this.spots[0].character.sprite.width / 3, y: this.spots[0].character.sprite.y},
                                 {x: this.spots[1].character.sprite.x + this.spots[1].character.sprite.width / 3, y: this.spots[1].character.sprite.y},
                                 {x: this.spots[2].character.sprite.x + this.spots[2].character.sprite.width / 3, y: this.spots[2].character.sprite.y},
                                 {x: this.spots[3].character.sprite.x + this.spots[3].character.sprite.width / 3, y: this.spots[3].character.sprite.y},
                                 {x: this.spots[4].character.sprite.x + this.spots[4].character.sprite.width / 3, y: this.spots[4].character.sprite.y}];

        var currentOffset = this.indicatorOffsets[this.selectedSpot];
        this.selectionIndicator = this.add.sprite(currentOffset.x, currentOffset.y, 'demonAle');
        this.selectionIndicator.anchor.setTo(0.5, 0.5);

        this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this.consultTome, this);

        this.input.keyboard.addKey(Phaser.KeyCode.RIGHT).onDown.add(this.incrementSelectedSpot, this);
        this.input.keyboard.addKey(Phaser.KeyCode.LEFT).onDown.add(this.decrementSelectedSpot, this);

        this.input.keyboard.addKey(Phaser.KeyCode.Z).onDown.add(this.chillaxDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.X).onDown.add(this.wiggleDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.C).onDown.add(this.bopDance, this);
        this.input.keyboard.addKey(Phaser.KeyCode.V).onDown.add(this.twirlDance, this);

        var index;
        for (index = 0; index < this.spots.length; index++) {
            this.spotChoices.push(index);
        }

        this.time.events.add(Phaser.Timer.SECOND * this.spawnMin, this.spawnFireRune, this);

        this.oceanAudio = this.add.audio('ocean');
        this.oceanAudio.loop = true;
        this.oceanAudio.play();

        this.campfireAudio = this.add.audio('campfire');
        this.campfireAudio.loop = true;
        this.campfireAudio.play();

        this.runeActivatedAudio = this.add.audio('runeActivated');
        this.messedUpAudio = this.add.audio('messedUp');
        this.summonAudio = this.add.audio('summon');

        var style = { font: "bold 26px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.summonedText = this.add.text(0, 0, "Test", style);
        this.summonedText.setTextBounds(0, 0, 1024, 200);
        this.summonedText.visible = false;
        this.summonedText.alpha = 0;
    },

    shuffle: function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },

    wisdomDelivered: function() {
        var textTweenEnd = this.add.tween(this.summonedText);
        textTweenEnd.to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        textTweenEnd.onComplete.addOnce(function() {
            if(this.summoned == this.gussy) {
                this.currentWisdom++;
                if(this.currentWisdom == this.requiredWisdom) {
                    // Activate the surprise ending
                    console.log("You win!");
                }
            }
            this.smoke.visible = true;
            this.smoke.animations.play('coalesce', 11, false);
        }, this);
        textTweenEnd.start();
        this.wisdomImparted = true;
    },

    spawnFireRune: function() {
        var secondsUntilNextRune = this.rnd.integerInRange(this.spawnMin, this.spawnMax);
        this.time.events.add(Phaser.Timer.SECOND * secondsUntilNextRune, this.spawnFireRune, this);

        if(this.currentState != GameState.RUNNING) return;

        if (this.spotChoices.length == 0) {
            return false;
        }

        this.shuffle(this.spotChoices);
        var fireSpot = this.spotChoices.pop();
        var danceType = this.rnd.integerInRange(0, dances.DANCE_COUNT - 1);
        var runeSprite = null;
        switch(danceType) {
            case dances.CHILLAX:
                var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'chillaxRune');
                break;
            case dances.WIGGLE:
                var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'wiggleRune');
                break;
            case dances.BOP:
                var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'bopRune');
                break;
            case dances.TWIRL:
                var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'twirlRune');
                break;
            default:
                var runeSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'hubert');
                console.log("Unknown dance type...")
        }

        runeSprite.anchor.setTo(0.5, 0.5);
        var rune = new FireRune(runeSprite, fireSpot, new PIXI.Point(this.spots[fireSpot].position.x, this.spots[fireSpot].position.y - this.runeYOffset), this.runeLifeTime, danceType);
        this.runes.push(rune);
        this.add.tween(runeSprite).to({x: rune.targetPosition.x, y: rune.targetPosition.y}, 1000, 'Linear', true);
        return true;
    },

    changeState: function(newState) {
        this.previousState = this.currentState;
        this.currentState = newState;
    },

    revertState: function() {
        this.currentState = this.previousState;
    },

    consultTome: function() {
        if (this.currentState == GameState.RUNNING || this.currentState == GameState.MENU)
        {
            if (this.currentState != GameState.MENU)
            {
                // Display book
                this.changeState(GameState.MENU);
                this.add.tween(this.tome).to({x: this.tomeDisplayPosition.x, y: this.tomeDisplayPosition.y}, 1000, 'Linear', true);
            }
            else
            {
                // Display hide book
                this.revertState();
                this.add.tween(this.tome).to({x: this.tomeHiddenPosition.x, y: this.tomeHiddenPosition.y}, 1000, 'Linear', true);
            }
        }
    },

    /**
     * Updates the states and positions of all currently active runes.
     */
    updateRunes: function() {
        var index;
        var runesToDestroy = [];

        for (index = 0; index < this.runes.length; index++) {
            var rune = this.runes[index];
            switch (rune.state) {
                case runeStates.ACTIVATED:
                    break;
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
                        rune.state = runeStates.DEAD;
                    }
                break;
                case runeStates.DEAD:
                    runesToDestroy.push(rune);
                break;
                default:
                console.log("Unknown rune state...")
            }
        }

        for (index = 0; index < runesToDestroy.length; index++) {
            var indexOf = this.runes.indexOf(runesToDestroy[index]);
            var removedRune = this.runes.splice(indexOf, 1)[0];
            this.spotChoices.push(removedRune.targetSpotIndex);
            removedRune.sprite.kill();

        }
    },

    incrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot + 1) % this.spots.length;
        var newSelPos = this.indicatorOffsets[this.selectedSpot];
        this.selectionIndicator.position.setTo(newSelPos.x, newSelPos.y);
    },

    /**
     * Changes the currently selected character to the "previous" spot.
     */
    decrementSelectedSpot: function() {
        this.selectedSpot = (this.selectedSpot - 1) % this.spots.length;

        if (this.selectedSpot < 0) {this.selectedSpot = this.spots.length - 1;}
        var newSelPos = this.indicatorOffsets[this.selectedSpot];
        this.selectionIndicator.position.setTo(newSelPos.x, newSelPos.y);
    },

    verifyDanceChoice: function(newDance) {
        var index;
        for (index = 0; index < this.runes.length; index++) {
            var rune = this.runes[index];
            if ((rune.state == runeStates.ARRIVED || rune.state == runeStates.DYING) && rune.targetSpotIndex == this.selectedSpot && rune.danceType == newDance) {
                rune.state = runeStates.ACTIVATED;
                this.runeActivatedAudio.play();
                var position = new PIXI.Point(rune.sprite.position.x, rune.sprite.position.y);
                rune.sprite.kill();
                rune.sprite = this.getActivatedRuneSprite(rune.danceType, position);

                return true;
            }
        }

        for (index = 0; index < this.runes.length; index++) {
            this.runes[index].state = runeStates.DEAD;
        }

        return false;
    },

    getActivatedRuneSprite: function(danceType, position) {
        var runeSprite = null;
        switch(danceType) {
            case dances.CHILLAX:
                runeSprite = this.add.sprite(position.x, position.y, 'chillaxRuneSuccess');
                break;
            case dances.WIGGLE:
                runeSprite = this.add.sprite(position.x, position.y, 'wiggleRuneSuccess');
                break;
            case dances.BOP:
                runeSprite = this.add.sprite(position.x, position.y, 'bopRuneSuccess');
                break;
            case dances.TWIRL:
                runeSprite = this.add.sprite(position.x, position.y, 'twirlRuneSuccess');
                break;
            default:
                runeSprite = this.add.sprite(position.x, position.y, 'hubert');
                console.log("Unknown dance type...")
        }
        runeSprite.anchor.setTo(0.5, 0.5);
        return runeSprite;
    },

    /**
     * Changes the dance state for the currently selected character to the given dance.
     *
     * @param newDance The new dance state to assig.
     */
    changeDanceForSelected: function(newDance) {
        var character = this.spots[this.selectedSpot].character;
        var pastDance = character.danceState;

        if (!this.verifyDanceChoice(newDance)) {
            this.messedUp = true;
            this.messedUpAudio.play();
        }

        // Stop the tween and call the stop callback to reset the position (which apparently doesn't work so hot)
        character.tweens[pastDance].tween.pause();
        character.tweens[pastDance].stop();
        character.danceState = newDance;
        if(character.tweens[newDance].tween.isRunning) {
            character.tweens[newDance].tween.resume();
        } else {
            character.tweens[newDance].tween.start();
        }

    },

    chillaxDance: function() {
        this.changeDanceForSelected(dances.CHILLAX);
    },

    wiggleDance: function() {
        this.changeDanceForSelected(dances.WIGGLE);
    },

    bopDance: function() {
        this.changeDanceForSelected(dances.BOP);
    },

    twirlDance: function() {
        this.changeDanceForSelected(dances.TWIRL);
    },

    update: function () {

        if(this.currentState == GameState.MENU) {

        }

        if(this.currentState == GameState.WISDOM) {
            this.updateWisdomDelivery();
            return;
        }

        this.updateRunes();

        // Summon Yssug when we mess up
        if(this.messedUp) {
            this.impartWisdom(false);
            this.messedUp = false;
        }

        if(this.allRunesActivated()) {
            // Do some effect to make runes disappear
            this.impartWisdom(true);
        }

    },

    allRunesActivated: function() {

        // We couldn't have succeeded if we don't have a rune at each spot
        if(this.runes.length != this.spots.length) return false;

        for(i = 0; i < this.runes.length; i++) {
            if(this.runes[i].state != runeStates.ACTIVATED) return false;
        }
        return true;
    },

    updateWisdomDelivery: function() {

        if(!this.wisdomImparted) {
            // Super-hacky way of making Gussy/Yssug appear while the smoke is covering them
            if(this.smoke.animations.currentAnim.frame == 4) {
                this.summoned.visible = true;
            } else if(this.smoke.animations.currentAnim.isFinished) {
                this.smoke.visible = false;
                var textTween = this.add.tween(this.summonedText);
                textTween.to({alpha: 1}, 500, Phaser.Easing.Linear.None);

                this.wisdomImparted = true;
                this.smoke.visible = false;

                /*var textTweenEnd = this.add.tween(this.summonedText);
                // Once the smoke clears, slowly reveal the text
                this.wisdomImparted = true;
                this.smoke.visible = false;
                var textTween = this.add.tween(this.summonedText);
                textTween.to({alpha: 1}, 500, Phaser.Easing.Linear.None);

                // Fade the text back out and add to the current wisdom if gussy was summoned
                var textTweenEnd = this.add.tween(this.summonedText);
                textTweenEnd.to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 5000);
                textTweenEnd.onComplete.addOnce(function() {
                    if(this.summoned == this.gussy) {
                        this.currentWisdom++;
                        if(this.currentWisdom == this.requiredWisdom) {
                            // Activate the surprise ending
                            console.log("You win!");
                        }
                    }
                    this.smoke.visible = true;
                    this.smoke.animations.play('coalesce', 11, false);
                }, this);

                textTween.chain(textTweenEnd);*/

                // Display the wisdom for the given amount of time
                this.time.events.add(Phaser.Timer.SECOND * this.wisdomDisplayTime, this.wisdomDelivered, this);
                textTween.start();
            }
        } else {
            // This will be set back to visible in the wisdomDelivered function
            if(!this.smoke.visible) return

            // Super-hacky way to make Gussy/Yssug disappear after wisdom has been imparted
            if(this.smoke.animations.currentAnim.frame == 4) {
                this.summoned.visible = false;
            } else if(this.smoke.animations.currentAnim.isFinished) {
                this.smoke.visible = false;
                this.wisdomImparted = false;
                this.changeState(GameState.RUNNING);
                //this.currentState = GameState.RUNNING;
            }
        }

    },

    impartWisdom: function(succeeded) {
        // kill all the runes
        for(i = 0; i < this.runes.length; i++) this.runes[i].state = runeStates.DEAD;
        this.changeState(GameState.WISDOM);
        //this.currentState = GameState.WISDOM;
        this.summonAudio.play();

        // Determine whom to summon
        if(succeeded) {
            this.summoned = this.gussy;
            if (this.wisdom.length > 0)
                this.summonedText.setText(this.wisdom.pop());
            else
                this.summonedText.setText("[Wisdom Empty]");
        } else {
            this.summoned = this.yssug;

            // Get a random bit of "wisdom" and output a garbled version
            var text = this.wisdom.length > 0 ? this.wisdom[this.rnd.integerInRange(0, this.wisdom.length - 1)] : "[Wisdom Empty]";
            text = text.split(" ");
            text = this.shuffle(text);
            var recombined = "";
            for(var i = 0; i < text.length - 1; i++) recombined += text[i] + " ";
            recombined += text[text.length - 1];
            this.summonedText.setText(text);
        }
        this.summonedText.visible = true;
        this.smoke.visible = true;
        this.smoke.animations.play('coalesce', 11, false);
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
