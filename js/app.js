/*
 * Create a list that holds all of your cards
 */
"use strict";
class Card{
    constructor(cardContent,game){
        this.status = 0; //status of card: 0, close; 1, open; 2, match; 3, no match
        this.content = cardContent;
        this.game = game;
    }
    click(){
        if (this.status === 0){
            this.game.move++;
            this.match();
        }
    }

    match(){
        if (this.game.cardOpen===null){
            this.game.cardOpen = this;
            this.status=1;
        }else{
            if (this.game.cardOpen.content === this.content){
                this.game.cardOpen.status=2;
                this.status=2;
            }else{
                this.game.cardOpen.status=3;
                this.status=3;
                this.game.nomatch = true;
            }
            this.game.cardOpen = null;
        }
    }
    toHtml(){
        let template = `<li class="card" data-position="p_0"><i class="fa fa-${this.content}"></i></li>`;
        switch (this.status){
            case 0:
                break;
            case 1:
                template = template.replace('card','card open show');
                break;
            case 2:
                template = template.replace('card','card match');
                break;
            case 3:
                template = template.replace('card','card nomatch animated rubberBand');
                break;
        }
        return template;
    }

}
class Game{
    constructor(){
        this.cardHolder = [];
        this.cardOpen = null;
        this.move = 0;
        this.nomatch = false;
        this.time = 0;
        this.timerid = null;
    }

    start() {
        var types = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];
        this.move = 0;
        this.time = 0;
        this.cardHolder = [];
        this.cardOpen = null;
        for(let i=0;i<types.length;i++){
            this.cardHolder.push(new Card(types[i],this));
            this.cardHolder.push(new Card(types[i],this));
        }
        this.cardHolder = this.shuffle(this.cardHolder);
        this.timerid = setInterval(()=>{
            this.reloadTimer();
        },1000);
        this.reloadCards();

    }

    playAgain() {
        document.getElementsByClassName('result')[0].style.display="none";
        document.getElementsByClassName('container')[0].style.display="flex";
        this.start();
    }

    timer(){

    }

    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }



    calculateScore() {
        let score = 3;
        let t = this.move-20;
        t = t>0?t:0;
        score = score - t/5;
        score = score<1?1:score;
        return score;
    }

    calculateTime(){
        let s = this.time%60;
        let m = (this.time-s)/60;
        return [s,m];
    }

    reloadTimer(){
        this.time++;
        let [s,m] = this.calculateTime();
        document.getElementsByClassName('timer')[0].innerHTML = `${m} m ${s} s`;
    }

    reloadScore() {
        let scoreContent = '';
        let t = this.calculateScore();
        for(let i=t;i>0;i--){
            if (i>=1){
                scoreContent += '<li><i class="fa fa-star"></i></li>';
            }else{
                scoreContent += '<li><i class="fa fa-star-half-o"></i></li>';
            }
        }
        if(t<=0){
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
        }else if(t<=1){
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
        }else if(t<=2){
            scoreContent += '<li><i class="fa fa-star-o"></i></li>';
        }
        document.getElementsByClassName('stars')[0].innerHTML = scoreContent;
        //reload the move
        document.getElementsByClassName('moves')[0].innerHTML = this.move;
    }

    /**
     * Reload the html of cards
     */
    reloadCards() {
        if(this.success()){
            clearInterval(this.timerid)
            let [s,m] = this.calculateTime();
            let result = `With ${this.move} Moves and ${this.calculateScore()} Stars in ${m} Min ${s} Second` ;
            document.getElementById('result').innerHTML = result;
            document.getElementsByClassName('container')[0].style.display="none";
            document.getElementsByClassName('result')[0].style.display="flex";
            return;
        }
        //reload the cards html
        let content = '';
        for(let i=0;i<this.cardHolder.length;i++){
            content += this.cardHolder[i].toHtml().replace('p_0',i.toString());
        }
        document.getElementById('deck').innerHTML = content;
        this.reloadScore();
        //bind listener
        let cards = document.getElementsByClassName('card');
        for(let i=0;i<cards.length;i++){
            cards[i].addEventListener('click',obj=>{
                // console.log(obj);
                let p = parseInt(obj.target.getAttribute('data-position'));
                this.cardHolder[p].click();
                this.reloadCards();
            });
        }
        if(this.nomatch){
            this.nomatch = false;
            setTimeout(()=>{
                for(let i=0;i<this.cardHolder.length;i++){
                    if(this.cardHolder[i].status===3){
                        this.cardHolder[i].status=0;
                    }

                }
                this.reloadCards();
            },800);
        }
    }
    success() {
        for(let i=0;i<this.cardHolder.length;i++){
            if(this.cardHolder[i].status!==2){
                return false;
            }

        }
        return true;
    }
}





/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */




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
const game = new Game();
game.start();




