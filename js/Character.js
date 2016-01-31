dances = {
    CHILLAX: 0,
    WIGGLE: 1,
    BOP: 2,
    TWIRL: 3,
    DANCE_COUNT: 4
};

/**
 * Adds a tween for the given dance state.
 *
 * @param game         The game in which the character lives.
 * @param character    The character to which the tween will be added.
 * @param tweenProps   Object of the form {target: The target property to modify with the tween,
 *                     target: The target value for the given target,
 *                     duration: ms for tween,
 *                     easing: type of easing for tween}
 * @param stopCallback The callback to call when the dance state transitions.
 * @param index        The index into the dance array.
 * @return Nothing.
 */
function addDanceTween(game, character, tweenProps, stopCallback, index) {
    character.tweens[index] = {};
    character.tweens[index].tween = game.add.tween(tweenProps.target);
    character.tweens[index].tween.to(tweenProps.targetVal, tweenProps.duration, tweenProps.easing, false, 0, -1, true);
    character.tweens[index].stop = stopCallback;
}

function Character(sprite, game, danceState) {
    this.sprite = sprite;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.danceState = danceState || dances.WIGGLE;
    this.initValues = {scale: {x: 1, y:  1}, rotation: sprite.rotation, pos: {x: sprite.position.x, y: sprite.position.y}};

    var that = this;
    this.tweens = [];

    var chillaxStop = function() {that.sprite.scale = {x: that.initValues.scale.x, y: that.initValues.scale.y};};
    var twirlStop = function() {that.sprite.rotation = that.initValues.rotation};

    addDanceTween(game, this, {target: that.sprite.scale,
                               targetVal: {x:0.92, y: 0.92},
                               duration: 1000,
                               easing: Phaser.Easing.Linear.None}, chillaxStop, dances.CHILLAX);

    addDanceTween(game, this, {target: that.sprite,
                               targetVal: {rotation: Math.PI * 2},
                               duration: 1100,
                               easing: Phaser.Easing.Linear.None}, twirlStop, dances.TWIRL);

}

Character.prototype.addPositionDependentTweens = function(game) {

    var that = this;
    var wiggleStop = function() {that.sprite.position.x = that.initValues.pos.x};
    var bopStop = function() {that.sprite.position.y = that.initValues.pos.y};

    addDanceTween(game, this, {target: that.sprite,
                               targetVal: {x: '+30'},
                               duration: 300,
                               easing: Phaser.Easing.Linear.None}, wiggleStop, dances.WIGGLE);

    addDanceTween(game, this, {target: that.sprite,
                               targetVal: {y: '+30'},
                               duration: 300,
                               easing: Phaser.Easing.Linear.None}, bopStop, dances.BOP);

}
