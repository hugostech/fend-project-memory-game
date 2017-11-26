/*
 * Create a list that holds all of your cards
 */
var cardHolder = [];
var cardOpen = null;
var move = 0;
var Card = function (cardContent) {
    this.status = 0; //status of card: 0, close; 1, open; 2, match;
    this.content = cardContent;
}

Card.prototype.click = function () {

    if (this.status == 0){
        move++;
        this.match();
    }

}

Card.prototype.match = function(){
    if (!cardOpen){
        cardOpen = this;
        this.status=1;
    }else{
        if (cardOpen.content === this.content){
            cardOpen.status=2;
            this.status=2;
        }else{
            cardOpen.status=0;
            this.status=0;
        }
        cardOpen = null;
    }
}

Card.prototype.toHtml = function () {
    var template = '<li class="card" data-position="p_0"><i class="fa fa-'+this.content+'"></i></li>';
    switch (this.status){
        case 0:
            break;
        case 1:
            template = template.replace('card','card open show');
            break;
        case 2:
            template = template.replace('card','card match');
            break;
    }
    return template;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/**
 * Reload the html of cards
 */
function reloadCards() {
    //reload the cards html
    var content = '';
    for(i=0;i<cardHolder.length;i++){
        content += cardHolder[i].toHtml().replace('p_0',i.toString());
    }
    document.getElementById('deck').innerHTML = content;
    //reload the move
    document.getElementsByClassName('moves')[0].innerHTML = move;
    //bind listener
    var cards = document.getElementsByClassName('card');
    for(i=0;i<cards.length;i++){
        cards[i].addEventListener('click',function () {

            var p = parseInt(this.getAttribute('data-position'));
            // console.log(p);
            cardHolder[p].click();
            reloadCards();
        });
    }
}

function start() {
    var types = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];
    move = 0;
    cardHolder = [];
    cardOpen = null;

    for(i=0;i<types.length;i++){
        cardHolder.push(new Card(types[i]));
        cardHolder.push(new Card(types[i]));
    }
    cardHolder = shuffle(cardHolder);
    reloadCards();

}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
// start();




