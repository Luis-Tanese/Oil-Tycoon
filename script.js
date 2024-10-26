let oil = 0;
let oilPerClick = 1;
let oilPerSecond = 0;
let lastClickTime = 0;
let autoclickCheckInterval = 20;
let totalOilCollected = 0;
let clickUpgradesOwned = 0;
let passiveUpgradesOwned = 0;

const clickUpgrades = [
    { name: "Manual Pump Efficiency", cost: 10, increment: 1 },
    { name: "Automated Lever", cost: 50, increment: 5 },
    { name: "Drill Augmentation", cost: 100, increment: 10 },
    { name: "Enhanced Pipelines", cost: 250, increment: 15 },
    { name: "Supercharged Pump", cost: 500, increment: 25 },
    { name: "Mega Drill", cost: 1000, increment: 35 },
    { name: "Hydraulic Fracturing", cost: 2500, increment: 50 },
    { name: "Nanotech Pump", cost: 5000, increment: 75 },
    { name: "Quantum Drill", cost: 10000, increment: 100 },
    { name: "Hyperloop Pipes", cost: 25000, increment: 150 },
    { name: "Space Elevator Drill", cost: 50000, increment: 200 },
    { name: "Dimensional Rift Pump", cost: 100000, increment: 300 },
    { name: "Galactic Nexus Extraction", cost: 250000, increment: 500 }
];

const passiveUpgrades = [
    { name: "Efficient Refinery", cost: 50, increment: 1 },
    { name: "Solar Power Panels", cost: 200, increment: 5 },
    { name: "Oil Rig Automation", cost: 500, increment: 10 },
    { name: "Deep Drilling", cost: 1000, increment: 15 },
    { name: "Advanced Extraction", cost: 2500, increment: 25 },
    { name: "Biofuel Reactor", cost: 5000, increment: 35 },
    { name: "Fusion Power Plants", cost: 10000, increment: 50 },
    { name: "Quantum Extractor", cost: 25000, increment: 75 },
    { name: "Interstellar Harvesters", cost: 50000, increment: 100 },
    { name: "Nebula Energy Siphon", cost: 100000, increment: 150 },
    { name: "Wormhole Mining Network", cost: 250000, increment: 200 },
    { name: "Universal Oil Transmuter", cost: 500000, increment: 300 },
    { name: "Cosmic Singularity Pump", cost: 1000000, increment: 500 }
];

const storageKey = "oilTycoonData_v3";

function loadGame() {
    const savedData = JSON.parse(localStorage.getItem(storageKey));
    if (savedData) {
        oil = savedData.oil || 0;
        oilPerClick = savedData.oilPerClick || 1;
        oilPerSecond = savedData.oilPerSecond || 0;
        totalOilCollected = savedData.totalOilCollected || 0;
        clickUpgradesOwned = savedData.clickUpgradesOwned || 0;
        passiveUpgradesOwned = savedData.passiveUpgradesOwned || 0;
        if (savedData.clickUpgrades) {
            savedData.clickUpgrades.forEach((data, index) => {
                clickUpgrades[index].cost = data.cost;
            });
        }
        if (savedData.passiveUpgrades) {
            savedData.passiveUpgrades.forEach((data, index) => {
                passiveUpgrades[index].cost = data.cost;
            });
        }
    }
    updateDisplay();
}

function saveGame() {
    const gameData = {
        oil,
        oilPerClick,
        oilPerSecond,
        totalOilCollected,
        clickUpgradesOwned,
        passiveUpgradesOwned,
        clickUpgrades: clickUpgrades.map(upgrade => ({ cost: upgrade.cost })),
        passiveUpgrades: passiveUpgrades.map(upgrade => ({ cost: upgrade.cost })),
    };
    localStorage.setItem(storageKey, JSON.stringify(gameData));
}

function updateDisplay() {
    document.getElementById("oil-count").textContent = Math.floor(oil);
    document.getElementById("oil-per-click").textContent = oilPerClick;
    document.getElementById("oil-per-second").textContent = oilPerSecond;
    document.getElementById("total-oil").textContent = Math.floor(oil);
    document.getElementById("total-oil-collected").textContent = totalOilCollected;
    document.getElementById("click-upgrades-owned").textContent = clickUpgradesOwned;
    document.getElementById("passive-upgrades-owned").textContent = passiveUpgradesOwned;
}

function startDrillAnimation(type) {
    const drillButton = document.getElementById("oil-button");
    if (type === "fast") {
        drillButton.classList.add("drill-fast");
        drillButton.classList.remove("drill-slow");
    } else if (type === "slow") {
        drillButton.classList.add("drill-slow");
        drillButton.classList.remove("drill-fast");
    } else {
        drillButton.classList.remove("drill-fast", "drill-slow");
    }
}

function setupUpgrades() {
    const clickContainer = document.getElementById("click-upgrades-container");
    const passiveContainer = document.getElementById("passive-upgrades-container");

    clickUpgrades.forEach((upgrade, index) => {
        const button = document.createElement("button");
        button.className = "btn-upgrade";
        button.dataset.type = "click";
        button.dataset.index = index;
        button.innerHTML = `${upgrade.name} - Cost: ${upgrade.cost} Oil`;
        button.onclick = () => buyUpgrade("click", index);
        clickContainer.appendChild(button);
    });

    passiveUpgrades.forEach((upgrade, index) => {
        const button = document.createElement("button");
        button.className = "btn-upgrade";
        button.dataset.type = "passive";
        button.dataset.index = index;
        button.innerHTML = `${upgrade.name} - Cost: ${upgrade.cost} Oil`;
        button.onclick = () => buyUpgrade("passive", index);
        passiveContainer.appendChild(button);
    });
}

function updateUpgradeButtons() {
    const clickButtons = document.querySelectorAll('[data-type="click"]');
    clickButtons.forEach((button, index) => {
        button.innerHTML = `${clickUpgrades[index].name} - Cost: ${clickUpgrades[index].cost} Oil`;
    });

    const passiveButtons = document.querySelectorAll('[data-type="passive"]');
    passiveButtons.forEach((button, index) => {
        button.innerHTML = `${passiveUpgrades[index].name} - Cost: ${passiveUpgrades[index].cost} Oil`;
    });
}

function buyUpgrade(type, index) {
    const upgrades = type === "click" ? clickUpgrades : passiveUpgrades;
    const upgrade = upgrades[index];

    if (oil >= upgrade.cost) {
        oil -= upgrade.cost;
        totalOilCollected += upgrade.cost;
        if (type === "click") {
            oilPerClick += upgrade.increment;
            clickUpgradesOwned += 1;
        } else if (type === "passive") {
            oilPerSecond += upgrade.increment;
            passiveUpgradesOwned += 1;
        }
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        saveGame();
        updateDisplay();
        updateUpgradeButtons();
    }
}

document.getElementById("oil-button").addEventListener("click", function() {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < autoclickCheckInterval) {
        alert("Autoclicking detected! Slow down.");
        return;
    }
    lastClickTime = currentTime;

    oil += oilPerClick;
    updateDisplay();
    saveGame();

    startDrillAnimation("fast");
    setTimeout(() => startDrillAnimation("stop"), 200);
});

setInterval(function() {
    if (oilPerSecond > 0) {
        oil += oilPerSecond;
        startDrillAnimation("slow");
    }
    updateDisplay();
    saveGame();
}, 1000);

function resetGame() {
    localStorage.removeItem(storageKey);
    location.reload();
}

function showResetModal() {
    document.getElementById('reset-modal').style.display = "block";
}

function hideResetModal() {
    document.getElementById("reset-modal").style.display = "none";
}

function sendToRepo() {
    window.location.href = "https://github.com/Luis-Tanese/Oil-Tycoon";
}

loadGame();
updateDisplay();
setupUpgrades();
setInterval(saveGame, 5000);
