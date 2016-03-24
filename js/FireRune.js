runeStates = {
    MOVING: 0,
    ARRIVED: 1,
    DYING: 2,
    ACTIVATED: 3
};

function FireRune(sprite, targetSpotIndex, targetPosition, lifeTime, danceType) {
    this.sprite = sprite;
    this.sprite.z = 14;
    this.targetSpotIndex = targetSpotIndex;
    this.targetPosition = targetPosition;
    this.lifeTime = lifeTime;
    this.danceType = danceType || dances.CHILLAX;
    this.state = runeStates.MOVING;
}
