runeStates = {
    MOVING: 0,
    ARRIVED: 1,
    DYING: 2
};

function FireRune(sprite, targetPosition, lifeTime, danceType) {
    this.sprite = sprite;
    this.targetPosition = targetPosition;
    this.lifeTime = lifeTime;
    this.danceType = danceType || dances.CHILLAX;
    this.state = runeStates.MOVING;
}
