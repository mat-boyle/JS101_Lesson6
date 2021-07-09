const readline = require("readline-sync");
let boardSpaces = [];
let playerWins = 0;
let computerWins = 0;
let ties = 0;
let ComputerDifficulty = 1;
let seriesLength = 1;
let gamesPLayed = 0;
let HUMAN_SYMBOL = 'X';
let COMPUTER_SYMBOL = 'O';
let playOrder = 1;
let randomOrder;

const BLANK_SPACE = ' ';

let winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

function drawBoard() {
  function drawBlankLine() {
    console.log('     |     |');
  }

  function drawPieceLine(spot) {
    console.log('  ' + boardSpaces[spot] + '  |  ' + boardSpaces[spot + 1] + '  |  ' + boardSpaces[spot + 2]);
  }

  function drawTransitionLine() {
    console.log('-----+-----+-----');
  }

  for (let index = 0; index < boardSpaces.length; index += 3) {
    drawBlankLine();
    drawPieceLine(index);
    drawBlankLine();
    if (index < 6) {
      drawTransitionLine();
    }
  }
  console.log();
}

function clearBoard() {
  boardSpaces = Array(9);
  boardSpaces.fill(BLANK_SPACE, 0, 9);
}

function validSpace(spaceChoice) {
  if ((spaceChoice < 1 || spaceChoice > 9) || Number.isNaN(spaceChoice)) {
    console.log('Please Pick a valid space');
    return false;
  }

  if (boardSpaces[spaceChoice - 1] !== BLANK_SPACE) {
    console.log('Please Pick an empty space');
    return false;
  }

  return true;
}

function validSpaceComputer(spaceChoice) {
  if (boardSpaces[spaceChoice - 1] === BLANK_SPACE) {
    return true;
  } else {
    return false;
  }
}

function playerTurn() {
  console.log("Players Turn \n");

  let playerChoice = "";

  do {
    playerChoice = Number(readline.question('What space do you want to pick: '));
  } while (!(validSpace(playerChoice)));

  boardSpaces[playerChoice - 1] = HUMAN_SYMBOL;
}

function setComputerDifficulty() {
  do {
    ComputerDifficulty = parseInt(readline.question('How tough should the computer be: \n 1 - Easy \n 2 - Medium \n 3 - Hard \n'));
  } while (
    (ComputerDifficulty < 1 ||
    ComputerDifficulty > 3) ||
    Number.isNaN(ComputerDifficulty));
}

function computerTurnDifficulty1() {
  // plays random moves on available spaces
  let computerChoice;

  do {
    computerChoice = Math.floor(Math.random() * 8);
  } while (!(validSpaceComputer(computerChoice + 1)));

  boardSpaces[computerChoice] = COMPUTER_SYMBOL;
}


function computerWinningMove() {
  let computersDecision = undefined;

  for (let index = 0; index < winningCombos.length; index++) {
    let countComputerPlaces = 0;
    let emptySpace = null;
    let innerIndex = 0;
    let positionToCheck = undefined;

    do {
      positionToCheck = winningCombos[index][innerIndex];

      if (boardSpaces[positionToCheck] === BLANK_SPACE) {
        emptySpace = positionToCheck;
      } else if (boardSpaces[positionToCheck] === COMPUTER_SYMBOL) {
        countComputerPlaces++;
      }
      innerIndex++;
    } while (innerIndex < 3);

    if (countComputerPlaces === 2 && emptySpace !== null) {
      computersDecision = emptySpace;
      break;
    }
  }
  return computersDecision;
}

function computerDefenseStop() {
  let computersDecision = undefined;

  for (let index = 0; index < winningCombos.length; index++) {
    let countHuman = 0;
    let emptySpace = null;
    let innerIndex = 0;
    let positionToCheck = undefined;

    do {
      positionToCheck = winningCombos[index][innerIndex];
      if (boardSpaces[positionToCheck] === BLANK_SPACE) {
        emptySpace = positionToCheck;
      } else if (boardSpaces[positionToCheck] === HUMAN_SYMBOL) {
        countHuman++;
      }
      innerIndex++;
    } while (innerIndex < 3);

    if (countHuman === 2 && emptySpace !== null) {
      computersDecision = emptySpace;
      break;
    }
  }
  return computersDecision;
}


function computerTurnDifficulty2() {
  if (computerWinningMove() !== undefined) {
    boardSpaces[computerWinningMove()] = COMPUTER_SYMBOL;
  } else if (computerDefenseStop() !== undefined) {
    boardSpaces[computerDefenseStop()] = COMPUTER_SYMBOL;
  } else if (boardSpaces[4] === BLANK_SPACE) {
    boardSpaces[4] = COMPUTER_SYMBOL;
  } else {
    computerTurnDifficulty1();
  }
}

function pickCorner() {
  let randomNumber = undefined;
  while (randomNumber === 4 || randomNumber === undefined) {
    randomNumber = (Math.floor(Math.random() * 5) * 2);
  }
  return randomNumber;
}

function computerTurnDifficulty3() {
  let computerD3Choice = computerWinningMove();

  if (computerD3Choice === undefined) {
    computerD3Choice = computerDefenseStop();
  }

  if (computerD3Choice === undefined) {
    if (playOrder === 2) {
      if (((boardSpaces.filter(space => (space === COMPUTER_SYMBOL))).length === 0)) {
        computerD3Choice = pickCorner();
      } else if (((boardSpaces.filter(space => (space === COMPUTER_SYMBOL))).length === 1)) {
        if (boardSpaces[0] === COMPUTER_SYMBOL && boardSpaces[8] === BLANK_SPACE) {
          computerD3Choice = 8;
        } else if (boardSpaces[2] === COMPUTER_SYMBOL && boardSpaces[6] === BLANK_SPACE) {
          computerD3Choice = 6;
        } else if (boardSpaces[6] === COMPUTER_SYMBOL && boardSpaces[2] === BLANK_SPACE) {
          computerD3Choice = 2;
        } else if (boardSpaces[8] === COMPUTER_SYMBOL && boardSpaces[0] === BLANK_SPACE) {
          computerD3Choice = 0;
        } else if (boardSpaces[0] === COMPUTER_SYMBOL || boardSpaces[8] === COMPUTER_SYMBOL) {
          computerD3Choice = 6;
        } else if (boardSpaces[6] === COMPUTER_SYMBOL || boardSpaces[2] === COMPUTER_SYMBOL) {
          computerD3Choice = 8;
        }
      }
    }
  } else if (playOrder === 1) {
    if (((boardSpaces.filter(space => (space === COMPUTER_SYMBOL))).length === 0)) {
      if (boardSpaces[4] === BLANK_SPACE) {
        computerD3Choice = 4;
      } else {
        computerD3Choice = pickCorner();
      }
    } else if (((boardSpaces.filter(space => (space === COMPUTER_SYMBOL))).length === 1)) {
      if ((boardSpaces[0] === HUMAN_SYMBOL && boardSpaces[8] === HUMAN_SYMBOL) || (boardSpaces[2] === HUMAN_SYMBOL && boardSpaces[6] === HUMAN_SYMBOL)) {
        while (computerD3Choice === undefined || computerD3Choice !== BLANK_SPACE) {
          computerD3Choice = (Math.floor(Math.random() * 4) * 2) + 1;
        }
      } else if (boardSpaces[1] === HUMAN_SYMBOL && boardSpaces[3] === HUMAN_SYMBOL) {
        computerD3Choice = 0;
      } else if (boardSpaces[1] === HUMAN_SYMBOL && boardSpaces[5] === HUMAN_SYMBOL) {
        computerD3Choice = 2;
      } else if (boardSpaces[3] === HUMAN_SYMBOL && boardSpaces[7] === HUMAN_SYMBOL) {
        computerD3Choice = 6;
      } else if (boardSpaces[5] === HUMAN_SYMBOL && boardSpaces[7] === HUMAN_SYMBOL) {
        computerD3Choice = 8;
      }
    }
  }

  if (computerD3Choice === undefined) {
    computerD3Choice = computerTurnDifficulty2();
  }

  boardSpaces[computerD3Choice] = COMPUTER_SYMBOL;
}

function computerTurn() {
  console.log("Computer's Turn \n");

  if  (ComputerDifficulty === 1) {
    computerTurnDifficulty1();
  } else if (ComputerDifficulty === 2) {
    computerTurnDifficulty2();
  } else if (ComputerDifficulty === 3) {
    computerTurnDifficulty3();
  }
}

function playerWonGame() {
  console.log('Player Wins!');
  playerWins++;
  drawBoard();
  return true;
}

function ComputerWonGame() {
  console.log('Computer Wins!');
  computerWins++;
  drawBoard();
  return true;
}

function checkForWinner() {
  let positionToCheck;
  for (let index = 0; index < winningCombos.length; index++) {
    let countUserSpaces = 0;
    let countComputerSpaces = 0;
    let userWon = false;
    let computerWon = false;
    let innerIndex = 0;

    do {
      positionToCheck = winningCombos[index][innerIndex];

      if (boardSpaces[positionToCheck] === HUMAN_SYMBOL) {
        countUserSpaces++;
      } else if (boardSpaces[positionToCheck] === COMPUTER_SYMBOL) {
        countComputerSpaces++;
      }

      innerIndex++;

      if (countUserSpaces === 3) {
        userWon = true;
      } else if (countComputerSpaces === 3) {
        computerWon = true;
      }

    } while (innerIndex < 3);

    if (userWon === true) {
      console.clear();
      return playerWonGame();
    } else if (computerWon === true) {
      console.clear();
      return ComputerWonGame();
    }
  }
}

function checkForTie() {
  if (!(checkForWinner())) {
    if (boardSpaces.every(space => space !== ' ')) {
      console.log("It's a tie");
      ties++;
      return true;
    }
  }
}

function continuePlaying() {
  console.clear();
  let keepPlaying = readline.question('Do you want to play again?: ');

  while ((keepPlaying === '') || (!((keepPlaying[0].toLowerCase() === 'n') || (keepPlaying[0].toLowerCase() === 'y')))) {
    keepPlaying = readline.question('Please ansewer Yes or No: ');
  }

  if (keepPlaying[0].toLowerCase() !== 'y') {
    return false;
  } else if (keepPlaying[0].toLowerCase() !== 'n') {
    return true;
  }
}

function askForSeriesLength() {
  seriesLength = readline.question('How many games would you like the series to be?: ');

  while ((Number.isNaN(seriesLength) || (seriesLength <= 0))) {
    console.log('Please pick a number greater than 0');
    seriesLength = readline.question('How many games would you like the series to be?: ');
  }
}

function chooseTurnOrder() {
  playOrder = parseInt(readline.question('Who would you like to go first: \n 1 - Player \n 2 - Computer \n 3 - Random \n 4 - Alternate \n'));

  while ((Number.isNaN(playOrder) || (playOrder <= 0) || (playOrder > 4))) {
    console.log('Please pick a number between 1-4');
    playOrder = readline.question('Who would you like to go first: \n 1 - Player \n 2 - Computer \n 3 - Random \n 4 - Alternate \n');
  }
}

function playerChooseSymbol() {
  HUMAN_SYMBOL  = readline.question('What symbol would you like to be?: ');

  if (HUMAN_SYMBOL === '') {
    HUMAN_SYMBOL = 'X';
  } else {
    HUMAN_SYMBOL = HUMAN_SYMBOL[0];
  }

  if (HUMAN_SYMBOL === '0') {
    COMPUTER_SYMBOL = 'X';
  }
}

function setRandomOrder() {
  randomOrder = Math.floor((Math.random() * 2) + 1);
}

function playGame() {
  let isWinnerOrTie = false;

  function goesFirstHuman() {
    drawBoard();
    playerTurn();
    if (checkForWinner() || checkForTie()) {
      isWinnerOrTie = true;
    } else {
      computerTurn();
      if (checkForWinner() || checkForTie()) {
        isWinnerOrTie = true;
      }
    }
  }

  function goesFirstComputer() {
    computerTurn();
    drawBoard();
    if (checkForWinner() || checkForTie()) {
      isWinnerOrTie = true;
    } else {
      playerTurn();
      if (checkForWinner() || checkForTie()) {
        isWinnerOrTie = true;
      }
    }
  }

  function goesFirstRandom() {
    if (randomOrder === 1) {
      goesFirstHuman();
    } else {
      goesFirstComputer();
    }
  }

  clearBoard();
  while (!(isWinnerOrTie)) {
    console.clear();

    console.log("User is playing as: " + HUMAN_SYMBOL);
    console.log("Computer is playing as: " + COMPUTER_SYMBOL);
    console.log(`The series is ${playerWins} - ${computerWins} - ${ties}`);
    console.log(`This is game ${gamesPLayed} of ${seriesLength} in the series \n`);

    if (playOrder === 1) {
      goesFirstHuman();
    } else if (playOrder === 2) {
      goesFirstComputer();
    } else {
      goesFirstRandom();
    }
  }
}

do {
  setRandomOrder();
  askForSeriesLength();
  setComputerDifficulty();
  playerChooseSymbol();
  chooseTurnOrder();
  playerWins = 0;
  computerWins = 0;
  ties = 0;
  gamesPLayed = 0;

  while (gamesPLayed < seriesLength) {
    gamesPLayed++;
    playGame();

    readline.question('Press any button to continue');

    if (playOrder === 4) {
      if (randomOrder === 1) {
        randomOrder = 2;
      } else {
        randomOrder = 1;
      }
    }
  }
} while (continuePlaying());