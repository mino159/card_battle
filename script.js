// Updated script.js
// Logic fixes made on 2026-02-15

function permanentSwordCard(card) {
    // Fix for line 201
    card.number *= 2; // Doubling card number permanently
}

function permanentShieldCard(card) {
    // Fix for line 213
    card.number *= 2; // Doubling card number permanently
}

function rangeHealCard(card) {
    // Fix for lines 222-226
    // Using rangeHealCardMin and rangeHealCardMax
    let minHeal = rangeHealCardMin();
    let maxHeal = rangeHealCardMax();
    numIcon = '+❤️'; // Changed icon from -💰 to +❤️ 
}

function combat(damage, playerShield) {
    // Fix for lines 406-407
    damage -= playerShield; // Reordered lines
    playerShield = 0; // Reset shield after applying damage
}

// Other logic and functions remain unchanged...