addLayer("d", {
    name: "doors", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🚪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#49261A",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "doors", // Name of prestige currency
    baseResource: "studs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(1.2)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for doors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked() {return hasUpgrade('d',12)}
        },
    },
    upgrades: {
        11: {
            title: "Doors 1",
            description: "x(doors+2)^2 stud gain",
            cost: new Decimal(1),    
            effect() {
                return player[this.layer].points.add(2).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Doors 2",
            description: "Every Door upgrade doubles stud gain. (also unlocks door buyables)",
            cost: new Decimal(5),    
            effect() {
                return new Decimal(2).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Doors 3",
            description: "Unlock the next layer.",
            cost: new Decimal(9),
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(7).add(x.pow(2)) },
            title: "Doored Studs",
            display() { return `x4 stud gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(4).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("d",12))}
        },
    },
})
addLayer("c", {
    name: "closets", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#3f0d06",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "closets", // Name of prestige currency
    baseResource: "studs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(1.1)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for closets", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('d',13)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
        },
    },
    upgrades: {
        11: {
            title: "Closets 1",
            description: "x5 stud gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Closets 2",
            description: "x(closets+2)^2 stud gain.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(2).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
    buyables: {
    },
})