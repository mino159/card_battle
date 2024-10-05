var seed = 66;

function randomVal() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

const gameBoardElement = document.getElementById('game-board');
const infoElement = document.getElementById('info');
const playerCardElement = document.getElementById('player-card');
const attackLabel = document.getElementById('attack');
const moneyLabel = document.getElementById('money');
const shieldLabel = document.getElementById('shield');
const cardLabel = document.getElementById('card');
const cardsElements = document.getElementsByClassName;

let playerHP = 15;  // Player base health
let playerMaxHP = 15;
let playerAttack = 0;  // Player base attack strength
let playerShield = 0;  // Player shield
let playerGold = 0;  // Player money
let playerCards = 0;

let currentBoardData = [];

created = 0;

// Card generation chances (how much cards of 25 will there be)
let chanceSwordCard		= 0.4;   // % chance to generate a sword card
let chanceShieldCard	= 1.5;   // % chance to generate a shield card
let chanceHealCard		= 1.5;   // % chance to generate a heal card
let chanceGoldCard 		= 3;   // % chance to generate a gold card
let chanceEnemyCard		= 10+playerCards+playerAttack;  // % chance to generate an enemy card

totalWeightChanceCard = 1/(chanceSwordCard + chanceShieldCard +chanceHealCard + chanceGoldCard + chanceEnemyCard);
chanceSwordCard	= chanceSwordCard * totalWeightChanceCard;
chanceShieldCard= chanceShieldCard * totalWeightChanceCard + chanceSwordCard;  
chanceHealCard	= chanceHealCard * totalWeightChanceCard + chanceShieldCard;  
chanceGoldCard	= chanceGoldCard * totalWeightChanceCard + chanceHealCard;  
chanceEnemyCard	= chanceEnemyCard * totalWeightChanceCard + chanceGoldCard; 


//Card numbers Min Max based on playerMaxHP
let SwordCardMin	= 0.2+playerAttack/5;
let SwordCardMax	= 1.1+playerAttack/5+playerCards/10;

let ShieldCardMin	= 0.01;
let ShieldCardMax	= 0.3;

let HealCardMin	= 0.01;
let HealCardMax	= 0.5;

let GoldCardMin	= 0.01;
let GoldCardMax	= 0.4;

let EnemyCardMin	= 0.3+ playerCards/10;
let EnemyCardMax	= 0.7+ playerCards/10 + playerAttack/10;

rangeSwordCardMin	= SwordCardMin * playerMaxHP;
rangeSwordCardMax	= SwordCardMax * playerMaxHP;

rangeShieldCardMin	= ShieldCardMin * playerMaxHP;
rangeShieldCardMax	= ShieldCardMax * playerMaxHP;

rangeHealCardMin	= HealCardMin * playerMaxHP;
rangeHealCardMax	= HealCardMax * playerMaxHP;

rangeGoldCardMin	= GoldCardMin * playerMaxHP;
rangeGoldCardMax	= GoldCardMax * playerMaxHP;

rangeEnemyCardMin	= EnemyCardMin * playerMaxHP;
rangeEnemyCardMax	= EnemyCardMax * playerMaxHP;

//loot drop chances (should add up to 1)
let chanceLootAttackUp	= 0.2;
let chanceLootMaxHpUp	= 0.2;
let chanceLootShieldUp	= 0.2 - playerCards/15;
let chanceLootGold		= 0.2 - playerCards/15;
let chanceLootNothing	= 0.2 + playerCards/30;

chanceLootAttackUp 	= chanceLootAttackUp;
chanceLootMaxHpUp 	+= chanceLootAttackUp;
chanceLootShieldUp 	+= chanceLootMaxHpUp;
chanceLootGold		+= chanceLootShieldUp;
chanceLootNothing	+= chanceLootNothing;

let chanceLootGoldAmountMax= rangeGoldCardMax * 2; //relative to playerMaxHP


function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(randomVal() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


// Generate random card
function generateCard() {
	
	let random = randomVal();
	let card = {};
	
	// card.type = 'gold';
	// card.content = ++created
	// card.number =  0
	// return card;
	if (playerCards>0 && playerCards %10===0) {random=0.99;}
	finalChanceSwordCard = chanceSwordCard; //todo
	finalChanceShieldCard = chanceShieldCard; //todo
	finalChanceHealCard = chanceHealCard; //todo - cim viac mas kariet tym menej sa ma generovat
	finalChanceGoldCard = chanceGoldCard; //todo

	 if (random < finalChanceSwordCard) {
		card.type = 'sword';
		card.content = '🗡';
		card.number = getRandomInt(rangeSwordCardMin,rangeSwordCardMax);
	 }else if(random < finalChanceShieldCard) {
		card.type = 'shield';
		card.content = '🛡';
		card.number = getRandomInt(rangeShieldCardMin,rangeShieldCardMax); // Shield amount
	 }else if(random < finalChanceHealCard) {
		card.type = 'heal';
		card.content = '❤️';
		card.number = getRandomInt(rangeHealCardMin,rangeHealCardMax); // Heal amount
	} else if (random < finalChanceGoldCard) {
		card.type = 'gold';
		card.content = '💰';
		card.number = getRandomInt(rangeGoldCardMin,rangeGoldCardMax); 
	} else {
		card.type = 'enemy';
		card.content = '👹';
		card.attack = getRandomInt(rangeEnemyCardMin,rangeEnemyCardMax); // actual Enemy strength
		showMin = getRandomInt(rangeEnemyCardMin,card.attack);
		showMax = getRandomInt(card.attack,rangeEnemyCardMax);
		card.number = `${showMin}-${showMax}`;
		
	}
	return card;
}


// Generate initial game board (5 rows of 5 cards)
function generateBoard() {
	currentBoardData = [];
	for (let i = 0; i < 5*5; i++) {
		currentBoardData.push(generateCard());
	}

	updateBoard();
	updateSelectableCards();
}

// Render the current board state
function updateBoard() {
	if (gameBoardElement.innerHTML === ''){
		return;
	}
	gameBoardElement.innerHTML = '';
	currentBoardData.forEach(cardObj => {
		const card = document.createElement('div');
		card.classList.add('card');
		card.textContent = cardObj.content;

		// Add a number to the corner for enemy strength, heal amount, or gold
		const number = document.createElement('div');
		number.classList.add('number');
		number.textContent = cardObj.number;
		card.appendChild(number);

		gameBoardElement.appendChild(card);
	});
	
}

// Only allow selecting 3 center cards in the bottom row
function updateSelectableCards() {
	const cards = document.querySelectorAll('.card');
	cards.forEach((card, index) => {
		if (index === 21 || index === 22 || index === 23) {
			card.classList.remove('unselectable');
			card.addEventListener('click', function() {
				handleCardClick(card, index);
			});
		} else {
			card.classList.add('unselectable');
		}
	});
}

// Handle card click
function handleCardClick(card, index) {
	updateCardsCount()
	const cardType = currentBoardData[index].type;
	const cardNumber = currentBoardData[index].number;
	
	if (cardType === 'sword') {
		if (playerGold<cardNumber){
			infoElement.textContent = `You don't have enough money for that weapon!`;
			console.log(`not enough money ${playerGold} vs ${cardNumber} `);
		}else {
			++playerAttack
			infoElement.textContent = `You got better weapon, attack increased to ${playerAttack}!`;
			playerGold-=cardNumber;
			console.log(`Attack Up: ${playerAttack}`);
		}
		updatePlayerStats();
		
	}else if (cardType === 'shield') {
		playerShield+=cardNumber
		console.log(`Shielding for ${cardNumber} HP`);
		infoElement.textContent = `You have shield that can take ${cardNumber} dammage!`;
		updatePlayerStats();
		
	}else if (cardType === 'heal') {
		console.log(`Healing for ${cardNumber} HP`);
		infoElement.textContent = `You healed for ${cardNumber} HP!`;
		playerHP = Math.min(playerHP + cardNumber, playerMaxHP);
		updatePlayerStats();
		
	}else if (cardType === 'gold') {
		console.log(`Collected ${cardNumber} gold`);
		infoElement.textContent = `You collected ${cardNumber} gold!`;
		playerGold += cardNumber;
		updatePlayerStats();
		
	}else if (cardType === 'enemy') {
		actualEnemyStrength = currentBoardData[index].attack
		console.log(`Enemy encountered: Strength ${actualEnemyStrength}`);
		infoElement.textContent = `You encountered an enemy with strength ${actualEnemyStrength}!`;
		combat(actualEnemyStrength, index);
	}
	timeToWait = 1000;
	if (index === 21) {
		animateColumnsRight()
		setTimeout(() => {shiftColumnsRight()},timeToWait); // Left card clicked
	} else if (index === 23) {
		animateColumnsLeft()
		setTimeout(() => {shiftColumnsLeft()},timeToWait);  // Right card clicked
	} else if (index ===22) {
		animateRows();
		setTimeout(() => {shiftRows()},timeToWait);   // Middle card clicked (normal behavior)
	}
}


function updateCardsCount(){
	cardLabel.textContent = ++playerCards;
	console.log(`Cards Count: ${playerCards}`);
}

function combat(actualEnemyStrength, index) {
	var damage = actualEnemyStrength;
	damage = Math.max(damage - playerShield,0);
	playerShield = Math.max(playerShield - actualEnemyStrength, 0);
	playerHP = Math.max(playerHP-damage,0);
		
	console.log(`You attacked! You took ${damage} damage!`);
	infoElement.textContent += ` You lost ${damage} HP!`;
	giveLoot(actualEnemyStrength)
	updatePlayerStats();
	
	if (playerHP <= 0) {
		gameOver();
	}
}

function giveLoot(enemyStrength){
	let random = randomVal();
	chanceStrongerEnemy = enemyStrength//3
	finalChanceLootAttackUp = chanceLootAttackUp
	finalChanceLootMaxHpUp = chanceLootMaxHpUp
	finalChanceLootGold = chanceLootGold
	if (random < chanceLootAttackUp){
		++playerAttack;
		console.log("Loot attack up");
		infoElement.textContent = `You got better weapon, attack increased to ${playerAttack}!`;
		
	}else if (random < chanceLootMaxHpUp){
		console.log("Loot max hp up");
		++playerMaxHP;
		infoElement.textContent = `Your Max HP increased to ${playerMaxHP} !`;
		
	}else if (random < chanceLootGold){
		numOfGold = Math.floor(chanceLootGoldAmountMax *  randomVal()+GoldCardMin * chanceStrongerEnemy);
		console.log("Loot gold " + numOfGold);
		playerGold += numOfGold;
		infoElement.textContent = `You earned ${numOfGold} Gold!`;
		
	}else{
		console.log("Loot Nothing");
		infoElement.textContent = `No loot this time!`;
	}
	
}


function updatePlayerStats() {
	//playerCardElement.innerText = `🧙`;
	playerCardElement.children[0].textContent = `${playerHP}/${playerMaxHP}`
	moneyLabel.textContent = playerGold;
	shieldLabel.textContent = playerShield;
	attackLabel.textContent = playerAttack;
}


function gameOver() {
	gameBoardElement.innerHTML = '';
	infoElement.textContent = "Game Over! Refresh to play again.";
}

// Shift rows after moving player (5x5 grid logic)
function shiftRows() {
	// Shift rows down, starting from the bottom
	for (let row = 4; row > 0; row--) {
		for (let col = 0; col < 5; col++) {
			currentBoardData[row * 5 + col] = currentBoardData[(row - 1) * 5 + col];
		}
	}

	// Generate new top row (5 cards)
	for (let i = 0; i < 5; i++) {
		currentBoardData[i] = generateCard();
	}
	
	updateBoard(); // Render the updated board
	updateSelectableCards(); // Update selectable 3 center cards
}

// Shift columns left when right card is selected
function shiftColumnsLeft() {
	for (let row = 0; row < 5; row++) {
		// Shift all columns to the left within each row
		for (let col = 0; col < 4; col++) {
			currentBoardData[row * 5 + col] = currentBoardData[row * 5 + col + 1];
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
			currentBoardData[row * 5 + col] = currentBoardData[row * 5 + col - 1];
		}
		// Generate a new card for the leftmost column
		currentBoardData[row * 5] = generateCard();
	}

	shiftRows(); // Shift rows after column shift
}

function animateColumnsRight(){
	const cards = document.querySelectorAll('.card');
	cards.forEach((card, index) => {
		card.classList.add('shift-right-down');
		if (index>=20 || index%5==4){
			card.classList.add('transparent');
		}
	});
}
function animateColumnsLeft(){
	const cards = document.querySelectorAll('.card');
	cards.forEach((card, index) => {
		card.classList.add('shift-left-down');
		if (index>=20 || index%5==0){
			card.classList.add('transparent');
		}
	});
}
function animateRows(){
	const cards = document.querySelectorAll('.card');
	cards.forEach((card, index) => {
		card.classList.add('shift-down');
		if (index>=20){
			card.classList.add('transparent');
		}
	});
}

generateBoard();
