let oil = 0;
let oilPerClick = 1;
let oilPerSecond = 0;
let clickUpgradeCost = 10;
let passiveUpgradeCost = 50;
let autoclickCheckInterval = 20;

function loadGame() {
    const savedData = JSON.parse(localStorage.getItem("oilTycoonData"));
    if (savedData) {
        oil = savedData.oil || 0;
        oilPerClick = savedData.oilPerClick || 1;
        oilPerSecond = savedData.oilPerSecond || 0;
        clickUpgradeCost = savedData.clickUpgradeCost || 10;
        passiveUpgradeCost = savedData.passiveUpgradeCost || 50;
    }
}

function saveGame() {
    const gameData = {
        oil,
        oilPerClick,
        oilPerSecond,
        clickUpgradeCost,
        passiveUpgradeCost
    };
    localStorage.setItem("oilTycoonData", JSON.stringify(gameData));
}

function updateDisplay() {
    document.getElementById("oil-count").textContent = Math.floor(oil);
    document.getElementById("oil-per-click").textContent = oilPerClick;
    document.getElementById("oil-per-second").textContent = oilPerSecond;
    document.getElementById("click-upgrade-cost").textContent = clickUpgradeCost;
    document.getElementById("passive-upgrade-cost").textContent = passiveUpgradeCost;
}

let lastClickTime = 0;
document.getElementById("oil-button").addEventListener("click", function() {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < autoclickCheckInterval) {
        alert("Autoclicking detected! You beast slow down.");
        return;
    }
    lastClickTime = currentTime;

    oil += oilPerClick;
    updateDisplay();
    saveGame();
});

document.getElementById("passive-upgrade").addEventListener("click", function() {
    if (oil >= passiveUpgradeCost) {
        oil -= passiveUpgradeCost;
        oilPerSecond += 1;
        passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.8);
        updateDisplay();
        saveGame();
    }
});

document.getElementById("click-upgrade").addEventListener("click", function() {
    if (oil >= clickUpgradeCost) {
        oil -= clickUpgradeCost;
        oilPerClick += 1;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        updateDisplay();
        saveGame();
    }
});

setInterval(function() {
    oil += oilPerSecond;
    updateDisplay();
    saveGame();
}, 1000);

loadGame();
updateDisplay();
setInterval(saveGame, 5000);