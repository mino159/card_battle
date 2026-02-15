// Selecting the script.js file and making the specified changes

// Original lines to update
// Line 201: Change "card.number * 2;" to "card.number *= 2;"
// Line 213: Change "card.number * 2;" to "card.number *= 2;"
// Lines 222-226: Update heal card logic using rangeHealCardMin() and rangeHealCardMax()
// Change numIcon from "-💰" to "+❤️"
// Lines 406-407: Update shield calculation logic

// Fix permanent sword card
if (card.name === 'Permanent Sword') {
    card.number *= 2;
}

// Fix permanent shield card
if (card.name === 'Permanent Shield') {
    card.number *= 2;
}

// Fix permanent heal card
if (card.name === 'Permanent Heal') {
    const rangeHealMin = rangeHealCardMin();
    const rangeHealMax = rangeHealCardMax();
    // Existing code to use rangeHealMin and rangeHealMax...
}

// Update numIcon
numIcon = "+❤️";

// Fix combat shield calculation
function combat() {
    damage -= playerShield;
    playerShield = 0;
    // Existing combat logic...
}