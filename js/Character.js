dances = {
    CHILLAX: 0,
    WIGGLE: 1,
    BOP: 2,
    TWIRL: 3,
    DANCE_COUNT: 4
};

function Character(sprite, danceState) {
    this.sprite = sprite;
    this.danceState = danceState || dances.CHILLAX;
}
