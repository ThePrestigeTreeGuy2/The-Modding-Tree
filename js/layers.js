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
        mult = mult.times(buyableEffect("o", 11))
        if (hasUpgrade("0,1", 13)) mult = mult.times(upgradeEffect("0,1", 13))
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
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Origin II",
            description: "Origin boosts point gain.",
            cost: new Decimal(5e3),
            tooltip: "x(log10(x+1)+1) point gain.",
            effect() {
                return player[this.layer].points.add(1).log10().add(1).pow(buyableEffect('o',12))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
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
            tooltip: "xlog10(x+1)+1) Origin gain",
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
        mult = mult.times(tmp['1,1'].effect)
        mult = mult.times(buyableEffect('1,0', 11))
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
    displayRow: 100,
    layerShown(){return true},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked(){return (hasUpgrade("0,0",15))},
        },
        "Milestones": {
            content: ['main-display','prestige-button','milestones'],
            unlocked(){return (hasUpgrade("0,1",11))},
        },
    },
    upgrades: {
        11: {
            title: "0,0,0,0,0",
            description: "x2 points.",
            cost: new Decimal(1),
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
                return new Decimal(1.075).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        25: {
            title: "0,0,0,1,4",
            description: "Unlock the next layer.",
            cost: new Decimal(5000),
            unlocked(){return (hasUpgrade("0,0",24))},
        },
    },
    buyables: {
        11: {
            cost(x) { if (hasUpgrade('1,0',11)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.4)))
                else if (hasUpgrade('0,1',11)) return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(1.6)))
                else return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,0,1,0,0",
            display() { return `x1.5 point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                let y = new Decimal(1.5)
                if (hasUpgrade('0,0', 22)) y = new Decimal(1.5).pow(1.75)
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("0,0",15))}
        },
        12: {
            cost(x) { return new Decimal(100000000).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,0,1,0,1",
            display() { return `Points boost point gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
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
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 100,000 0,0",
            effectDescription: "Unlock Origin.",
            done() { return player[this.layer].points.gte(1e5) }
        },
        2: {
            requirementDescription: "Requires: 1e10 0,0",
            effectDescription: "0,0 multiplies 1,0 gain.",
            done() { return player[this.layer].points.gte(1e10) },
            unlocked(){return (hasUpgrade("1,0",11))},
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
    layerShown(){if (hasUpgrade('0,0',25)|player[this.layer].total.gte(1)) return true},
    effect() {
        return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying 0,0 gain by ' + format(tmp['0,1'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
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
                return player[this.layer].total.add(1).log2().add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "0,1,0,0,2",
            description: "Total 0,1 boosts Origin gain.",
            cost: new Decimal(10),
            tooltip: "x(log2(x+1)+1)^2 Origin gain",
            unlocked(){return (hasUpgrade("0,1",12))},
            effect() {
                return player[this.layer].total.add(1).log2().add(1).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "0,1,0,0,3",
            description: "Points boost themselves.",
            cost: new Decimal(15),
            tooltip: "x(log10(x+1)+1)^0.5 points gain",
            unlocked(){return (hasUpgrade("0,1",13))},
            effect() {
                return player.points.add(1).log10().add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "0,1,0,0,4",
            description: "Unlock the next layer, a 0,0 buyable, and a 0,1 buyable.",
            cost: new Decimal(30),
            unlocked(){return (hasUpgrade("0,1",14))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x.add(1).pow(x.add(1).pow(2))) },
            title: "0,1,1,0,0",
            display() { return `x2 point gain.
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
    layerShown(){return hasUpgrade('0,1',15)},
    effect() {
        return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying 0,0 gain by ' + format(tmp['1,0'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked(){return (hasUpgrade("1,0",15))},
        },
    },
    upgrades: {
        11: {
            title: "1,0,0,0,0",
            description: "0,0,1,0,0 double exponent is lowered to 1.4, and unlock a 0,0 milestone.",
            cost: new Decimal(2),
        },
        12: {
            title: "1,0,0,0,1",
            description: "Every 1,0 upgrade multiplies point gain by 2.",
            cost: new Decimal(5),
            unlocked(){return (hasUpgrade("1,0",11))},
            effect() {
                let x = new Decimal(2)
                return new Decimal(x).pow(player[this.layer].upgrades.length)
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
            description: "Unlock the next layer and a buyable.",
            cost: new Decimal(30),
            unlocked(){return (hasUpgrade("1,0",14))},
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
                return new Decimal(y).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("1,0",15))}
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
    effect() {
        return player[this.layer].total.add(1).log2().add(1).pow(2)
    },
    effectDescription() { return 'multiplying point and 0,0 gain by ' + format(tmp['1,1'].effect)},
    tabFormat: {
        "Upgrades": {
            content: ['main-display','prestige-button','upgrades'],
        },
        "Buyables": {
            content: ['main-display','prestige-button','buyables'],
            unlocked(){return (hasUpgrade("1,1",15))},
        },
    },
    upgrades: {
    },
    buyables: {
    },
})