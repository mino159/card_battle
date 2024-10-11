var seed = 66;
GAMEOVER = false;

function randomVal() {
    return Math.random();
    // var x = Math.sin(seed++) * 10000;
    // return x - Math.floor(x);
}

function popupVisible(bool) {
    if (bool) {
        visible = "flex";
    } else {
        visible = "none";
    }
    popupElement.style.display = visible
}

const popupElement = document.getElementById("popup");
const gameBoardElement = document.getElementById("game-board");
const infoElement = document.getElementById("info");
const playerCardElement = document.getElementById("player-card");
const hpLabel = document.getElementById("hp");
const attackLabel = document.getElementById("attack");
const moneyLabel = document.getElementById("money");
const shieldLabel = document.getElementById("shield");
const cardLabel = document.getElementById("card");
const cardsElements = document.getElementsByClassName;

let initPlayerHP = 15; // Player base health
let initPlayerMaxHP = 15;
let initPlayerAttack = 0; // Player base attack strength
let initPlayerShield = 0; // Player shield
let initPlayerGold = 0; // Player money
let initPlayerCards = 0;

let playerHP = initPlayerHP; // Player base health
let playerMaxHP = initPlayerMaxHP;
let playerAttack = initPlayerAttack; // Player base attack strength
let playerShield = initPlayerShield; // Player shield
let playerGold = initPlayerGold; // Player money
let playerCards = initPlayerCards;

let currentBoardData = [];

created = 0;

// Card generation chances
let chanceSwordCard = 0.03; // % chance to generate a sword card
let chanceShieldCard = 0.08; // % chance to generate a shield card
let chanceHealCard = 0.14; // % chance to generate a heal card
let chanceGoldCard = 0.18; // % chance to generate a gold card
let chanceEnemyCard = 0.57; // % chance to generate an enemy card
let chancePermanentCard = 0.01;

cardsChances = [
    chanceSwordCard,
    chanceShieldCard,
    chanceHealCard,
    chanceGoldCard,
    chanceEnemyCard
];
// console.log(
//     chanceSwordCard +
//         chanceShieldCard +
//         chanceHealCard +
//         chanceGoldCard +
//         chanceEnemyCard
// );
chanceSwordCard = chanceSwordCard;
chanceShieldCard = chanceShieldCard + chanceSwordCard;
chanceHealCard = chanceHealCard + chanceShieldCard;
chanceGoldCard = chanceGoldCard + chanceHealCard;
chanceEnemyCard = chanceEnemyCard + chanceGoldCard;

finalChanceSwordCard = function () {
    return chanceSwordCard - playerAttack / 100;
};
finalChanceShieldCard = function () {
    return chanceShieldCard - playerShield / 100;
};
finalChanceHealCard = function () {
    return chanceHealCard - playerShield / 100;
};
finalChanceGoldCard = function () {
    return chanceGoldCard - playerGold / 300;
};
function getChancePermanentCard() {
    return chancePermanentCard + playerCards / 500;
}
// finalChanceEnemyCard netreba lebo je to vsetko zvysne

//Card numbers Min Max based on playerMaxHP
let SwordCardMin = 8;
let SwordCardMax = 15;

let ShieldCardMin = 3;
let ShieldCardMax = 10;

let HealCardMin = 1;
let HealCardMax = 5;

let GoldCardMin = 1;
let GoldCardMax = 4;

let EnemyCardMin = 4;
let EnemyCardMax = 10;

rangeSwordCardMin = function () {
    return SwordCardMin + playerAttack / 5;
};
rangeSwordCardMax = function () {
    return SwordCardMax + playerAttack / 5 + playerCards / 10;
};

rangeShieldCardMin = function () {
    return (ShieldCardMin * playerMaxHP) / 15;
};
rangeShieldCardMax = function () {
    return (ShieldCardMax * playerMaxHP) / 15;
};

rangeHealCardMin = function () {
    return (HealCardMin * playerMaxHP) / 15;
};
rangeHealCardMax = function () {
    return (HealCardMax * playerMaxHP) / 15;
};

rangeGoldCardMin = function () {
    return (GoldCardMin * playerMaxHP) / 15;
};
rangeGoldCardMax = function () {
    return (GoldCardMax * playerMaxHP) / 15;
};

rangeEnemyCardMin = function () {
    return EnemyCardMin + playerCards / 10;
};
rangeEnemyCardMax = function () {
    return EnemyCardMax + playerCards / 10 + playerAttack / 10;
};

//loot drop chances (should add up to 1)
let chanceLootAttackUp = 0.1;
let chanceLootShieldUp = 0.1;
let chanceLootMaxHpUp = 0.4;
let chanceLootGold = 0.2;
let chanceLootNothing = 0.2;

lootsChances = [
    chanceLootAttackUp,
    chanceLootShieldUp,
    chanceLootMaxHpUp,
    chanceLootGold,
    chanceLootNothing
];

chanceLootAttackUp = chanceLootAttackUp;
chanceLootShieldUp += chanceLootAttackUp;
chanceLootMaxHpUp += chanceLootShieldUp;
chanceLootGold += chanceLootMaxHpUp;
chanceLootNothing += chanceLootGold;

if (chanceLootNothing !== 1) {
    console.log("Chances don't add up");
}

/**Give you random integer between two numbers (max exclusive)*/
function randomIntBetween(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(randomVal() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// Generate random card
function generateCard(row) {
    let random = randomVal();
    let card = {};

    // card.type = 'gold';
    // card.content = ++created
    // card.number =  0
    // return card;

    if (playerCards > 0 && playerCards % 10 === 0 && row === "row") {
        random = 1;
    }
    isPermanent = randomVal() < getChancePermanentCard();

    if (random < finalChanceSwordCard()) {
        card.type = "sword";
        card.content = "🗡";
        card.number = randomIntBetween(
            rangeSwordCardMin(),
            rangeSwordCardMax()
        );
        card.numIcon = "-💰";
        card.permanent = isPermanent;
        if (isPermanent) {
            card.number * 2;
        }
    } else if (random < finalChanceShieldCard()) {
        card.type = "shield";
        card.content = "🛡";
        card.number = randomIntBetween(
            rangeShieldCardMin(),
            rangeShieldCardMax()
        ); // Shield amount
        card.numIcon = "-💰";
        card.permanent = isPermanent;
        if (isPermanent) {
            card.number * 2;
        }
    } else if (random < finalChanceHealCard()) {
        card.type = "heal";
        card.content = "❤️";
        card.number = randomIntBetween(rangeHealCardMin(), rangeHealCardMax()); // Heal amount
        card.numIcon = "+❤️";
        card.permanent = isPermanent;
        if (isPermanent) {
            card.number = randomIntBetween(
                rangeSwordCardMin(),
                rangeSwordCardMax()
            );
            card.numIcon = "-💰";
        }
    } else if (random < finalChanceGoldCard()) {
        card.type = "gold";
        card.content = "💰";
        card.number = randomIntBetween(rangeGoldCardMin(), rangeGoldCardMax());
        card.numIcon = "+💰";
    } else {
        card.type = "enemy";
        card.content = "👹";
        card.attack = randomIntBetween(
            rangeEnemyCardMin(),
            rangeEnemyCardMax()
        ); // actual Enemy strength
        showMin = randomIntBetween(rangeEnemyCardMin(), card.attack);
        showMax = randomIntBetween(card.attack, rangeEnemyCardMax());
        card.number = `${showMin}/${showMax}`;
        card.numIcon = "-❤️";
    }
    return card;
}

// Generate initial game board (5 rows of 5 cards)
function generateBoard() {
    currentBoardData = [];
    for (let i = 0; i < 5 * 5; i++) {
        currentBoardData.push(generateCard());
    }

    updateBoard();
    updateSelectableCards();
}

// Render the current board state
function updateBoard() {
    if (gameBoardElement.innerHTML === "") {
        return;
    }
    gameBoardElement.innerHTML = "";
    currentBoardData.forEach(cardObj => {
        const card = document.createElement("div");
        card.classList.add("card", cardObj.type);
        card.textContent = cardObj.content;
        if (cardObj.permanent) {
            card.classList.add("permanent");
        }

        const name = document.createElement("span");
        name.classList.add("name");
        name.textContent = cardObj.type;
        card.appendChild(name);

        // Add a number to the corner for enemy strength, heal amount, or gold
        const number = document.createElement("div");
        number.classList.add("number");

        number.textContent = cardObj.number;
        card.appendChild(number);

        const icon = document.createElement("span");
        icon.classList.add("icon");
        icon.textContent = cardObj.numIcon;
        number.appendChild(icon);

        gameBoardElement.appendChild(card);
    });
}

// Only allow selecting 3 center cards in the bottom row
function updateSelectableCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        if (index === 21 || index === 22 || index === 23) {
            card.classList.remove("unselectable");
            card.addEventListener("click", function () {
                handleCardClick(card, index);
            });
        } else {
            card.classList.add("unselectable");
        }
    });
}

// Handle card click
function handleCardClick(card, index) {
    updateCardsCount();
    const cardType = currentBoardData[index].type;
    const cardNumber = currentBoardData[index].number;
    const isPermanent = currentBoardData[index].permanent;

    if (cardType === "sword") {
        if (playerGold < cardNumber) {
            infoElement.textContent = `You don't have enough money for that weapon!`;
            //console.log(`not enough money ${playerGold} vs ${cardNumber} `);
        } else {
            playerAttack = Math.floor(
                1 +
                    (randomVal() +
                        (cardNumber - rangeSwordCardMin()) /
                            rangeSwordCardMax())
            );
            infoElement.textContent = `You got better weapon, attack increased to ${playerAttack}!`;
            playerGold -= cardNumber;
            //console.log(`Attack Up: ${playerAttack}`);
        }
        if (isPermanent) {
            initPlayerAttack++;
        }
        updatePlayerStats();
    } else if (cardType === "shield") {
        if (playerGold < cardNumber) {
            infoElement.textContent = `You don't have enough money for that shield!`;
        } else {
            playerGold -= cardNumber;
            playerShield++;
            infoElement.textContent = `You have shield that can take +1 dammage!`;
            if (isPermanent) {
                initPlayerShield++;
            }
        }

        //console.log(`Shielding for ${cardNumber} HP`);

        updatePlayerStats();
    } else if (cardType === "heal") {
        //console.log(`Healing for ${cardNumber} HP`);
        infoElement.textContent = `You healed for ${cardNumber} HP!`;
        playerHP = Math.min(playerHP + cardNumber, playerMaxHP);
        if (isPermanent) {
            initPlayerMaxHP++;
        }
        updatePlayerStats();
    } else if (cardType === "gold") {
        //console.log(`Collected ${cardNumber} gold`);
        infoElement.textContent = `You collected ${cardNumber} gold!`;
        playerGold += cardNumber;
        updatePlayerStats();
    } else if (cardType === "enemy") {
        actualEnemyStrength = currentBoardData[index].attack;
        //console.log(`Enemy encountered: Strength ${actualEnemyStrength}`);
        infoElement.textContent = `You encountered an enemy with strength ${actualEnemyStrength}!`;
        combat(actualEnemyStrength, index);
        if (GAMEOVER) {
            return;
        }
    }
    timeToWait = 1000;
    if (index === 21) {
        animateColumnsRight();
        setTimeout(() => {
            shiftColumnsRight();
        }, timeToWait); // Left card clicked
    } else if (index === 23) {
        animateColumnsLeft();
        setTimeout(() => {
            shiftColumnsLeft();
        }, timeToWait); // Right card clicked
    } else if (index === 22) {
        animateRows();
        setTimeout(() => {
            shiftRows();
        }, timeToWait); // Middle card clicked (normal behavior)
    }
}

function updateCardsCount() {
    cardLabel.textContent = ++playerCards;
    //console.log(`Cards Count: ${playerCards}`);
}

function combat(actualEnemyStrength, index) {
    var damage = actualEnemyStrength;
    damage = Math.max(damage - playerAttack, 0);

    if (damage - playerShield <= 0) {
        //shield is more
        playerShield -= damage;
        damage = 0;
    } else {
        //enemy has more
        playerShield = 0;
        damage -= playerShield;
    }
    playerHP = Math.max(playerHP - damage, 0);

    //console.log(`You attacked! You took ${damage} damage!`);
    infoElement.textContent += ` You lost ${damage} HP!`;
    giveLoot(actualEnemyStrength);
    updatePlayerStats();

    if (playerHP <= 0) {
        gameOver();
    }
}

function giveLoot(enemyStrength) {
    let random = randomVal();
    //calculate bonus when enemy is stronger
    chanceStrongerEnemy = (enemyStrength - rangeEnemyCardMin()) / 100;

    finalChanceLootAttackUp = chanceLootAttackUp + chanceStrongerEnemy;
    finalChanceLootShieldUp = chanceLootShieldUp + chanceStrongerEnemy;
    finalChanceLootMaxHpUp = chanceLootMaxHpUp + chanceStrongerEnemy;
    finalChanceLootGold = chanceLootGold + chanceStrongerEnemy;

    if (random < finalChanceLootAttackUp) {
        add = Math.floor(1 + (randomVal() + 0.2)); // 20% ze dostane 2
        playerAttack += add;
        // console.log(`Loot attack up to ${playerAttack}!`);
        infoElement.textContent = `You found better weapon, attack +${add}!`;
        return 0;
    } else if (random < finalChanceLootShieldUp) {
        add = Math.floor(1 + (randomVal() + 0.2)); // 20% ze dostane 2
        playerShield += add;
        //console.log(`Loot Shield up to ${playerShield}!`);
        infoElement.textContent = `Your shiled increased +${add}!`;
        return 1;
    } else if (random < finalChanceLootMaxHpUp) {
        playerMaxHP += Math.floor(1 + (randomVal() + 0.2)); // 20% ze dostane 2
        //console.log(`Loot max hp up to ${playerMaxHP} !`);
        infoElement.textContent = `Your Max HP increased to ${playerMaxHP} !`;
        return 2;
    } else if (random < finalChanceLootGold) {
        numOfGold = Math.floor(
            rangeGoldCardMin() * 1.2 +
                rangeGoldCardMax() *
                    1.5 * // 2x vyssia ciastka moze padnut ako pri kartach
                    randomVal() +
                10 * chanceStrongerEnemy
        );
        //console.log("Loot gold " + numOfGold);
        playerGold += numOfGold;
        infoElement.textContent = `You earned ${numOfGold} Gold!`;
        return 3;
    } else {
        //console.log("Loot Nothing");
        infoElement.textContent = `No loot this time!`;
        return 4;
    }
}

function updatePlayerStats() {
    //playerCardElement.innerText = `🧙`;
    hpLabel.textContent = `${playerHP}/${playerMaxHP}`;
    moneyLabel.textContent = playerGold;
    shieldLabel.textContent = playerShield;
    attackLabel.textContent = playerAttack;
    cardLabel.textContent = playerCards;
}

function gameOver() {
    //gameBoardElement.innerHTML = "";
    GAMEOVER = true;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.classList.add("unselectable");
    });

    infoElement.textContent = "Game Over! Buy new gear and play again.";
    //popupElement.innerHTML = "";
    popupVisible(true);
}
function restartGame() {
    //initPlayerMaxHP++;
    GAMEOVER = false;
    playerMaxHP = initPlayerMaxHP;
    playerHP = playerMaxHP;
    playerGold = initPlayerGold;
    playerAttack = initPlayerAttack;
    playerShield = initPlayerShield;
    playerCards = initPlayerCards;
    updatePlayerStats();
    generateBoard();
}

// Shift rows after moving player (5x5 grid logic)
function shiftRows() {
    // Shift rows down, starting from the bottom
    for (let row = 4; row > 0; row--) {
        for (let col = 0; col < 5; col++) {
            currentBoardData[row * 5 + col] =
                currentBoardData[(row - 1) * 5 + col];
        }
    }

    // Generate new top row (5 cards)
    for (let i = 0; i < 5; i++) {
        currentBoardData[i] = generateCard("row");
    }

    updateBoard(); // Render the updated board
    updateSelectableCards(); // Update selectable 3 center cards
}

// Shift columns left when right card is selected
function shiftColumnsLeft() {
    for (let row = 0; row < 5; row++) {
        // Shift all columns to the left within each row
        for (let col = 0; col < 4; col++) {
            currentBoardData[row * 5 + col] =
                currentBoardData[row * 5 + col + 1];
        }
        // Generate a new card for the rightmost column
        currentBoardData[row * 5 + 4] = generateCard();
    }

    shiftRows(); // Shift rows after column shift
}

// Shift columns right when left card is selected
function shiftColumnsRight() {
    for (let row = 0; row < 5; row++) {
        // Shift all columns to the right within each row
        for (let col = 4; col > 0; col--) {
            currentBoardData[row * 5 + col] =
                currentBoardData[row * 5 + col - 1];
        }
        // Generate a new card for the leftmost column
        currentBoardData[row * 5] = generateCard();
    }

    shiftRows(); // Shift rows after column shift
}

function animateColumnsRight() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.classList.add("shift-right-down");
        if (index >= 20 || index % 5 == 4) {
            card.classList.add("transparent");
        }
    });
}
function animateColumnsLeft() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.classList.add("shift-left-down");
        if (index >= 20 || index % 5 == 0) {
            card.classList.add("transparent");
        }
    });
}
function animateRows() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.classList.add("shift-down");
        if (index >= 20) {
            card.classList.add("transparent");
        }
    });
}

generateBoard();

// TEST PROBABILITIES
numOfTest = 10000;
function testCardProbab() {
    var cards = [0, 0, 0, 0, 0];
    for (i = 0; i < numOfTest; i++) {
        var card = generateCard();
        if (card.type === "sword") {
            ++cards[0];
        } else if (card.type === "shield") {
            ++cards[1];
        } else if (card.type === "heal") {
            ++cards[2];
        } else if (card.type === "gold") {
            ++cards[3];
        } else if (card.type === "enemy") {
            ++cards[4];
        }
    }
    console.log(cards);
    a = [];
    cards.forEach((card, i) => {
        a.push(Math.floor(card / cardsChances[i]));
    });
    console.log(a);
}
/**Test of loot probabilty -!- need enemy HP as parameter-!- */
function testLootProbab(num = 10) {
    var loots = [0, 0, 0, 0, 0];
    for (i = 0; i < numOfTest; i++) {
        ++loots[giveLoot(num)];
    }
    console.log(loots);
    a = [];
    loots.forEach((loot, i) => {
        a.push(Math.floor(loot / lootsChances[i]));
    });
    console.log(a);
}
