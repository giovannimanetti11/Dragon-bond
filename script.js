const Tournament = {
    fighters: [
        { name: "Master Roshi", powerLevel: 55, avatar: "avatars/roshi.webp", moves: ["Kamehameha", "Sealing Spell"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Krillin", powerLevel: 50, avatar: "avatars/krillin.png", moves: ["Kamehameha", "Destructo Disc"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Goku", powerLevel: 60, avatar: "avatars/goku-kid.webp", moves: ["Kamehameha", "Punch"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Yamcha", powerLevel: 45, avatar: "avatars/yamcha.png", moves: ["Kamehameha", "Wolf Fang Fist"], wins: 0, fights: 0, defenseActivated: false },
        { name: "King Chapa", powerLevel: 30, avatar: "avatars/King_Chapa.webp", moves: ["Eight-Arm Fist", "Punch"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Nam", powerLevel: 35, avatar: "avatars/nam.png", moves: ["Punch", "Kick"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Mr. Satan", powerLevel: 35, avatar: "avatars/mr-satan.webp", moves: ["Punch", "Kick"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Tien Shinhan", powerLevel: 55, avatar: "avatars/Tenshinhan.webp", moves: ["Tri-Beam", "Dodon Ray"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Taopaipai", powerLevel: 50, avatar: "avatars/taopaipai.webp", moves: ["Dodon Ray", "Kick"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Giran", powerLevel: 50, avatar: "avatars/giran.webp", moves: ["Block", "Tail Whip"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Chiaotzu", powerLevel: 45, avatar: "avatars/Chiaotzu.webp", moves: ["Telekinesis", "Dodon Ray"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Wolf Man", powerLevel: 35, avatar: "avatars/Wolf_Man.webp", moves: ["Punch", "Kick"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Pamput", powerLevel: 35, avatar: "avatars/Pamput.webp", moves: ["Punch", "Kick"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Piccolo", powerLevel: 59, avatar: "avatars/Piccolo.webp", moves: ["Special Beam Cannon", "Sealing Spell"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Bacterian", powerLevel: 25, avatar: "avatars/Bacterian.png", moves: ["Stink", "Punch"], wins: 0, fights: 0, defenseActivated: false },
        { name: "Kami", powerLevel: 58, avatar: "avatars/kami.webp", moves: ["Energy Wave", "Sealing Spell"], wins: 0, fights: 0, defenseActivated: false }
    ]
};

let currentRound = 1;
let turn = 'left';
let rounds = {};
let isFirstAttack = true; // Tracking first attack

// Shuffle array elements
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Tournament init
initializeTournament();

// Bracket init
function initializeTournament() {
    const bracketContainer = document.getElementById('bracket-container');
    const fighters = shuffle([...Tournament.fighters]);
    let round = 1;

    while (fighters.length > 1) {
        rounds[round] = [];
        const roundContainer = document.createElement('div');
        roundContainer.classList.add('bracket-round');
        roundContainer.id = `round-${round}`;
        bracketContainer.appendChild(roundContainer);

        for (let i = 0; i < fighters.length; i += 2) {
            const match = document.createElement('div');
            match.classList.add('bracket-matchup');
            match.innerHTML = `
                <div class="bracket-fighter">${fighters[i].name}</div>
                <div class="bracket-fighter">${fighters[i + 1] ? fighters[i + 1].name : 'BYE'}</div>
            `;
            roundContainer.appendChild(match);
            rounds[round].push({ fighter1: fighters[i], fighter2: fighters[i + 1] || null });
        }

        fighters.length = 0;
        round += 1;
    }
}

// Get a random fighter
function getRandomFighter(exclude = []) {
    let candidates = Tournament.fighters.filter(p => !exclude.includes(p.name));
    if (candidates.length === 0) {
        console.error("No available fighters.");
        return null;
    }

    const minFights = Math.min(...candidates.map(p => p.fights));
    candidates = candidates.filter(p => p.fights === minFights);

    if (candidates.length === 0) {
        candidates = Tournament.fighters.filter(p => !exclude.includes(p.name));
    }

    if (candidates.length === 0) {
        console.error("No available fighters.");
        return null;
    }

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
}

// Select a random move from available moves
function getRandomMove(moves) {
    const index = Math.floor(Math.random() * moves.length);
    return moves[index];
}

// Set fighter details in the DOM
function setFighterDetails(fighter, side) {
    if (!fighter) {
        console.error(`Fighter not found for ${side} side.`);
        return;
    }
    document.getElementById(`${side}-avatar`).src = fighter.avatar;
    document.getElementById(`${side}-name`).innerHTML = `${fighter.name}`;
    document.getElementById(`${side}-name-powerlevel`).innerHTML = `<img src="icons/power.png" alt="Power Icon" class="powerIcon"><strong>${fighter.powerLevel}</strong>`;
    document.getElementById(`${side}-attacca`).disabled = false;
}

// Initialize the fight
function initializeFight() {
    const currentMatches = rounds[currentRound];
    if (!currentMatches || currentMatches.length === 0) {
        console.error("No more matches in the current round.");
        return;
    }

    const match = currentMatches.shift();
    if (!match) {
        console.error("No match available.");
        return;
    }

    setFighterDetails(match.fighter1, 'left');
    setFighterDetails(match.fighter2, 'right');

    match.fighter1.fights += 1;
    match.fighter2.fights += 1;

    Tournament.fighters.forEach(fighter => resetFighterStatus(fighter));

    highlightTurn();
    resetBars(); // Reset life and energy bars
    clearMoveNames(); // Reset move names
    isFirstAttack = true; // Reset isFirstAttack per il nuovo scontro
}

// Reset fighter status
function resetFighterStatus(fighter) {
    fighter.defenseActivated = false;
}

// Highlight current turn and handle attack button
function highlightTurn() {
    document.getElementById('left-fighter').classList.remove('highlight-yellow', 'highlight-blue');
    document.getElementById('right-fighter').classList.remove('highlight-yellow', 'highlight-blue');
    document.getElementById(`${turn}-fighter`).classList.add('highlight-yellow');
    const fighterName = document.getElementById(`${turn}-name`).innerText.split(" <span")[0].trim();

    const fighter = Tournament.fighters.find(p => p.name === fighterName);
    if (fighter) {
        const currentEnergy = parseInt(document.getElementById(`${turn}-energy-bar`).innerText);
        document.getElementById(`${turn}-attacca`).disabled = currentEnergy < 20;
    } else {
        console.error("Fighter not found in highlightTurn:", fighterName);
    }
}

// Clear move names
function clearMoveNames() {
    document.getElementById('left-move-name').innerText = '';
    document.getElementById('right-move-name').innerText = '';
}

// Reset life and energy bars
function resetBars() {
    updateBar('left', 'life', 100);
    updateBar('left', 'energy', 100);
    updateBar('right', 'life', 100);
    updateBar('right', 'energy', 100);
}

// Update bar
function updateBar(side, barType, value) {
    const barElement = document.getElementById(`${side}-${barType}-bar`);
    barElement.innerText = value;
    barElement.style.width = `${value}%`;
}

// Animate life bar
function animateLifeBar(side, currentLife, newLife) {
    const barElement = document.getElementById(`${side}-life-bar`);
    barElement.innerText = newLife;
    barElement.style.transition = 'width 1s';
    barElement.style.width = `${newLife}%`;
    // Flashing effect to show damage taken
    barElement.style.animation = 'flash 0.5s ease-in-out';
    setTimeout(() => {
        barElement.style.animation = '';
    }, 500);
}

// Play a sound
function playAudio(filePath) {
    const audio = new Audio(filePath);
    audio.play();
}


// Perform an action (attack or defend)
function performAction(side, action) {
    if (side !== turn) {
        alert("It's not your turn!");
        return;
    }

    const opponentSide = (side === 'left') ? 'right' : 'left';
    const fighterNameElement = document.getElementById(`${side}-name`);
    const opponentNameElement = document.getElementById(`${opponentSide}-name`);

    if (!fighterNameElement || !opponentNameElement) {
        console.error("Missing DOM elements:", { fighterNameElement, opponentNameElement });
        return;
    }

    const fighterName = fighterNameElement.innerText.split(" <span")[0].trim();
    const opponentName = opponentNameElement.innerText.split(" <span")[0].trim();

    const fighter = Tournament.fighters.find(p => p.name === fighterName);
    const opponent = Tournament.fighters.find(p => p.name === opponentName);

    if (!fighter || !opponent) {
        console.error("Fighter or opponent not found:", { fighter, opponent });
        return;
    }

    if (action === 'attacca') {
        const move = getRandomMove(fighter.moves);
        document.getElementById(`${side}-move-name`).innerText = move;
        if (move === "Kamehameha") {
            playAudio("suoni/kamehameha.mp3");
        }
        if (move === "Punch") {
            playAudio("suoni/punch.mp3");
        }
        if (move === "Kick") {
            playAudio("suoni/kick.mp3");
        }
        if (move === "Special Beam Cannon") {
            playAudio("suoni/beam-cannon.mp3");
        }
        if (move === "Wolf Fang Fist") {
            playAudio("suoni/wolf-fang-fist.mp3");
        }
        let damage = Math.floor(fighter.powerLevel * (Math.random() * 0.75 + 0.5));

        if (isFirstAttack) {
            damage = Math.floor(damage * 0.7); // Reduce damage for first attack by 30% for balancing
            isFirstAttack = false; // First attack is done
        }

        if (opponent.defenseActivated) {
            damage = Math.floor(damage * 0.75);
            opponent.defenseActivated = false;
        }

        let currentLife = parseInt(document.getElementById(`${opponentSide}-life-bar`).innerText);
        const newLife = Math.max(currentLife - damage, 0);

        animateLifeBar(opponentSide, currentLife, newLife);

        const currentEnergy = parseInt(document.getElementById(`${side}-energy-bar`).innerText);
        const newEnergy = Math.max(currentEnergy - 20, 0);
        updateBar(side, 'energy', newEnergy);

        if (newLife === 0) {
            declareWinner(fighter.name, move, opponentSide);
            return;
        }
    } else if (action === 'difendi') {
        const currentLife = parseInt(document.getElementById(`${side}-life-bar`).innerText);
        const newLife = Math.min(currentLife + 25, 100);
        updateBar(side, 'life', newLife);

        const currentEnergy = parseInt(document.getElementById(`${side}-energy-bar`).innerText);
        const newEnergy = Math.min(currentEnergy + 25, 100);
        updateBar(side, 'energy', newEnergy);

        fighter.defenseActivated = true; // Enable defense
    }

    turn = (turn === 'left') ? 'right' : 'left';
    highlightTurn();
    setTimeout(() => {
        clearMoveNames();
    }, 3000);
}

// Declare Winner and update bracket
function declareWinner(winner, winningMove, loserSide) {
    alert(`${winner} won with ${winningMove}!`);

    const winnerFighter = Tournament.fighters.find(p => p.name === winner);
    const loserFighter = Tournament.fighters.find(p => document.getElementById(`${loserSide}-name`).innerText.includes(p.name));

    // Update bracket
    updateBracket(winnerFighter.name, loserFighter.name);

    // Update wins
    winnerFighter.wins += 1;
    updateCombatLevel(winnerFighter, loserFighter);


    // Next round
    if (rounds[currentRound].length === 0) {
        advanceTournament();
    } else {
        initializeFight();
    }
}

// Update bracket with winner
function updateBracket(winner, loser) {
    const matchups = document.querySelectorAll('.bracket-matchup');
    matchups.forEach(match => {
        const fighterElements = match.querySelectorAll('.bracket-fighter');
        fighterElements.forEach(fighterElement => {
            if (fighterElement.innerText === loser) {
                fighterElement.classList.add('strikethrough');
            }
            if (fighterElement.innerText === winner) {
                fighterElement.classList.remove('strikethrough');
                fighterElement.classList.add('winner');
            }
        });
    });
}

// Update combat level
function updateCombatLevel(winner, loser) {
    const increase = Math.floor(Math.random() * 5) + 1;
    const decrease = Math.floor(Math.random() * 5) + 1;

    winner.powerLevel += increase;
    loser.powerLevel = Math.max(loser.powerLevel - decrease, 0);
}


// Advance tournament
function advanceTournament() {
    const winners = [];
    const previousRound = currentRound;

    document.querySelectorAll(`#round-${previousRound} .bracket-fighter.winner`).forEach(element => {
        const winnerName = element.innerText;
        const winner = Tournament.fighters.find(fighter => fighter.name === winnerName);
        if (winner) {
            winners.push(winner);
        }
    });

    currentRound += 1;
    if (winners.length > 1) {
        rounds[currentRound] = [];

        const bracketContainer = document.getElementById('bracket-container');
        const roundContainer = document.createElement('div');
        roundContainer.classList.add('bracket-round');
        roundContainer.id = `round-${currentRound}`;
        bracketContainer.appendChild(roundContainer);

        for (let i = 0; i < winners.length; i += 2) {
            const match = document.createElement('div');
            match.classList.add('bracket-matchup');
            match.innerHTML = `
                <div class="bracket-fighter">${winners[i].name}</div>
                <div class="bracket-fighter">${winners[i + 1] ? winners[i + 1].name : 'BYE'}</div>
            `;
            roundContainer.appendChild(match);
            rounds[currentRound].push({ fighter1: winners[i], fighter2: winners[i + 1] || null });
        }

        alert(`Round ${currentRound} starts`);
        initializeFight();
    } else if (winners.length === 1) {
        alert(`${winners[0].name} won the Tenkaichi!`);
    } else {
        alert("Tenkaichi has ended.");
    }
}

// Initialize the tournament and update results
initializeFight();



