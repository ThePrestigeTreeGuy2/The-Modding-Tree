let modInfo = {
	name: "The Prestige Grid",
	id: "3725864924132784",
	author: "ThePrestigeTreeGuy/Gaming And Walkthroughs on discord/gaw on galaxy.click",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "random57854",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3.1",
	name: "obligatory qol update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3.1: obligatory qol update</h3><br>
		- Added (barely) more content<br>
		- Drastic QoL changes<br>
		- Endgame: Both dot upgrades on the third row<br>
	<h3>v0.3: Expansion Part 1</h3><br>
		- Added more content<br>
		- Added 4 layers<br>
		- Endgame: 3 dots<br>
	<h3>v0.2: The power of 4 (5) layers</h3><br>
		- Added more content<br>
		- Endgame: 1e100 origin<br>
	<h3>v0.1: Beginning of a long journey</h3><br>
		- Release<br>
		- Added 4 layers<br>
		- Endgame: 1 1,1<br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
	return new Decimal(0)
	let gain = new Decimal(1)
	if (hasUpgrade("o", 12)) gain = gain.times(upgradeEffect("o", 12))
	if (hasUpgrade("o", 21)) gain = gain.times(upgradeEffect("o", 21))
	gain = gain.times(buyableEffect('o', 12))
	if (hasUpgrade("0,0", 11)) gain = gain.times(upgradeEffect("0,0", 11))
	if (hasUpgrade("0,0", 12)) gain = gain.times(upgradeEffect("0,0", 12))
	if (hasUpgrade("0,0", 14)) gain = gain.times(upgradeEffect("0,0", 14))
	gain = gain.times(buyableEffect('0,0', 11))
	gain = gain.times(buyableEffect('0,0', 12))
	if (hasUpgrade("0,1", 12)) gain = gain.times(upgradeEffect("0,1", 12))
	if (hasUpgrade("0,1", 14)) gain = gain.times(upgradeEffect("0,1", 14))
	gain = gain.times(buyableEffect('0,1', 11))
	gain = gain.times(buyableEffect('0,1', 12))
	if (hasUpgrade("1,0", 12)) gain = gain.times(upgradeEffect("1,0", 12))
	gain = gain.times(buyableEffect('1,0', 12))
    gain = gain.times(tmp['1,1'].effect)
    if (hasUpgrade("1,1", 12)) gain = gain.times(10)
    if (hasUpgrade("1,1", 21)) gain = gain.times(upgradeEffect("1,1", 21))
    if (hasUpgrade("1,1", 25)) gain = gain.times(10)
	gain = gain.times(buyableEffect('1,1', 11))
    gain = gain.times(tmp['-1,1'].effect)
    if (hasUpgrade("-1,1", 15)) gain = gain.times(upgradeEffect("-1,1", 15))
    if (hasUpgrade("-1,0", 24)) gain = gain.times(upgradeEffect("-1,0", 24))
    if (hasMilestone("d", 1)) gain = gain.times(5)
    if (hasUpgrade("d", 21)) gain = gain.times(upgradeEffect("d", 21))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}