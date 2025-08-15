let modInfo = {
	name: "The Doors Tree 2",
	id: "372586492413278",
	author: "ThePrestigeTreeGuy/Gaming And Walkthroughs on discord/gaw on galaxy.click",
	pointsName: "studs",
	modFiles: ["layers.js", "tree.js"],

	discordName: "random57854",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.2",
	name: "Surprise Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0.2</h3><br>
		- New update<br>
		- Ngl I haven't planned to make this update at all until the day before the update released<br>
		- Added 1 Layer<br>
		- Endgame: 1 decillion studs.
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
	if (hasUpgrade('d', 11)) gain = gain.times(upgradeEffect('d', 11))
	if (hasUpgrade('d', 12)) gain = gain.times(upgradeEffect('d', 12))
	if (hasUpgrade('d', 14)) gain = gain.times(upgradeEffect('d', 14))
	if (hasUpgrade('d', 21)) gain = gain.times(upgradeEffect('d', 21))
	if (hasUpgrade('d', 22)) gain = gain.times(10)
	gain = gain.times(buyableEffect('d', 11))
	gain = gain.times(buyableEffect('d', 12))
	if (hasUpgrade('c', 11)) gain = gain.times(5)
	if (hasUpgrade('c', 12)) gain = gain.times(upgradeEffect('c', 12))
	if (hasUpgrade('c', 13)) gain = gain.times(upgradeEffect('c', 13))
	if (hasUpgrade('r', 11)) gain = gain.times(5)
	if (hasMilestone('r', 1)) gain = gain.times(5)
	if (hasMilestone('r', 1)) gain = gain.times(tmp['r'].milestones[1].effect)
	if (hasMilestone('r', 2)) gain = gain.times(tmp['r'].milestones[2].effect)
	if (hasUpgrade('d', 23)) gain = gain.pow(upgradeEffect('d', 23))
	if (hasMilestone('r', 4)) gain = gain.pow(tmp['r'].milestones[4].effect)
	if (hasUpgrade('r', 11)) gain = gain.pow(1.02)
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
	return player.points.gte(new Decimal("e33"))
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