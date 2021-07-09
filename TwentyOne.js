const DECK_TEMPLETE = require('./deck.json');
const MESSAGES = require('./messages.json');
const readline = require("readline-sync");

const DEALER = 'Dealer';
const BUST_LIMIT = 21;
const DEALER_HIT_LIMIT = 16;


let deck;
let player;

let continueSeries = true;
let gamesTied = 0;
let playerWins = 0;
let dealerWins = 0;

function askUser(message) {
  return readline.question(message);
}

function blankLine() {
  console.log();
}

function initializeDeck() {
  deck = JSON.parse(JSON.stringify(DECK_TEMPLETE));
}

function dealCard(user) {
  let randomCard;

  do {
    randomCard = (Math.floor(Math.random() * 52)) + 1;
  } while (deck[randomCard].owner !== "none");

  deck[randomCard].owner = user;
}

function calculateHandValue(user) {
  let highHandValue = 0;
  let lowHandValue = 0;

  for (let count = 1; count <= 52; count++) {
    if (deck[count].owner === user) {
      highHandValue += deck[count].value.high;
      lowHandValue += deck[count].value.low;
    }
  }

  if (highHandValue <= BUST_LIMIT) {
    return highHandValue;
  } else {
    return lowHandValue;
  }
}

function displayHandValue(user) {
  console.log(MESSAGES.handValue + calculateHandValue(user));
}

function another(question) {
  blankLine();
  let ansewer = askUser(MESSAGES[question]);

  while (ansewer.toLowerCase() !== 'yes' && ansewer.toLowerCase() !== 'no' &&
  ansewer.toLowerCase() !== 'y' && ansewer.toLowerCase() !== 'n') {
    ansewer = askUser(MESSAGES.yesOrNo);
  }

  if ((ansewer.toLowerCase() === 'yes') || (ansewer.toLowerCase() === 'y')) {
    return true;
  } else {
    return false;
  }
}

function displayHand(user, hide = true) { //hide flag is used to hide deaers second card
  console.log(user + MESSAGES.hand);
  console.log();

  for (let count = 1; count <= 52; count++) {
    if (deck[count].owner === user) {
      console.log(deck[count].card + ' of ' + deck[count].suit);
      if ((user === DEALER) && (hide === true)) {
        console.log(MESSAGES.faceDown);
        break;
      }
    }
  }
}

function displayTable(hideDealerCard) {
  console.clear();
  displayHand(player);
  blankLine();
  displayHandValue(player);
  blankLine();

  displayHand(DEALER, hideDealerCard);

  if (hideDealerCard === false) {
    blankLine();
    displayHandValue(DEALER);
  }
}

function playersTurn() {
  displayTable(true);
  let keepDrawing = another('anotherCard');

  while (calculateHandValue(player) < BUST_LIMIT && keepDrawing === true) {
    dealCard(player);
    displayTable(true);

    if (calculateHandValue(player) < BUST_LIMIT) {
      keepDrawing = another('anotherCard');
    }
  }
}

function dealersTurn() {
  displayTable(false);


  if (calculateHandValue(player) > BUST_LIMIT) {
    blankLine();
    console.log(player + MESSAGES.busted);
  }

  while ((calculateHandValue(DEALER) <= DEALER_HIT_LIMIT) &&
  (calculateHandValue(player) <= BUST_LIMIT)) {
    dealCard(DEALER);
    displayTable(false);
  }


  if (calculateHandValue(DEALER) > BUST_LIMIT) {
    console.log(DEALER + MESSAGES.busted);
  }
}

function dealerWonGame() {
  dealerWins++;
  console.log(MESSAGES.lostGame);
}

function playerWonGame() {
  playerWins++;
  console.log(MESSAGES.winGame);
}

function calculateWinner() {
  let dealerHand = calculateHandValue(DEALER);
  let playerHand = calculateHandValue(player);

  blankLine();

  if (playerHand > BUST_LIMIT) {
    dealerWonGame();
  } else if (dealerHand > BUST_LIMIT) {
    playerWonGame();
  } else if (playerHand < dealerHand) {
    dealerWonGame();
  } else if (playerHand > dealerHand) {
    playerWonGame();
  } else if ((dealerHand === playerHand)) {
    gamesTied++;
    console.log(MESSAGES.tieGame);
  }
  blankLine();
  console.log(MESSAGES.seriesScore + playerWins + "-" + dealerWins + "-" + gamesTied);
}

function dealInitialHand() {
  initializeDeck();

  dealCard(player);
  dealCard(DEALER);
  dealCard(player);
  dealCard(DEALER);
}

function playSeries() {
  console.clear();
  initializeDeck();

  let gamesInSeries = parseInt(askUser(MESSAGES.seriesLength), 10);

  for (let gameNumber = 1; gameNumber <= gamesInSeries; ++gameNumber) {
    let continueGame = false;
    console.clear();
    dealInitialHand();

    playersTurn();
    dealersTurn();

    calculateWinner();

    if (gameNumber !== gamesInSeries) {
      while (!continueGame) {
        continueGame = another("anotherGame");
      }
    }
  }
}

// series loop
console.clear();
player = askUser(MESSAGES.name);

while (player.toLowerCase() === DEALER.toLowerCase()) {
  blankLine();
  console.log(MESSAGES.validName);
  player = askUser(MESSAGES.name);
}

while (continueSeries) {
  gamesTied = 0;
  playerWins = 0;
  dealerWins = 0;
  playSeries();
  continueSeries = another('anotherSeries');
}