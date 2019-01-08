const quickPickYes = document.querySelector("#quick_pick_yes");
const quickPickNo = document.querySelector("#quick_pick_no");
const spotty = document.querySelector("#spots");
const wageWrapper = document.getElementById("wager_wrapper");
const pickWrapper = document.getElementById("picks");
const submitValues = document.querySelector("#submit_values");
const gamesWrapper = document.querySelector("#total_games");
const playGame = document.querySelector("#play_game");
const nextGameWrapper = document.querySelector("#next_game");
const quickPlayWrapper = document.querySelector("#quick_play");
const topSettings = document.querySelector("#top_settings");
const playAgainButton = document.querySelector("#play_again");
const sliderValue = document.querySelector("#valBox");

const prizeLookupMap = {
    // Prize Map. First part of string is spots picked, second part is total numbers matched.
    "1,1": 2.5,
    "2,2": 11,
    "3,2": 2,
    "3,3": 27,
    "4,2": 1,
    "4,3": 5,
    "4,4": 72,
    "5,3": 2,
    "5,4": 18,
    "5,5": 410,
    "6,3": 1,
    "6,4": 7,
    "6,5": 55,
    "6,6": 1200,
    "7,3": 1,
    "7,4": 3,
    "7,5": 17,
    "7,6": 85,
    "7,7": 4500,
    "8,4": 2,
    "8,5": 12,
    "8,6": 50,
    "8,7": 650,
    "8,8": 10500,
    "9,4": 1,
    "9,5": 6,
    "9,6": 25,
    "9,7": 130,
    "9,8": 3000,
    "9,9": 30000,
    "10,0": 5,
    "10,5": 2,
    "10,6": 15,
    "10,7": 30,
    "10,8": 450,
    "10,9": 4250,
    "10,10": 100000
};

let userWager = null;
let totalGames;
let numberOfSpots;
let userPicks;
let winners;
let matches;
let singleGameWinnings;
let totalBet;
let totalGameWinnings = 0;
let totalProfit;

itemHider(nextGameWrapper);
itemHider(quickPlayWrapper);
itemHider(playAgainButton);
itemHider(playGame);

sliderValue.innerHTML = spotty.value;

spotty.oninput = function() {
    // Shows the value of the spots to the left of slider.
    sliderValue.innerHTML = this.value;
}

spotty.onchange = function() {
    // Shows value of spots on the left of slider if value changes.
    sliderValue.innerHTML = this.value;
}

function clearTopData () {
    // Sets spot value to default of 5, wager to default of 1, clears both input boxes for games and numbers, and also sets quick pick to default of no.
    gamesWrapper.value = '';
    document.querySelector("#bet_1").checked = true;
    pickWrapper.value = '';
    document.querySelector("#quick_pick_no").checked = true;
    spotty.value = 5;
    sliderValue.innerHTML = "5";
}

function validateInput(inputToValidate) {
    // Input validator.
    if (inputToValidate.value.length == 0 || inputToValidate.value === null) {
        return false;
    } else if (isNaN(inputToValidate.value)) {
        return false;
    };
    return true;
}

function validGameTest() {
    // Checks to make sure games in a row are entered.
    if (validateInput(gamesWrapper) === true) {
        return true;
    } else {
        return false;
    };
}

function calculateTotalGameWinnings() {
    // Calulates total game winnings.
    totalGameWinnings += singleGameWinnings;
}

function calculateTotalProfit() {
    // Calculates total profit or loss.
    totalProfit = totalGameWinnings - totalBet;
}

function calculateTotalBet() {
    // Calulates total bet amount.
    totalBet = userWager * totalGames;
}

function checkIfArrayIsUnique(myArray) {
    // Used in the validateNumbers function to check if numbers are unique.
  return myArray.length === new Set(myArray).size;
}

function validateNumbers() {
    // Check numbers to make sure they are valid.
    let pickStringArray = pickWrapper.value.split(",");
    let pickArray = pickStringArray.map(Number);
    let arrayCheck = checkIfArrayIsUnique(pickArray);
    if (pickArray.length !== numberOfSpots) {
        // Check total amount of numbers entered.
        alert("Total numbers must match total spots");
        return false;
    } else if (arrayCheck !== true) {
        // Check if unique.
        alert("Enter unique numbers only!");
        return false;    
    } else if (pickArray.length === numberOfSpots) {
        for(let i = 0; i < pickArray.length; i++) {
            // Check if within range 1-80.
            if(pickArray[i] < 1 || pickArray[i] > 80) {
                alert("Numbers must be between 1-80");
                return false;
            } else {
                for(let i = 0; i < pickArray.length; i++) {
                    // Check if actually a number.
                    if(isNaN(pickArray[i])) {
                        alert("Enter unique numbers only!");
                        return false;
                    }
                }
            }
        }
    } else {
        return true;
    }
}

function pickRandomDrawingNumbers() {
    // Picks 20 random numbers with no dupes.
    let nums = new Set();
    while (nums.size < 20) {
        nums.add(Math.floor(Math.random() * 80) + 1);
    };
    winners = Array.from(nums);
}

function checkForMatchingNumbers() {
    // Checks for matches between users picked nums and drawn keno winning nums.
    let numbersMatched = [];
    winners.forEach( x => {
        if(userPicks.indexOf(x) != -1) {
            numbersMatched.push(x);
        }
    });
    matches = numbersMatched;
}


function prizeWinnings() {
    // Calulates prize winnings.
    singleGameWinnings =  userWager * (prizeLookupMap[`${numberOfSpots},${matches.length}`]);
    if (isNaN(singleGameWinnings)) {
        singleGameWinnings = 0;
    }
}


function initValues() {
    // Initialize all starting values.
    spotGetter();
    totalGamesGetter();
    getWager();
    userPickGetter();
    calculateTotalBet();
}

function displayAll() {
    // Displays all settings. Using this for testing.
    spotDisplay();
    wagerDisplay();
    numDisplay();
    totalBetDisplay();
    totalGamesDisplay();
}

function submitValuesOnClick() {
    // Init values and display on bottom.
    initValues();
    if (totalGames > 0) {
        if (validateNumbers() !== false) {
            displayAll();
            itemShower(playGame);
            itemHider(submitValues);
        }
    } else {
        alert("Must enter total number of games.");
    }

}

function drawWinner() {
    // Pick random nums and display on bottom.
    pickRandomDrawingNumbers();
    checkForMatchingNumbers();
    prizeWinnings();
    calculateTotalGameWinnings();
}

function displayGameStats() {
    // Displays game stats on bottom.
    matchedNumDisplay();
    singleGameWinningsDisplay();
    winningDisplay();
    displayProfit(); 
    displayGamesLeft();
}


function totalGameCounter() {
    // Subtract one game from total games.
    totalGames = totalGames - 1;
}

function matchedNumDisplay () {
    // Matched number display.
    if (matches.length > 0) {
        document.querySelector("#matched_numbers").innerHTML = "Numbers Matched: " + matches;
    } else {
        document.querySelector("#matched_numbers").innerHTML = "Numbers Matched: None";
    };
    
}

function totalGamesDisplay() {
    // Displays total number of games.
    document.querySelector("#total_games_display").innerHTML = "Total Games: " + totalGames;
}

function spotDisplay () {
    // Display spots.
    document.querySelector("#spot_display").innerHTML = numberOfSpots + " total spots played.";
}

function totalBetDisplay() {
    // Display total bet.
    document.querySelector("#total_bet_display").innerHTML = "$" + totalBet + " bet total.";
}

function wagerDisplay () {
    // Display Wager.
    document.querySelector("#wager_display").innerHTML = "$" + userWager + " bet per game.";
}

function numDisplay () {
    // Display user picks formatted with spaces.
    document.querySelector("#user_num_display").innerHTML = "Your Numbers: " +  userPicks.toString().split(',').join(', ');
}

function displayGamesLeft() {
    // Display number of games left on bottom.
    document.querySelector("#games_left").innerHTML = "Games left: " + (totalGames);
}

function winningDisplay() {
    // Display winning numbers for that current game.
    document.querySelector("#winning_num_display").innerHTML = "Winning Numbers: " + winners;
}


function singleGameWinningsDisplay() {
    // Display winning numbers for that current game.
    if (isNaN(singleGameWinnings))  {
         document.querySelector("#game_winnings").innerHTML = "This games winnings: $0";
    } else {
        document.querySelector("#game_winnings").innerHTML = "This games winnings: $" + singleGameWinnings;
    };
}

function displayProfit() {
    // Display profit or loss.
    document.querySelector("#total_profit").innerHTML = "Total Profit: $ " + totalProfit;
}

function spotGetter() {
    // Assigns final spot value to use for game.
    numberOfSpots = parseInt(spotty.value);
}


function totalGamesGetter() {
    // Assigns total game value.
    totalGames = parseInt(gamesWrapper.value);
}

function userPickGetter() {
    // Assigns final picks to use for game.
    userPicks = pickWrapper.value.split(",");
    // Turns array into numbers instead of strings.
    for (let i = 0; i < userPicks.length; i++) {
        userPicks[i] = Number(userPicks[i]);
    }
    return userPicks;
}

function getWager() {
    // Assigns final wager value to use for game.
    userWager = parseInt(Array.from(document.getElementsByName("wager")).find(r => r.checked).value);
}

function quickPick() {
    // Quick picks numbers for user.
    let nums = new Set();
    while (nums.size !== numberOfSpots) {
        nums.add(Math.floor(Math.random() * 80) + 1);
    };
    return Array.from(nums);
}

function askQuickPickOrUserPick() {
    // Asks user if they want to quick pick.
    if (quickPickYes.checked) {
        spotGetter();
        return document.getElementById('picks').value=quickPick();
    } else {
        spotGetter();
        pickWrapper.value = "";
    };
}

//EVENT LISTENERS

// Inits values and displays when submit button is clicked.
submitValues.addEventListener('click', e => {
    submitValuesOnClick();
}, false);

// Play Keno Game.
playGame.addEventListener('click', e => {
    itemHider(topSettings);
    itemHider(playGame);
    itemShower(nextGameWrapper);
    itemShower(quickPlayWrapper);
    runGame();
}, false);

// Runs quick pick function when clicked.
quickPickYes.addEventListener('click', e => {
    askQuickPickOrUserPick();
}, false);

// Runs quick pick function when clicked.
quickPickNo.addEventListener('click', e => {
    askQuickPickOrUserPick();
}, false);

// Sets spot value if spot range slider changes.
spotty.addEventListener('change', e => {
    numberOfSpots = Number(e.target.value);
}, false);

// Sets wager value if target is checked.
wageWrapper.addEventListener("change", e => {
    if (e.target.checked){
        userWager = Number(e.target.value);
    } else {
        userWager = null;
    };
}, false);

// Play Keno Game.
nextGameWrapper.addEventListener('click', e => {
    nextGame();
}, false);

// Quick Play All Games
quickPlayWrapper.addEventListener('click', e => {
    quickPlayStart();
}, false);

// PlayAgainButton
playAgainButton.addEventListener('click', e => {
    restartGame();
})


function restartGame() {
    // Restart game and clear data.
    clearBottomData();
    clearMiddleData();
    clearTopData();
    itemShower(topSettings);
    itemHider(quickPlayWrapper);
    itemHider(playAgainButton);
    itemShower(submitValues);
    totalProfit = 0;
    totalGameWinnings = 0;
}

function nextGame() {
    // Move onto next game.
    if (totalGames > 0) {
        runGame();
    } else {
        alert("Game Over");
        clearBottomData();
        itemShower(topSettings);
    }
    
}


function quickPlayStart() {
    // Quick Play the remainder of your games without waiting.
    while (totalGames > 0) {
    runGame();
    }
}



function runGame() {
    // Main game play.
    totalGameCounter();
    pickRandomDrawingNumbers();
    checkForMatchingNumbers();
    prizeWinnings();
    calculateTotalGameWinnings();
    calculateTotalProfit();
    displayGameStats();
    checkForGameRestart();
}


function itemHider(itemToHide) {
    // Hide the passed item.
    itemToHide.style.visibility = 'hidden';
}

function itemShower(itemToShow) {
    // Show the passed item.
    itemToShow.style.visibility = 'visible';
}

function clearBottomData () {
    // Clears bottom data. Use this when starting new game
    document.querySelector("#matched_numbers").innerHTML = "";
    document.querySelector("#game_winnings").innerHTML = "";
    document.querySelector("#total_profit").innerHTML = "";
    document.querySelector("#games_left").innerHTML = "";
}

function clearMiddleData() {
    // Clears middle data. Use when starting new game.
    document.querySelector("#spot_display").innerHTML = "";
    document.querySelector("#total_games_display").innerHTML = "";
    document.querySelector("#wager_display").innerHTML = "";
    document.querySelector("#total_bet_display").innerHTML = "";
    document.querySelector("#wager_display").innerHTML = "";
    document.querySelector("#user_num_display").innerHTML = "";
    document.querySelector("#winning_num_display").innerHTML = "";
    
}

function checkForGameRestart () {
    // Checks if games left is 0. If 0 it will hide the next game button and display the play again button.
    if (totalGames === 0) {
        itemHider(quickPlayWrapper);
        itemHider(nextGameWrapper);
        itemShower(playAgainButton);
    }
}