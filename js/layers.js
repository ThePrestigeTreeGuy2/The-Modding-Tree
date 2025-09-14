addLayer("o", {
    name: "Origin", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#999999",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Origin", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("o", 11)) mult = mult.times(upgradeEffect("o", 11))
        if (hasUpgrade("o", 22)) mult = mult.times(upgradeEffect("o", 22))
        mult = mult.times(buyableEffect("o", 11))
        mult = mult.times(buyableEffect("o", 13))
        if (hasUpgrade("o", 23)) mult = mult.times(upgradeEffect("0,0", 11))
        if (hasUpgrade("0,1", 13)) mult = mult.times(upgradeEffect("0,1", 13))
        if (hasUpgrade("1,0", 23)) mult = mult.times(buyableEffect("1,0", 11))
        if (hasUpgrade("1,0", 25)) mult = mult.times(upgradeEffect("0,0", 14))
        if (hasUpgrade("1,1", 11)) mult = mult.times(5)
        if (hasUpgrade("1,1", 21)) mult = mult.times(upgradeEffect("1,1", 21))
        if (hasUpgrade("1,1", 25)) mult = mult.times(10)
        if (hasUpgrade("-1,0", 25)) mult = mult.times(upgradeEffect("-1,0", 25))
        if (hasMilestone("d", 1)) mult = mult.times(5)
        mult = mult.times(tmp['1,-1'].effect)
        if (hasMilestone("d", 2)) mult = mult.times(tmp['d'].milestones[2].effect)
        if (hasUpgrade("d", 24)) mult = mult.times(upgradeEffect("d", 24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 201, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    upgrades: {
    },
    layerShown(){return (hasMilestone("0,0",1))},
    passiveGeneration() {
        if (hasMilestone("0,0",1)) return 1;
    },
    automate() {
        if (hasMilestone("d", 7)) {
            buyBuyable("o", 11);
            buyBuyable("o", 12);
            buyBuyable("o", 13);
        }
    },
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (hasMilestone('d', 5)) keptUpgrades.push(11,12,13,14,15,21,22,23,24,25)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
    },
    tabFormat: {
        "Upgrades": {
            content: ['main-display','upgrades'],
        },
        "Buyables": {
            content: ['main-display','buyables'],
            unlocked(){return (hasUpgrade("1,0",13))}
        },
    },
    upgrades: {
        11: {
            title: "Origin I",
            description: "Origin boosts 0,0 gain and itself.",
            cost: new Decimal(20),
            tooltip: "x(log10(x+1)+1)^0.75 0,0 gain and Origin gain.",
            effect() {if (hasUpgrade('o',14)) return player[this.layer].points.add(1).log10().add(1).pow(0.75).pow(upgradeEffect('o',14))
                else return player[this.layer].points.add(1).log10().add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Origin II",
            description: "Origin boosts point gain.",
            cost: new Decimal(5e3),
            unlocked(){return (hasUpgrade("o",11))},
            tooltip: "x(log10(x+1)+1) point gain.",
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(buyableEffect('o',12))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Origin III",
            description: "Unlock an Origin buyable.",
            cost: new Decimal(1e8),
            unlocked(){return (hasUpgrade("0,0",34))},
        },
        14: {
            title: "Origin IV",
            description: "Every Origin upgrade exponentiates Origin I effect.",
            cost: new Decimal(1e11),
            unlocked(){return (hasUpgrade("o",13))},
            effect() {
                return new Decimal(1).add((player[this.layer].upgrades.length))
            },
            effectDisplay() { return '^' + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
        15: {
            title: "Origin V",
            description: "Square 0,1,1,0,0 and 1,0,1,0,0 effect.",
            cost: new Decimal(1e21),
            unlocked(){return (hasUpgrade("o",14))},
        },
        21: {
            title: "Origin VI",
            description: "Every Origin upgrade multiples point gain by 3.",
            cost: new Decimal(1e38),
            unlocked(){return (hasUpgrade("1,0",21))},
            effect() {
                let x = new Decimal(3)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Origin VII",
            description: "Total 1,1 boosts Origin gain.",
            cost: new Decimal(1e43),
            unlocked(){return (hasUpgrade("1,0",22))},
            effect() {
                return player['1,1'].total.add(1).log2().add(1).pow(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Origin VIII",
            description: "Time to buff the most forgotten upgrade! Origin IV now affects 0,0,0,0,0, and 0,0,0,0,0 also boosts Origin gain.",
            cost: new Decimal(1e55),
            unlocked(){return (hasUpgrade("1,0",23))},
        },
        24: {
            title: "Origin IX",
            description: "Cube the 1,1,0,1,0 effect.",
            cost: new Decimal(1e68),
            unlocked(){return (hasUpgrade("1,0",24))},
        },
        25: {
            title: "Origin X",
            description: "Square 0,0,0,0,0 effect...",
            cost: new Decimal(1e86),
            unlocked(){return (hasUpgrade("1,0",25))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1e3).mul(new Decimal(10).pow(x.pow(2))) },
            title: "Origin 1",
            display() { return `Origin boosts Origin gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            tooltip: "xlog10(x+1)+1 Origin gain",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return player[this.layer].points.add(1).log10().add(1).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",13))}
        },
        12: {
            cost(x) { return new Decimal(1e6).mul(new Decimal(10).pow(x.pow(2))) },
            title: "Origin 2",
            display() { return `Exponentiate the Origin II effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            tooltip: "^(x+1) Origin 2 effect.",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",13))}
        },
        13: {
            cost(x) { return new Decimal(1e9).mul(new Decimal(10).pow(x.pow(2))) },
            title: "Origin 3",
            display() { return `1,0 boosts Origin gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            tooltip: "xlog2(x+1)+1 Origin gain.",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){ if (hasUpgrade('1,0',21)) return player['1,0'].points.add(1).log2().add(1).pow(1.5).pow(getBuyableAmount(this.layer,this.id))
                else return player['1,0'].points.add(1).log2().add(1).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("o",13))}
        },
    },
})
addLayer("0,0", {
    name: "0,0", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "0,0", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "0,0", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.5)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
	    if (hasUpgrade("0,0", 13)) mult = mult.times(upgradeEffect("0,0", 13))
	    if (hasUpgrade("0,0", 24)) mult = mult.times(upgradeEffect("0,0", 24))
        if (hasUpgrade("o", 11)) mult = mult.times(upgradeEffect("o", 11))
        mult = mult.times(tmp['0,1'].effect)
        mult = mult.times(tmp['1,0'].effect)
        mult = mult.times(buyableEffect('1,0', 11))
        mult = mult.times(tmp['1,1'].effect)
        if (hasUpgrade("1,1", 13)) mult = mult.times(5)
        if (hasUpgrade("1,1", 25)) mult = mult.times(10)
        mult = mult.times(buyableEffect("-1,1", 11))
        if (hasMilestone("d", 1)) mult = mult.times(5)
        if (player[this.layer].points.gte('e500')) mult = mult.times(player.points.log10())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    softcap : new Decimal("e500"),
    softcapPower: new Decimal(0),
    row: 200, // Row the layer is in on the tree (0 is the first row)
    displayRow: 100,
    layerShown(){return true},
    passiveGeneration() {
        if (hasUpgrade("1,1",24)|hasMilestone("d",3)) return 1;
    },
    automate() {
        if (hasUpgrade("1,1", 23)) {
            buyBuyable("0,0", 11);
            buyBuyable("0,0", 12);
            buyBuyable("0,0", 13);
            buyBuyable("0,0", 21);
        }
        if (hasMilestone("d", 2)) {
            buyBuyable("0,0", 11);
            buyBuyable("0,0", 12);
            buyBuyable("0,0", 13);
            buyBuyable("0,0", 21);
        }
    },
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (hasUpgrade('1,0', 11)) keptUpgrades.push(11,12,13,14,15,21,22,23,24,25)
    if (hasMilestone('1,1', 1)) keptUpgrades.push(11,12,13,14,15,21,22,23,24,25)
    if (hasMilestone('d', 1)) keptUpgrades.push(11,12,13,14,15,21,22,23,24,25)
    if (hasMilestone('d', 4)) keptUpgrades.push(31,32,33,34,35)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    if (hasMilestone('d', 4)) keep.push("milestones");

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
    },
    tabFormat: {
        "Upgrades": {
            content() {if (hasUpgrade("1,1",24)|hasMilestone("d",3)) return ['main-display','upgrades']
                else return ['main-display','prestige-button','upgrades']
            },
        },
        "Buyables": {
            content() {if (hasUpgrade("1,1",24)|hasMilestone("d",3)) return ['main-display','buyables']
                else return ['main-display','prestige-button','buyables']
            },
            unlocked(){return (hasUpgrade("0,0",15))},
        },
        "Milestones": {
            content() {if (hasUpgrade("1,1",24)|hasMilestone("d",3)) return ['main-display','milestones']
                else return ['main-display','prestige-button','milestones']
            },
            unlocked(){return (hasUpgrade("0,1",11))},
        },
    },
    upgrades: {
        11: {
            title: "0,0,0,0,0",
            description: "x2 points.",
            cost: new Decimal(1),
            effect() {
                if (hasUpgrade('o',25)) return new Decimal (2).pow(2).pow(upgradeEffect('o',14))
                if (hasUpgrade('o',23)) return new Decimal (2).pow(upgradeEffect('o',14))
                else return new Decimal (2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "0,0,0,0,1",
            description: "0,0 boosts point gain.",
            cost: new Decimal(2),
            unlocked(){return (hasUpgrade("0,0",11))},
            tooltip: "x(log10(x+1)+1)^2 point gain",
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "0,0,0,0,2",
            description: "0,0 boosts 0,0 gain.",
            cost: new Decimal(10),
            unlocked(){return (hasUpgrade("0,0",12))},
            tooltip: "xlog10(x+1)+1)^0.5 0,0 gain",
            effect() {
                let x = new Decimal(1)
                if (hasUpgrade('0,0', 23)) x = new Decimal(1).mul(2)
                return player[this.layer].points.add(1).log10().add(1).pow(0.5).pow(x)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "0,0,0,0,3",
            description: "Every 0,0 upgrade multiples point gain by 1.2.",
            cost: new Decimal(20),
            unlocked(){return (hasUpgrade("0,0",13))},
            effect() {
                let x = new Decimal(1.2)
                if (hasUpgrade('0,0', 21)) x = new Decimal(1.2).pow(2)
                if (hasUpgrade('1,0', 25)) x = new Decimal(1.2).pow(2).pow(2)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "0,0,0,0,4",
            description: "Unlock a 0,0 buyable.",
            cost: new Decimal(50),
            unlocked(){return (hasUpgrade("0,0",14))},
        },
        21: {
            title: "0,0,0,1,0",
            description: "Square the 0,0,0,0,3 effect.",
            cost: new Decimal(100),
            unlocked(){return (hasUpgrade("0,0",15))},
        },
        22: {
            title: "0,0,0,1,1",
            description: "^1.75 the 0,0,1,0,0 effect.",
            cost: new Decimal(250),
            unlocked(){return (hasUpgrade("0,0",21))},
        },
        23: {
            title: "0,0,0,1,2",
            description: "Square the 0,0,0,0,2 effect.",
            cost: new Decimal(500),
            unlocked(){return (hasUpgrade("0,0",22))},
        },
        24: {
            title: "0,0,0,1,3",
            description: "Every 0,0 upgrade multiplies 0,0 gain by 1.075",
            cost: new Decimal(1500),
            unlocked(){return (hasUpgrade("0,0",23))},
            effect() {
                return new Decimal(1.075).pow(player[this.layer].upgrades.length).pow(buyableEffect('0,0',13))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        25: {
            title: "0,0,0,1,4",
            description: "Unlock the next layer.",
            cost: new Decimal(5000),
            unlocked(){return (hasUpgrade("0,0",24))},
        },
        31: {
            title: "0,0,0,2,0",
            description: "0,0,1,0,1 adds to 0,0,1,0,0. (pg132 moment fr)",
            cost: new Decimal(2.5e22),
            unlocked(){return (hasMilestone("1,1",1))},
        },
        32: {
            title: "0,0,0,2,1",
            description: "0,0,1,0,0 double exponent is now 1.22.",
            cost: new Decimal(2.5e23),
            unlocked(){return (hasUpgrade("0,0",31))},
        },
        33: {
            title: "0,0,0,2,2",
            description: "0,0,1,0,1 double exponent is now 1.6.",
            cost: new Decimal(5e24),
            unlocked(){return (hasUpgrade("0,0",32))},
        },
        34: {
            title: "0,0,0,2,3",
            description: "Unlock more Origin upgrades.",
            cost: new Decimal(1e26),
            unlocked(){return (hasUpgrade("0,0",33))},
        },
        35: {
            title: "0,0,0,2,4",
            description: "Unlock a 0,0 buyable.",
            cost: new Decimal(1e42),
            unlocked(){return (hasUpgrade("0,0",34))},
        },
    },
    buyables: {
        11: {
            cost(x) {if (hasUpgrade('0,0',32)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.22)))
                else if (hasUpgrade('1,0',11)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.4)))
                else if (hasUpgrade('0,1',11)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.6)))
                else return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,0,1,0,0",
            display() { if (hasUpgrade('0,0',31)) return `x1.5 point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) + " + " + format(getBuyableAmount(this.layer,12)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'
            else return `x1.5 point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(1.5).add(buyableEffect('0,0',21))
                if (hasUpgrade('0,0', 22)) y = new Decimal(1.5).add(buyableEffect('0,0',21)).pow(1.75)
                if (hasUpgrade('0,0', 31)) return new Decimal(y).pow(getBuyableAmount(this.layer,this.id).add(getBuyableAmount(this.layer,12)))
                else return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                if (hasMilestone('d',1)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(2))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return (hasUpgrade("0,0",15))}
        },
        12: {
            cost(x) { if (hasUpgrade('-1,1',22)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.6)))
                if (hasUpgrade('0,0',33)) return new Decimal(100000000).mul(x.add(1).pow(x.add(1).pow(1.6)))
                else return new Decimal(100000000).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,0,1,0,1",
            display() { return `Points boost point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + "x"},
            tooltip()  {if (hasUpgrade('1,0',14)) return `xlog10(x+1)+1)^0.4 point gain`
                else return `xlog10(x+1)+1)^0.25 point gain`
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                if (hasUpgrade('1,0',14)) return player.points.add(1).log10().add(1).pow(0.4).pow(getBuyableAmount(this.layer,this.id))
                else return player.points.add(1).log10().add(1).pow(0.25).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,1",15))}
        },
        13: {
            cost(x) { if (hasUpgrade('-1,1',22)) return new Decimal(1).mul(new Decimal(10).pow(x.pow(2)))
                else return new Decimal(1e14).mul(new Decimal(10).pow(x.pow(2))) },
            title: "0,0,1,0,2",
            display() { return `Exponentiate the 0,0,0,1,3 effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            tooltip: "^(x+1) 0,0,0,1,3 effect.",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",15))}
        },
        21: {
            cost(x) { if (hasUpgrade('-1,1',22)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2)))
                if (hasUpgrade('-1,1',14)) return new Decimal(1e42).mul(x.add(1).pow(x.add(1).pow(2)))
                else return new Decimal(1e42).mul(x.add(1).pow(x.add(1).pow((new Decimal(2).pow(x.div(10).add(1)))))) },
            title: "0,0,1,1,0",
            display() { return `+0.1 to the 0,0,1,0,0 base. (before exponent)
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(0.1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,0",35))}
        },
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 100,000 0,0 (1)",
            effectDescription: "Unlock Origin.",
            done() { return player[this.layer].points.gte(1e5) }
        },
        2: {
            requirementDescription: "Requires: 1e10 0,0 (2)",
            effectDescription: "0,0 multiplies 1,0 gain.",
            done() { return player[this.layer].points.gte(1e10) },
            unlocked(){return (hasMilestone("0,0",1))},
            effect() {
                return player[this.layer].points.add(1).log10().div(10).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
})
addLayer("0,1", {
    name: "0,1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "0,1", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['0,0'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#FFD4D4",
    requires: new Decimal(1e4), // Can be a function that takes requirement increases into account
    resource: "0,1", // Name of prestige currency
    baseResource: "0,0", // Name of resource prestige is based on
    baseAmount() {return player['0,0'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.25)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("1,1", 14)) mult = mult.times(3)
        if (hasUpgrade("0,1", 22)) mult = mult.times(upgradeEffect("0,1", 22))
        if (hasUpgrade("1,1", 25)) mult = mult.times(10)
        if (hasMilestone("d", 1)) mult = mult.times(2)
        if (hasUpgrade("-1,1", 12)) mult = mult.times(tmp['-1,1'].effect)
        if (hasUpgrade("d", 22)) mult = mult.times(upgradeEffect("d", 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 201, // Row the layer is in on the tree (0 is the first row)
    displayRow: 99,
    layerShown(){if (hasUpgrade('0,0',25)|player[this.layer].total.gte(1)) return true},
    passiveGeneration() {
        if (hasMilestone("d",4)) return 1;
    },
    automate() {
        if (hasMilestone("d", 3)) {
            buyBuyable(this.layer, 11);
            buyBuyable(this.layer, 12);
        }
    },
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (hasUpgrade('1,1', 21)) keptUpgrades.push(11,12,13,14,15)
    if (hasMilestone('d', 1)) keptUpgrades.push(11,12,13,14,15)
    if (hasMilestone('d', 5)) keptUpgrades.push(21,22,23,24,25)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    // if (someOtherCondition) keep.push("milestones");

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
    },
    effect() {
        if (hasUpgrade('0,1',21)) return player[this.layer].total.add(1).log2().add(1).pow(new Decimal(2).add(upgradeEffect('0,1',21)))
        else return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying 0,0 gain by ' + format(tmp['0,1'].effect)},
    tabFormat: {
        "Upgrades": {
            content() {if (hasMilestone("d",7)) return ['main-display','upgrades']
                else return ['main-display','prestige-button','upgrades']
            },
        },
        "Buyables": {
            content() {if (hasMilestone("d",7)) return ['main-display','buyables']
                else return ['main-display','prestige-button','buyables']
            },
            unlocked(){return (hasUpgrade("0,1",15))},
        },
    },
    upgrades: {
        11: {
            title: "0,1,0,0,0",
            description: "0,0,1,0,0 double exponent is lowered to 1.6, and unlock the 0,0 milestones tab.",
            cost: new Decimal(1),
        },
        12: {
            title: "0,1,0,0,1",
            description: "Total 0,1 boosts point gain.",
            cost: new Decimal(5),
            tooltip: "x(log2(x+1)+1) point gain",
            unlocked(){return (hasUpgrade("0,1",11))},
            effect() {
                return player[this.layer].total.add(1).log2().add(1).pow(buyableEffect('0,1',12))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "0,1,0,0,2",
            description: "Total 0,1 boosts Origin gain.",
            cost: new Decimal(10),
            tooltip: "x(log2(x+1)+1)^2 Origin gain",
            unlocked(){return (hasUpgrade("0,1",12))},
            effect() {if (hasUpgrade("0,1",23)) return player[this.layer].total.add(1).log2().add(1).pow(2.6)
                else return player[this.layer].total.add(1).log2().add(1).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "0,1,0,0,3",
            description: "Points boost themselves.",
            cost: new Decimal(15),
            tooltip: "x(log10(x+1)+1)^0.5 points gain",
            unlocked(){return (hasUpgrade("0,1",13))},
            effect() {if (hasUpgrade("1,0",22)) return player.points.add(1).log10().add(1).pow(0.5).pow(buyableEffect('o',12))
                else return player.points.add(1).log10().add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "0,1,0,0,4",
            description: "Unlock the next layer, a 0,0 buyable, and a 0,1 buyable.",
            cost: new Decimal(30),
            unlocked(){return (hasUpgrade("0,1",14))},
        },
        21: {
            title: "0,1,0,1,0",
            description: "Every 0,1 upgrade adds 0.2 to the 0,1 effect exponent.",
            cost: new Decimal(1e11),
            unlocked(){return (hasUpgrade("1,1",21))},
            effect() {
                return new Decimal(player[this.layer].upgrades.length).mul(0.2)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
        22: {
            title: "0,1,0,1,1",
            description: "Origin boosts 0,1 gain.",
            cost: new Decimal(2.5e12),
            unlocked(){return (hasUpgrade("0,1",21))},
            tooltip: "x(log10(x+1)+1) 0,1 gain",
            effect() {
                return player['o'].points.add(1).log10().add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" }, // Add formatting to the effect
        },
        23: {
            title: "0,1,0,1,2",
            description: "^1.3 0,1,0,0,2 effect.",
            cost: new Decimal(1e14),
            unlocked(){return (hasUpgrade("0,1",22))},
        },
        24: {
            title: "0,1,0,1,3",
            description: "Every 0,1 upgrade subtracts 0.03 from the 0,1,1,0,0 and 0,1,1,0,1 double exponents.",
            cost: new Decimal(2.5e14),
            unlocked(){return (hasUpgrade("0,1",23))},
            effect() {
                return new Decimal(player[this.layer].upgrades.length).mul(-0.03)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
        25: {
            title: "0,1,0,1,4",
            description: "0,1,1,0,1 amount boosts 0,1,1,0,0 effect at a reduced rate.",
            cost: new Decimal(1e15),
            unlocked(){return (hasUpgrade("0,1",24))},
            tooltip: "^(x^0.4) 0,1,1,0,0 effect",
        },
    },
    buyables: {
        11: {
            cost(x) {if (hasUpgrade('0,1',24)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(new Decimal(2).add(upgradeEffect('0,1',24)))))
                else return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,1,1,0,0",
            display() { return `x2 point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(2)
                if (hasUpgrade('o',15)) y = new Decimal(2).pow(2)
                if (hasUpgrade('0,1',25)) y = new Decimal(2).pow(2).pow(new Decimal(getBuyableAmount('0,1',12)).pow(0.4))
                if (hasUpgrade('1,1',24)) return new Decimal(y).pow(3).pow(getBuyableAmount(this.layer,this.id))
                else return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,1",15))}
        },
        12: {
            cost(x) {if (hasUpgrade('0,1',24)) return new Decimal(1e4).mul(new Decimal(10).pow(x.mul(4).pow(new Decimal(2).add(upgradeEffect('0,1',24)))))
                else return new Decimal(1e4).mul(new Decimal(10).pow(x.mul(4).pow(2))) },
            title: "0,1,1,0,1",
            display() { return `Exponentiate the 0,1,0,0,1 effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            tooltip: "^(x+1) 0,1,0,0,1 effect.",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("1,1",1))}
        },
    },
})
addLayer("1,0", {
    name: "1,0", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1,0", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['0,0'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#EAD4FF",
    requires: new Decimal(1e8), // Can be a function that takes requirement increases into account
    resource: "1,0", // Name of prestige currency
    baseResource: "0,0", // Name of resource prestige is based on
    baseAmount() {return player['0,0'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.125)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone("0,0", 2)) mult = mult.times(tmp['0,0'].milestones[2].effect)
        if (hasUpgrade("1,1", 15)) mult = mult.times(2)
        if (hasUpgrade("1,1", 25)) mult = mult.times(10)
        if (hasMilestone("d", 1)) mult = mult.times(2)
        mult = mult.times(buyableEffect("1,-1", 11))
        if (hasUpgrade("d", 23)) mult = mult.times(upgradeEffect("d", 23))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 201, // Row the layer is in on the tree (0 is the first row)
    displayRow: 100,
    layerShown(){return hasUpgrade('0,1',15)},
    passiveGeneration() {
        if (hasMilestone("d",4)) return 1;
    },
    automate() {
        if (hasMilestone("d", 3)) {
            buyBuyable(this.layer, 11);
            buyBuyable(this.layer, 12);
        }
    },
    effect() {
        return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying 0,0 gain by ' + format(tmp['1,0'].effect)},
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (hasUpgrade('1,1', 22)) keptUpgrades.push(11,12,13,14,15)
    if (hasMilestone('d', 2)) keptUpgrades.push(11,12,13,14,15)
    if (hasMilestone('d', 5)) keptUpgrades.push(21,22,23,24,25)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    // if (someOtherCondition) keep.push("milestones");

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
    },
    tabFormat: {
        "Upgrades": {
            content() {if (hasMilestone("d",7)) return ['main-display','upgrades']
                else return ['main-display','prestige-button','upgrades']
            },
        },
        "Buyables": {
            content() {if (hasMilestone("d",7)) return ['main-display','buyables']
                else return ['main-display','prestige-button','buyables']
            },
            unlocked(){return (hasUpgrade("1,0",15))},
        },
    },
    upgrades: {
        11: {
            title: "1,0,0,0,0",
            description: "0,0,1,0,0 double exponent is lowered to 1.4, unlock a 0,0 milestone, and keep the first 10 0,0 upgrades.",
            cost: new Decimal(2),
        },
        12: {
            title: "1,0,0,0,1",
            description: "Every 1,0 upgrade multiplies point gain by 2.",
            cost: new Decimal(5),
            unlocked(){return (hasUpgrade("1,0",11))},
            effect() {
                let x = new Decimal(2)
                return new Decimal(x).pow(player[this.layer].upgrades.length).pow(buyableEffect('1,0',12))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "1,0,0,0,2",
            description: "Unlock 2 Origin buyables.",
            cost: new Decimal(10),
            unlocked(){return (hasUpgrade("1,0",12))},
        },
        14: {
            title: "1,0,0,0,3",
            description: "The ^0.25 in 0,0,1,0,1 becomes a ^0.4.",
            cost: new Decimal(20),
            unlocked(){return (hasUpgrade("1,0",13))},
        },
        15: {
            title: "1,0,0,0,4",
            description: "Unlock the next layer and 2 buyables.",
            cost: new Decimal(30),
            unlocked(){return (hasUpgrade("1,0",14))},
        },
        21: {
            title: "1,0,0,1,0",
            description: "Time for some Origin-related upgrades! ^1.5 Origin 3 effect, and each second row 1,0 upgrade will unlock an Origin upgrade.",
            cost: new Decimal(1e8),
            unlocked(){return (hasUpgrade("1,1",22))},
        },
        22: {
            title: "1,0,0,1,1",
            description: "Origin 2 also affects 0,1,0,0,3.",
            cost: new Decimal(1e9),
            unlocked(){return (hasUpgrade("1,0",21))},
        },
        23: {
            title: "1,0,0,1,2",
            description: "1,0,1,0,0 also affects Origin gain.",
            cost: new Decimal(1e10),
            unlocked(){return (hasUpgrade("1,0",22))},
        },
        24: {
            title: "1,0,0,1,3",
            description: "1,0,1,0,1 also affects 1,0,1,0,0.",
            cost: new Decimal(1e11),
            unlocked(){return (hasUpgrade("1,0",23))},
        },
        25: {
            title: "1,0,0,1,4",
            description: "You're getting close! Square 0,0,0,0,3 effect and 0,0,0,0,3 also affects Origin gain. (reset coming soon, unlocked at 1e100 origin)",
            cost: new Decimal(1e13),
            unlocked(){return (hasUpgrade("1,0",24))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "1,0,1,0,0",
            display() { return `x2 0,0 gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(2)
                if (hasUpgrade('o',15)) y = new Decimal(2).pow(2)
                if (hasUpgrade('1,0',24)) y = new Decimal(2).pow(2).pow(buyableEffect('1,0',12))
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",15))}
        },
        12: {
            cost(x) { if (hasUpgrade('-1,1',24)) return new Decimal(1).mul(new Decimal(10).pow(x.mul(1.5).pow(2)))
                else return new Decimal(100).mul(new Decimal(10).pow(x.mul(2).pow(2))) },
            title: "1,0,1,0,1",
            display() { return `Exponentiate the 1,0,0,0,1 effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            tooltip: "^(x+0.75) 1,0,0,0,1 effect.",
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(0.75).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("1,1",1))}
        },
    },
})
addLayer("1,1", {
    name: "1,1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1,1", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['0,1','1,0'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#F4D4EA",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "1,1", // Name of prestige currency
    baseResource: "0,0", // Name of resource prestige is based on
    baseAmount() {return player['0,0'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.05)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone("d", 1)) mult = mult.times(2)
        if (hasUpgrade("1,-1", 11)) mult = mult.times(upgradeEffect("1,-1", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 202, // Row the layer is in on the tree (0 is the first row)
    displayRow: 99,
    layerShown(){if (hasUpgrade('1,0',15)|player[this.layer].total.gte(1)) return true},
    passiveGeneration() {
        if (hasMilestone("d",7)) return 1;
    },
    effect() {
        if (hasUpgrade('1,1',22)) return player[this.layer].total.add(1).log2().add(1).pow(4)
        else return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying point and 0,0 gain by ' + format(tmp['1,1'].effect)},
    doReset(resettingLayer) {
    // Stage 1, almost always needed, makes resetting this layer not delete your progress
    if (layers[resettingLayer].row <= this.row) return;

    // Stage 2, track which specific subfeatures you want to keep, e.g. Upgrade 11, Challenge 32, Buyable 12
    let keptUpgrades = []
    if (hasMilestone('d', 3)) keptUpgrades.push(11,12,13,14,15)
    if (hasMilestone('d', 4)) keptUpgrades.push(21,22,23,24,25)

    // Stage 3, track which main features you want to keep - all upgrades, total points, specific toggles, etc.
    let keep = [];
    // if (someOtherCondition) keep.push("milestones");

    // Stage 4, do the actual data reset
    layerDataReset(this.layer, keep);

    // Stage 5, add back in the specific subfeatures you saved earlier
    player[this.layer].upgrades.push(...keptUpgrades)
    },
    tabFormat: {
        "Upgrades": {
            content() {if (hasMilestone("d",7)) return ['main-display','upgrades']
                else return ['main-display','prestige-button','upgrades']
            },
        },
        "Buyables": {
            content() {if (hasMilestone("d",7)) return ['main-display','buyables']
                else return ['main-display','prestige-button','buyables']
            },
            unlocked(){return (hasMilestone("1,1",1))},
        },
        "Milestones": {
            content() {if (hasMilestone("d",7)) return ['main-display','milestones']
                else return ['main-display','prestige-button','milestones']
            },
        },
    },
    upgrades: {
        11: {
            title: "1,1,0,0,0",
            description: "x5 Origin gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "1,1,0,0,1",
            description: "x10 point gain.",
            cost: new Decimal(1),
        },
        13: {
            title: "1,1,0,0,2",
            description: "x5 0,0 gain.",
            cost: new Decimal(1),
        },
        14: {
            title: "1,1,0,0,3",
            description: "x3 0,1 gain.",
            cost: new Decimal(1),
        },
        15: {
            title: "1,1,0,0,4",
            description: "x2 1,0 gain.",
            cost: new Decimal(1),
        },
        21: {
            title: "1,1,0,1,0",
            description: "Every 1,1 upgrade multiplies point and Origin gain by 2, keep the first 5 0,1 upgrades, and unlock more 0,1 upgrades.",
            cost: new Decimal(25),
            unlocked(){return (hasMilestone("1,1",1))},
            effect() {
                let x = new Decimal(2)
                if (hasUpgrade('o',24)) x = new Decimal(2).pow(3)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "1,1,0,1,2",
            description: "Unlock more 1,0 upgrades, and keep the first 5 1,0 upgrades.",
            cost: new Decimal(170),
            unlocked(){return (hasUpgrade("1,1",21))},
        },
        23: {
            title: "1,1,0,1,3",
            description: "Last 3 upgrades until new reset layer! Cube 1,1,1,0,0 effect, and autobuy the first 4 0,0 buyables.",
            cost: new Decimal(45000),
            unlocked(){return (hasUpgrade("1,1",22))},
        },
        24: {
            title: "1,1,0,1,4",
            description: "So close! Cube 0,1,1,0,0 effect, and passively generate 100% of 0,0 per second.",
            cost: new Decimal(110000),
            unlocked(){return (hasUpgrade("1,1",23))},
        },
        25: {
            title: "1,1,0,1,5",
            description: "Unlock a reset, and x10 points, Origin, 0,0, 0,1, and 1,0!",
            cost: new Decimal(350000),
            unlocked(){return (hasUpgrade("1,1",24))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(new Decimal(10).pow(x.pow(2))) },
            title: "1,1,1,0,0",
            display() { return `x10 point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(10)
                if (hasUpgrade('1,1',23)) y = new Decimal(10).pow(3)
                if (hasMilestone('1,1',2)) y = new Decimal(10).pow(3).pow(3)
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("1,1",1))}
        },
    },
    milestones: {
        1: {
            requirementDescription: "Requires: First 5 1,1 Upgrades (1)",
            effectDescription: "Unlock more 0,0 upgrades, unlock 3 buyables, and keep the first 10 0,0 upgrades.",
            done() {if (hasUpgrade('1,1',11) && hasUpgrade('1,1',12) && hasUpgrade('1,1',13) && hasUpgrade('1,1',14) && hasUpgrade('1,1',15)) return true}
        },
        2: {
            requirementDescription: "Requires: 1e17 1,1 (2)",
            effectDescription: "Cube the 1,1,1,0,0 effect.",
            done() {return player[this.layer].points.gte(1e17)},
            unlocked(){return (hasUpgrade("-1,1",22))}
        },
    },
})
addLayer("-1,1", {
    name: "-1,1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "-1,1", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['0,1'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFF4D5",
    requires: new Decimal(1e3), // Can be a function that takes requirement increases into account
    resource: "-1,1", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.05)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        mult = mult.times(tmp['-1,0'].effect)
        if (hasUpgrade('-1,0',14)) mult = mult.times(upgradeEffect('-1,0',14))
        if (hasUpgrade("d", 31)) mult = mult.times(upgradeEffect("d", 31))
        if (hasUpgrade("d", 32)) mult = mult.times(buyableEffect("-1,1", 11).sqrt())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 200, // Row the layer is in on the tree (0 is the first row)
    displayRow: 99,
    layerShown(){if (hasUpgrade('d',11)) return true},
    passiveGeneration() {
        if (hasUpgrade("-1,1",15)) return 1;
    },
    effect() {
        if (hasUpgrade('-1,1',23)) return player[this.layer].total.add(1).log2().add(1).pow(15)
        if (hasUpgrade('-1,1',13)) return player[this.layer].total.add(1).log2().add(1).pow(5)
        else return player[this.layer].total.add(1).log2().add(1)
    },
    effectDescription() { return 'multiplying point gain by ' + format(tmp['-1,1'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked() {return (hasUpgrade("0,1",15))}
        },
    },
    tabFormat: {
        "Upgrades": {
            content() {if (hasUpgrade("-1,0",11)) return ['main-display','upgrades']
                else return ['main-display','prestige-button','upgrades']
            },
        },
        "Buyables": {
            content() {if (hasUpgrade("-1,0",11)) return ['main-display','buyables']
                else return ['main-display','prestige-button','buyables']
            },
            unlocked(){return (hasUpgrade("0,1",15))},
        },
    },
    upgrades: {
        11: {
            title: "-1,1,0,0,0",
            description: "Remove the linear cost exponent part from -1,1,1,0,0's cost.",
            cost: new Decimal(1e5),
        },
        12: {
            title: "-1,1,0,0,1",
            description: "-1,1 effect also boosts 0,1.",
            cost: new Decimal(1e6),
            unlocked(){return (hasUpgrade("-1,1",11))}, 
        },
        13: {
            title: "-1,1,0,0,2",
            description: "-1,1 effect is ^5.",
            cost: new Decimal(1e12),
            unlocked(){return (hasMilestone("d",6))}, 
        },
        14: {
            title: "-1,1,0,0,3",
            description: "Reduce the 0,0,1,1,0 cost double exponent to 2.",
            cost: new Decimal(2.5e12),
            unlocked(){return (hasUpgrade("-1,1",13))}, 
        },
        15: {
            title: "-1,1,0,0,4",
            description: "Each -1,1 upgrade boosts point gain by 100, unlock a -1,1 buyable, and passively generate 100% of -1,1 per second (warning: inflation ahead)",
            cost: new Decimal(1e13),
            unlocked(){return (hasUpgrade("-1,1",14))},
            effect() {
                let x = new Decimal(100)
                return new Decimal(x).pow(player[this.layer].upgrades.length).pow(buyableEffect('-1,1',12))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "-1,1,0,1,0",
            description: "Remove the linear cost exponent part from -1,1,1,0,1's cost.",
            cost: new Decimal(1e18),
            unlocked(){return (hasUpgrade("-1,1",15))}, 
        },
        22: {
            title: "-1,1,0,1,1",
            description: "Remove the base from 0,0,1,0,1, 0,0,1,0,2, and 0,0,1,1,0's cost, and unlock a 1,1 milestone.",
            cost: new Decimal(2.5e24),
            unlocked(){return (hasUpgrade("-1,1",21))}, 
        },
        23: {
            title: "-1,1,0,1,2",
            description: "Cube the -1,1 effect.",
            cost: new Decimal(1e31),
            unlocked(){return (hasUpgrade("-1,1",22))}, 
        },
        24: {
            title: "-1,1,0,1,3",
            description: "(x*2)^2 -> (x*1.5)^2 1,1,1,0,1 cost exponent, and remove the 1,1,1,0,1 cost base.",
            cost: new Decimal(1e38),
            unlocked(){return (hasUpgrade("-1,1",23))}, 
        },
        25: {
            title: "-1,1,0,1,4",
            description: "Unlock the next layer.",
            cost: new Decimal(1e42),
            unlocked(){return (hasUpgrade("-1,1",24))}, 
        },
    },
    buyables: {
        11: {
            cost(x) { if (hasUpgrade("-1,1",11)) return new Decimal(1).mul(new Decimal(1.1).pow(x.pow(2)))
                else return new Decimal(1).mul(new Decimal(2).pow(x)).mul(new Decimal(1.1).pow(x.pow(2))) },
            title: "-1,1,1,0,0",
            display() { return `x2 0,0 gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(2)
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,1",15))}
        },
        12: {
            cost(x) { if (hasUpgrade("-1,0",13)) return new Decimal(1).mul(new Decimal(1.2).pow(x.pow(2)))
                if (hasUpgrade("-1,1",21)) return new Decimal(1e14).mul(new Decimal(1.2).pow(x.pow(2)))
                else return new Decimal(1e14).mul(new Decimal(3).pow(x)).mul(new Decimal(1.2).pow(x.pow(2))) },
            title: "-1,1,1,0,1",
            display() { return `Exponentiate the -1,1,0,0,4 effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("-1,1",15))}
        },
    },
    milestones: {
    },
})
addLayer("1,-1", {
    name: "1,-1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "1,-1", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['1,0'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#D5DFFF",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "1,-1", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.01)
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
    row: 200, // Row the layer is in on the tree (0 is the first row)
    displayRow: 101,
    layerShown(){if (hasUpgrade('d',12)) return true},
    effect() {
        if (hasUpgrade('1,-1',11)) return player[this.layer].total.add(1).log2().add(1).pow(upgradeEffect('1,-1',11))
        else return player[this.layer].total.add(1).log2().add(1)
    },
    effectDescription() { return 'multiplying Origin gain by ' + format(tmp['1,-1'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked() {return (hasUpgrade("1,0",15))}
        },
    },
    upgrades: {
        11: {
            title: "1,-1,0,0,0",
            description: "1,-1,1,0,0 amount boosts 1,1 gain and exponentiates 1,-1 effect at a reduced rate.",
            cost: new Decimal(10),
            tooltip: "x(sqrt(x+1)) 1,1",
            effect() {
                return (getBuyableAmount(this.layer,11)).add(1).sqrt()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "1,-1,0,0,1",
            description: "Remove the linear cost exponent part from 1,-1,1,0,0's cost.",
            cost: new Decimal(1e3),
            unlocked(){return (hasUpgrade("1,-1",11))}, 
        },
    },
    buyables: {
        11: {
            cost(x) { if (hasUpgrade("1,-1",12)) return new Decimal(1).mul(new Decimal(1.1).pow(x.pow(2)))
                else return new Decimal(1).mul(new Decimal(2).pow(x)).mul(new Decimal(1.1).pow(x.pow(2))) },
            title: "1,-1,1,0,0",
            display() { return `x2 1,0 gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(2)
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",15))}
        },
    },
    milestones: {
    },
})
addLayer("-1,0", {
    name: "-1,0", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "-1,0", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ['0,0','-1,1'],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#eaffd4",
    requires: new Decimal(1e45), // Can be a function that takes requirement increases into account
    resource: "-1,0", // Name of prestige currency
    baseResource: "-1,1", // Name of resource prestige is based on
    baseAmount() {return player['-1,1'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.2)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        mult = mult.times(buyableEffect("-1,0", 12))
        if (hasUpgrade("-1,0", 23)) mult = mult.times(upgradeEffect("-1,0", 23))
        if (hasUpgrade("d", 31)) mult = mult.times(upgradeEffect("d", 31))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 199, // Row the layer is in on the tree (0 is the first row)
    displayRow: 100,
    layerShown(){if (hasUpgrade('-1,1',25)) return true},
    passiveGeneration() {
        if (hasUpgrade("-1,0",11)) return 1;
    },
    effect() {
        return player[this.layer].total.add(1).log2().add(1).pow(buyableEffect('-1,0',11))
    },
    effectDescription() { return 'multiplying -1,1 gain by ' + format(tmp['-1,0'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked() {return (hasUpgrade("0,0",15))}
        },
    },
    upgrades: {
        11: {
            title: "-1,0,0,0,0",
            description: "Remove the base from -1,0,1,0,0's cost, and passively generate 100% of -1,0 (disables -1,1 ability to prestige)",
            cost: new Decimal(1e11), 
        },
        12: {
            title: "-1,0,0,0,1",
            description: "Remove the base from -1,0,1,0,1's cost.",
            cost: new Decimal(1e13), 
            unlocked(){return (hasUpgrade("-1,0",11))}, 
        },
        13: {
            title: "-1,0,0,0,2",
            description: "Remove the base from -1,1,1,0,1's cost.",
            cost: new Decimal(1e24), 
            unlocked(){return (hasUpgrade("-1,0",12))}, 
        },
        14: {
            title: "-1,0,0,0,3",
            description: "Every -1,0 upgrade boosts -1,1 gain by 10.",
            cost: new Decimal(1e27), 
            unlocked(){return (hasUpgrade("-1,0",13))}, 
            effect() {
                let x = new Decimal(10)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "-1,0,0,0,4",
            description: "Unlock a -1,0 buyable.",
            cost: new Decimal(1e30), 
            unlocked(){return (hasUpgrade("-1,0",14))}, 
        },
        21: {
            title: "-1,0,0,1,0",
            description: "Remove the linear cost exponent part from -1,0,1,0,0.",
            cost: new Decimal(1e39), 
            unlocked(){return (hasUpgrade("-1,0",15))}, 
        },
        22: {
            title: "-1,0,0,1,1",
            description: "Remove the linear cost exponent part from -1,0,1,0,1.",
            cost: new Decimal(1e54), 
            unlocked(){return (hasUpgrade("-1,0",21))}, 
        },
        23: {
            title: "-1,0,0,1,2",
            description: "Every -1,0 upgrade boosts -1,0 gain by 3.",
            cost: new Decimal(1e66), 
            unlocked(){return (hasUpgrade("-1,0",22))}, 
            effect() {
                let x = new Decimal(3)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        24: {
            title: "-1,0,0,1,3",
            description: "-1,0 effect^2 boosts point gain, and you can buy 2 of -1,0,1,0,0 and -1,0,1,0,1.",
            cost: new Decimal(1e83), 
            unlocked(){return (hasUpgrade("-1,0",23))}, 
            effect() {
                return tmp['-1,0'].effect.pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        25: {
            title: "-1,0,0,1,4",
            description: "Every -1,0,1,0,2 boosts Origin gain by 5.",
            cost: new Decimal(1e95), 
            unlocked(){return (hasUpgrade("-1,0",24))}, 
            effect() {
                let x = new Decimal(5)
                return new Decimal(x).pow(getBuyableAmount('-1,0',13))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
    },
    buyables: {
        11: {
            cost(x) { if (hasUpgrade("-1,0",21)) return new Decimal(1).mul(new Decimal(1.1).pow(x.pow(2)))
                if (hasUpgrade("-1,0",11)) return new Decimal(1).mul(new Decimal(2).pow(x)).mul(new Decimal(1.1).pow(x.pow(2)))
                else return new Decimal(10).mul(new Decimal(2).pow(x)).mul(new Decimal(1.1).pow(x.pow(2))) },
            title: "-1,0,1,0,0",
            display() { return `Exponentiate the -1,0 effect.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                if (hasUpgrade('-1,0',24)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(2))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,0",15))}
        },
        12: {
            cost(x) { if (hasUpgrade("-1,0",22)) return new Decimal(1).mul(new Decimal(1.2).pow(x.pow(2)))
                if (hasUpgrade("-1,0",12)) return new Decimal(1).mul(new Decimal(3).pow(x)).mul(new Decimal(1.2).pow(x.pow(2)))
                else return new Decimal(1e3).mul(new Decimal(3).pow(x)).mul(new Decimal(1.2).pow(x.pow(2))) },
            title: "-1,0,1,0,1",
            display() { return `x3 -1,0 gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(3).add(buyableEffect('-1,0',13))
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                if (hasUpgrade('-1,0',24)) setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(2))
                else setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,0",35))}
        },
        13: {
            cost(x) { return new Decimal(1e14).mul(new Decimal(10).pow(x)).mul(new Decimal(1.5).pow(x.pow(2))) },
            title: "-1,0,1,0,2",
            display() { return `+0.5 -1,0,1,0,1 effect base.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(new Decimal(0.5).add(buyableEffect('-1,0',21)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("-1,1",15))}
        },
        21: {
            cost(x) { return new Decimal(1e30).mul(new Decimal(100).pow(x)).mul(new Decimal(3).pow(x.pow(2))) },
            title: "-1,0,1,1,0",
            display() { return `+0.1 -1,0,1,0,2 effect base.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(0.1)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("-1,0",15))}
        },
    },
    milestones: {
    },
})
addLayer("d", {
    name: "dots", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: ".", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0099FF",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "dots", // Name of prestige currency
    baseResource: "Origin", // Name of resource prestige is based on
    baseAmount() {return player['o'].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base() { // Calculate the multiplier for main currency from bonuses
        let base = new Decimal(1e25)
        return base
    },
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(2)
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
    row: 500, // Row the layer is in on the tree (0 is the first row)
    displayRow: 'side',
    layerShown(){if (hasUpgrade('1,1',25)|player[this.layer].total.gte(1)) return true},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
        },
        "Milestones": {
            content: ['main-display','prestige-button','milestones'],
        },
    },
    upgrades: {
        11: {
            title: "Exploring Quadrant II 1",
            description: "Unlock -1,1. The start will focus on boosting points, 0,0, and 0,1. ",
            cost: new Decimal(1),
        },
        12: {
            title: "Exploring Quadrant IV 1",
            description: "Unlock 1,-1. The start will focus on boosting Origin, 1,0, and 1,1.",
            cost: new Decimal(1),
        },
        21: {
            title: "Dot Boost 1",
            description: "Every dot+1 boosts point gain by 1,000.",
            cost: new Decimal(2),
            branches: [11],
            unlocked() {return hasUpgrade('d',11)},         
            effect() {
                return new Decimal(1e3).pow((player[this.layer].points).add(1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Dot Boost 2",
            description: "Every dot+1 boosts 0,1 gain by 100.",
            cost: new Decimal(2),
            branches: [11],
            unlocked() {return (hasUpgrade('d',11))},         
            effect() {
                return new Decimal(100).pow((player[this.layer].points).add(1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Dot Boost 3",
            description: "Every dot+1 boosts 1,0 gain by 10.",
            cost: new Decimal(2),
            branches: [12],
            unlocked() {return hasUpgrade('d',12)},
            effect() {
                return new Decimal(10).pow((player[this.layer].points).add(1))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        24: {
            title: "Upgrade Boost 1",
            description: "Every dot upgrade boosts Origin gain by 10.",
            cost: new Decimal(2),
            branches: [12],
            unlocked() {return hasUpgrade('d',12)},
            effect() {
                return new Decimal(10).pow((player[this.layer].upgrades.length))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        31: {
            title: "Dot Boost 4",
            description: "Every dot boosts -1,1 and -1,0 gain by 10.",
            cost: new Decimal(3),
            branches: [21,22],
            unlocked() {return hasMilestone('d',6)},
            effect() {
                return new Decimal(10).pow(player[this.layer].points)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        32: {
            title: "Buyable Boost 1",
            description: "-1,1,1,0,0 effect boosts -1,1 gain at a reduced rate.",
            cost: new Decimal(3),
            branches: [23,24],
            unlocked() {return hasMilestone('d',6)},
            tooltip: "xsqrt(-1,1,1,0,0 effect) -1,1 gain",
        },
    },
    buyables: {
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 1 dot (1)",
            effectDescription: "x5 points, 0,0, Origin, and x2 0,1, 1,0, and 1,1. Bulk buy of 0,0,1,0,0 becomes 2, and keep the first 10 0,0 upgrades and the first 5 0,1 upgrades.",
            done() { return player[this.layer].points.gte(1) } 
        },
        2: {
            requirementDescription: "Requires: Both upgrades on the first row (2)",
            effectDescription: "Every dot multiplies Origin gain by 1,000, keep the first 5 1,0 upgrades, and autobuy the first four 0,0 buyables.",
            done() { if (hasUpgrade('d',11) && hasUpgrade('d',12)) return true },
            unlocked(){return (hasMilestone("d",1))},
            effect() {
                return new Decimal(1e3).pow(player[this.layer].points)
            },
        },
        3: {
            requirementDescription: "Requires: Both previous milestone requirements at the same time (3)",
            effectDescription: "Passively generate 100% of 0,0 per second, keep the first 5 1,1 upgrades, and autobuy the first 2 0,1 and 1,0 buyables.",
            done() { if (player[this.layer].points.gte(1) && hasUpgrade('d',11) && hasUpgrade('d',12)) return true },
            unlocked(){return (hasMilestone("d",2))},
        },        
        4: {
            requirementDescription: "Requires: 2 dots (4)",
            effectDescription: "Keep the third row 0,0 upgrades, keep the second row 1,1 upgrades, keep 0,0 milestones, and passively generate 100% of 0,1 and 1,0 per second.",
            done() { if (player[this.layer].points.gte(2)) return true },
            unlocked(){return (hasMilestone("d",3))},
        },
        5: {
            requirementDescription: "Requires: 1 upgrade in the second row and 1 dot (5)",
            effectDescription: "Keep the first and second row Origin upgrades, keep the second row 0,1 upgrades, and keep the second row 1,0 upgrades.",
            done() { if ((hasUpgrade('d',21) | hasUpgrade('d',22) | hasUpgrade('d',23) | hasUpgrade('d',24)) && player[this.layer].points.gte(1)  ) return true },
            unlocked(){return (hasMilestone("d",4))},
        },
        6: {
            requirementDescription: "Requires: All upgrades in the second row (6)",
            effectDescription: "Unlock more -1,1 upgrades.",
            done() { if ((hasUpgrade('d',21) && hasUpgrade('d',22) && hasUpgrade('d',23) && hasUpgrade('d',24))) return true },
            unlocked(){return (hasMilestone("d",5))},
        },
        7: {
            requirementDescription: "Requires: 3 dots (7)",
            effectDescription: "Autobuy the first three Origin buyables, and passively generate 100% of 1,1 per second.",
            done() { if (player[this.layer].points.gte(3)) return true },
            unlocked(){return (hasMilestone("d",6))},
        },
    },
})