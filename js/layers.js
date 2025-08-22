addLayer("d", {
    name: "doors", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🚪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#995522",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "doors", // Name of prestige currency
    baseResource: "studs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(1.2)
        if (player[this.layer].points.gte(50)) {return exponent = new Decimal(1.25)}
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (inChallenge('r',11)) mult = mult.times(0)
        if (inChallenge('r',21)) mult = mult.times(0)
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
    resetsNothing() {if (hasUpgrade('r',11)|hasMilestone('f',1)) {return true}},
    autoPrestige() {return (hasMilestone("r",5))},
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
        14: {
            title: "Doors 4",
            description: "No more crazy inflation, for now. xlog2(doors+1)+1 stud gain.",
            cost: new Decimal(17),
            unlocked(){return (hasUpgrade("c",12))},
            effect() {
                if (hasUpgrade('g',13)) return player[this.layer].points.add(1).log2().add(1).pow(buyableEffect('c', 13)).pow(1.35)
                else return player[this.layer].points.add(1).log2().add(1).pow(buyableEffect('c', 13))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "Doors 5",
            description: "Unlock a new buyable.",
            cost: new Decimal(20),
            unlocked(){return (hasUpgrade("d",14))},
        },
        21: {
            title: "Doors 6",
            description: "Your generic points boost points upgrade. x(log10(studs+1))/2+1 studs.",
            cost: new Decimal(24),
            unlocked(){return (hasUpgrade("d",15))},
            effect() {
                return player.points.add(1).log10().div(2).add(1).pow(buyableEffect('c', 13))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Doors 7",
            description: "x10 stud gain. Cool.",
            cost: new Decimal(26),
            unlocked(){return (hasUpgrade("d",21))},
        },
        23: {
            title: "Doors 8",
            description: "Every upgrade adds .008 to the stud exponent.",
            cost: new Decimal(29),
            unlocked(){return (hasUpgrade("d",22))},
            effect() {
                return new Decimal(1).add(new Decimal(0.008).mul(player[this.layer].upgrades.length))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        24: {
            title: "Doors 9",
            description: "This upgrade does 'nothing'",
            cost: new Decimal(31),
            unlocked(){return (hasUpgrade("d",23))},
        },
        25: {
            title: "Doors 10",
            description: "Unlock the next layer.",
            cost: new Decimal(33),
            unlocked(){return (hasUpgrade("d",24))},
        },
        31: {
            title: "Doors 11",
            description: "This upgrade also does 'nothing'.",
            cost: new Decimal(126),
            unlocked(){return (hasUpgrade("g",15))},
        },
        32: {
            title: "Doors 12",
            description: "Another nothing upgrade. The exponents are enough of a boost.",
            cost: new Decimal(129),
            unlocked(){return (hasUpgrade("d",31))},
        },
        33: {
            title: "Doors 13",
            description: "Another nothing upgrade. Exponents are lowk cooking rn tbh",
            cost: new Decimal(140),
            unlocked(){return (hasUpgrade("d",32))},
        },
        34: {
            title: "Doors 14",
            description: "Ok that flopped. Let's try again...",
            cost: new Decimal(142),
            unlocked(){return (hasUpgrade("d",33))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(7).add(x.pow(2)).floor()},
            title: "Doored Studs",
            display() { return `x4 stud gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(4).add(buyableEffect('c', 12)).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                if (!hasMilestone('r', 3)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("d",12))}
        },
        12: {
            cost(x) { return new Decimal(18).add(x.mul(2)).floor()},
            title: "Doored Studs 2",
            display() { return `x(buyable amount+1)^2 stud gain.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).add(1).pow(new Decimal(2).add(buyableEffect('d', 13)))},
            buy() {
                if (!hasMilestone('r', 3)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("d",15))}
        },
        13: {
            cost(x) { return new Decimal(51).add(x.pow(2)).floor()},
            title: "Doored Studs 3",
            display() { return `Improve the exponent of Doored Studs 2 by +0.5 per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){if (hasChallenge('r', 21)) return getBuyableAmount(this.layer,this.id).mul(0.65)
                else return getBuyableAmount(this.layer,this.id).mul(0.5)},
            buy() {
                if (!hasMilestone('r', 3)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",14))}
        },
        21: {
            cost(x) { return new Decimal(117).add(x.pow(2)).floor()},
            title: "Doored Gold 1",
            display() { return `x2 gold.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + 'x' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(2).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                if (!hasMilestone('r', 3)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("f",1))}
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
    color: "#AA0022",
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
        if (inChallenge('r',12)) mult = mult.times(0)
        if (inChallenge('r',21)) mult = mult.times(0)
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
        {key: "c", description: "C: Reset for closets", onPress(){if (canReset(this.layer)) doReset(this.layer)}, unlocked() {return !hasMilestone('r', 7)}},
    ],
    layerShown(){if (hasUpgrade('d',13)|inChallenge('r',11)) {return true}},
    resetsNothing() {if (hasUpgrade('r',15)|hasMilestone('f',1)) {return true}},
    autoPrestige() {return (hasMilestone("r",6))},
    canBuyMax() {return (hasMilestone('r', 7))},
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
            unlocked(){return (hasUpgrade("c",11))},
            effect() {
                return player[this.layer].points.add(2).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Closets 3",
            description: "x3 stud gain for every closet upgrade",
            cost: new Decimal(40),
            unlocked(){return (hasMilestone("r",3))},
            effect() {
                return new Decimal(3).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Closets 4",
            description: "x1.5 rush gain for every closet upgrade",
            cost: new Decimal(44),
            unlocked(){return (hasUpgrade("c",13))},
            effect() {
                return new Decimal(1.5).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "Closets 5",
            description: "Unlock some rush upgrades.",
            cost: new Decimal(55),
            unlocked(){return (hasUpgrade("c",14))},
        },
        21: {
            title: "Closets 6",
            description: "One short of 100. Anyway, +.005 to the stud exponent per closet upgrade.",
            cost: new Decimal(99),
            unlocked(){return (hasUpgrade("r",15))},
            effect() {
                return new Decimal(1).add(new Decimal(0.005).mul(player[this.layer].upgrades.length))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Closets 7",
            description: "Unlock a rush challenge.",
            cost: new Decimal(103),
            unlocked(){return (hasUpgrade("c",21))},
        },
        23: {
            title: "Closets 8",
            description: "Unlock another rush challenge.",
            cost: new Decimal(112),
            unlocked(){return (hasUpgrade("c",22))},
        },
        24: {
            title: "Closets 9",
            description: "Unlock yet another rush challenge.",
            cost: new Decimal(131),
            unlocked(){return (hasUpgrade("c",23))},
        },
        25: {
            title: "Closets 10",
            description: "Unlock the final rush challenge.",
            cost: new Decimal(137),
            unlocked(){return (hasUpgrade("c",24))},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(65).add(x.pow(3)).floor()},
            title: "Closeted Studs",
            display() { return `x10 stud gain per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + format(this.effect()) + 'x'},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(10).mul(buyableEffect('r',12)).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                if (!hasMilestone('g', 2)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",13))}
        },
        12: {
            cost(x) { return new Decimal(70).add((x.pow(2)).mul(10)).floor()},
            title: "Closeted Studs 2",
            display() { return `Improve the base of Doored Studs by +2 per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(2)},
            buy() {
                if (!hasMilestone('g', 2)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",14))}
        },
        13: {
            cost(x) { return new Decimal(85).add((x.pow(2)).mul(10)).floor()},
            title: "Closeted Studs 3",
            display() { return `Exponentiate Doors 4 and Doors 6 by +^0.5 per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(0.5).add(1)},
            buy() {
                if (!hasMilestone('g', 2)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",15))}
        },
        21: {
            cost(x) { return new Decimal(226).add((x.tetrate(2))).floor()},
            title: "Closeted Gold 1",
            display() { return `^1.05 gold.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(1.05).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                if (!hasMilestone('g', 2)) {player[this.layer].points = player[this.layer].points.sub(this.cost())}
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("f",1))}
        },
    },
})
addLayer("r", {
    name: "rush", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#555555",
    branches: ["d", "c"],
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "rushes", // Name of prestige currency
    baseResource: "studs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.2)
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('c', 14)) mult = mult.times(upgradeEffect('c', 14))
        mult = mult.times(tmp['g'].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rushes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasUpgrade ("d", 25)) {return true}
        if (hasMilestone ("r", 1)) {return true}},
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
        "Challenges": {
            content: ['main-display','prestige-button','challenges'],
        },
    },
    upgrades: {
        11: {
            title: "Rush 1",
            description: "Epic 'starter pack'! x5 and ^1.02 stud gain! Also, doors now reset nothing! (warning: door exponent becomes 1.25 at 50 doors)",
            cost: new Decimal(1000), 
            unlocked(){if (hasUpgrade ("c", 15)) {return true}
        if (hasUpgrade ("r", 11)) {return true}},
        },
        12: {
            title: "Rush 2",
            description: "Every rush upgrade multiplies stud gain by 5.",
            cost: new Decimal(5000), 
            unlocked(){return hasUpgrade ("r", 11)},
            effect() {
                return new Decimal(5).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Rush 3",
            description: "It's about time. Unlock a closet buyable.",
            cost: new Decimal(10000), 
            unlocked(){return hasUpgrade ("r", 12)},
        },
        14: {
            title: "Rush 4",
            description: "Unlock another closet buyable and a door buyable.",
            cost: new Decimal(40000), 
            unlocked(){return hasUpgrade ("r", 13)},
        },
        15: {
            title: "Rush 5",
            description: "Unlock the third and final closet buyable, at least for now, and unlock more closet upgrades. Oh, and as an additional reward, closets reset nothing.",
            cost: new Decimal(1e6), 
            unlocked(){return hasUpgrade ("r", 14)},
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(5e13).mul(x.add(1).tetrate(3))},
            title: "Rushed Studs 1",
            display() { return `^1.02 studs. Good upgrade, but with insane cost scaling.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '^' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(1.02).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("r",5))}
        },
        12: {
            cost(x) { return new Decimal(1e16).mul(x.add(1).tetrate(2.5))},
            title: "Rushed Studs 2",
            display() { return `Double the base of Closeted Studs per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + 'x' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(2).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("r",6))}
        },
        13: {
            cost(x) { return new Decimal(2e20).mul(x.add(1).tetrate(2))},
            title: "Rushed Studs 3",
            display() { return `x5 studs.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + 'x' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return new Decimal(5).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasMilestone("r",7))}
        },
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 1 rush",
            effectDescription: "x5 studs, and every milestone multiplies stud gain by 2, so x10 studs in total. (For now)",
            done() { return player[this.layer].points.gte(1) },
            effect() {
                return new Decimal(2).pow(player[this.layer].milestones.length)
            },
        },
        2: {
            requirementDescription: "Requires: 2 rush",
            effectDescription: `x(log2(rush+1)+1)^2 stud gain. Simple enough.`,
            done() { return player[this.layer].points.gte(2) },
            unlocked(){return (hasMilestone("r",1))},
            effect() {if (hasChallenge('r', 12)) return player[this.layer].points.add(1).log2().add(1).pow(3)
                else return player[this.layer].points.add(1).log2().add(1).pow(2)
            },
        },
        3: {
            requirementDescription: "Requires: 10 rush",
            effectDescription: "Door buyables spend nothing, and unlock more closet upgrades.",
            done() { return player[this.layer].points.gte(10) },
            unlocked(){return (hasMilestone("r",2))},
        },
        4: {
            requirementDescription: "Requires: 100 rush",
            effectDescription: "Adds .01 to the stud exponent per milestone.",
            done() { return player[this.layer].points.gte(100) },
            unlocked(){return (hasMilestone("r",3))},
            effect() {
                return new Decimal(1).add(new Decimal(0.01).mul(player[this.layer].milestones.length))
            },
        },
        5: {
            requirementDescription: "Requires: 5e13 rush",
            effectDescription: "Unlock a Rush buyable, and autobuy doors.",
            done() { return player[this.layer].points.gte(5e13) },
            unlocked(){return (hasMilestone("g",3))},
        },
        6: {
            requirementDescription: "Requires: 1e16 rush",
            effectDescription: "Unlock a Rush buyable, and autobuy closets. (WARNING: RESET LAYER INCOMING)",
            done() { return player[this.layer].points.gte(1e16) },
            unlocked(){return (hasMilestone("r",5))},
        },
        7: {
            requirementDescription: "Requires: 2e20 rush",
            effectDescription: "Unlock a Rush buyable, and buy max closets. (removes closet hotkey)",
            done() { return player[this.layer].points.gte(2e20) },
            unlocked(){return (hasMilestone("r",6))},
        },
    },
    challenges: {
        11: {
            name: "Trapped",
            challengeDescription: "You can't get doors. (you still have the closets layer)",
            goalDescription: "1e14 studs",
            rewardDescription: "^1.025 stud gain.",
            canComplete() {return player.points.gte(1e14)},
            unlocked(){if (hasUpgrade("c",22)|inChallenge('r',11)|hasChallenge('r',11)) {return true}},
        },
        12: {
            name: "Hide under beds",
            challengeDescription: "You can't get closets.",
            goalDescription: "1e18 studs",
            rewardDescription: "Rush Milestone 2 exponent is x1.5, and ^1.025 stud gain.",
            canComplete() {return player.points.gte(1e18)},
            unlocked(){if (hasUpgrade("c",23)|inChallenge('r',12)|hasChallenge('r',12)) {return true}},
        },
        21: {
            name: "No escape",
            challengeDescription: "You can't get doors or closets.",
            goalDescription: "1e13 studs",
            rewardDescription: "Doored Studs 3 is 30% stronger.",
            canComplete() {return player.points.gte(1e13)},
            unlocked(){if (hasUpgrade("c",24)|inChallenge('r',21)|hasChallenge('r',21)) {return true}},
        },
        22: {
            name: "nostalgia, they said",
            challengeDescription: "^0.2 stud gain.",
            goalDescription: "1e5 studs",
            rewardDescription: "Unlock the next layer and ^1.03 stud gain.",
            canComplete() {return player.points.gte(1e5)},
            unlocked(){if (hasUpgrade("c",25)|inChallenge('r',22)|hasChallenge('r',22)) {return true}},
        },
    },
})
addLayer("g", {
    name: "gold", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff0",
    branches: ["d", "c"],
    requires: new Decimal(1e75), // Can be a function that takes requirement increases into account
    resource: "gold", // Name of prestige currency
    baseResource: "studs", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(0.05)
        exponent = exponent.times(buyableEffect('c', 21))
        return exponent
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        mult = mult.times(buyableEffect('d', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    directMult() { // Calculate the direct mult after softcap
        let dmult = new Decimal(1)
        return dmult
    },
    effect() {
        return player[this.layer].points.add(1).log2().add(1)
    },
    effectDescription() { return 'multiplying rush gain by ' + format(tmp['g'].effect)},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for gold", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasChallenge ("r", 22)) {return true}},
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
        "Challenges": {
            content: ['main-display','prestige-button','challenges'],
        },
    },
    upgrades: {
        11: {
            title: "Gold 1",
            description: "Time for some stud boosts. x(log2(gold+1)+1) stud gain.",
            cost: new Decimal(200), 
            unlocked(){return hasMilestone ("f", 1)},
            effect() {
                return player[this.layer].points.add(1).log2().add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        12: {
            title: "Gold 2",
            description: "x(log10(rush+1)+1)^0.8 stud gain.",
            cost: new Decimal(500), 
            unlocked(){return hasUpgrade ("g", 11)},
            effect() {
                return player['r'].points.add(1).log10().add(1).pow(0.8)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Gold 3",
            description: "^1.35 Doors 4 effect.",
            cost: new Decimal(1500), 
            unlocked(){return hasUpgrade ("g", 12)},
        },
        14: {
            title: "Gold 4",
            description: "Every gold upgrade multiplies stud gain by 2.",
            cost: new Decimal(3000), 
            unlocked(){return hasUpgrade ("g", 13)},
            effect() {
                return new Decimal(2).pow(player[this.layer].upgrades.length)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        15: {
            title: "Gold 5",
            description: "+^.001 stud gain per gold upgrade, and unlock more door upgrades.",
            cost: new Decimal(5000), 
            unlocked(){return hasUpgrade ("g", 14)},
            effect() {
                return new Decimal(1).add(new Decimal(0.001).mul(player[this.layer].upgrades.length))
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
        },
    },
    buyables: {
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 1 gold",
            effectDescription: "x10 studs. (gold milestone 1 is not useless anymore)",
            done() { return player[this.layer].points.gte(1) },
        },
        2: {
            requirementDescription: "Requires: 2 gold",
            effectDescription: "x10 studs, and closet buyables no longer take away closets.",
            done() { return player[this.layer].points.gte(2) },
            unlocked(){return (hasMilestone("g",1))},
        },
        3: {
            requirementDescription: "Requires: 3 gold",
            effectDescription: "x10 studs, and unlock more Rush milestones.",
            done() { return player[this.layer].points.gte(3) },
            unlocked(){return (hasMilestone("g",2))},
        },
    },
    challenges: {
    },
})
addLayer("f", {
    name: "floors", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🚪🚪", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#999999",
    branches: ["d"],
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "floors", // Name of prestige currency
    baseResource: "doors", // Name of resource prestige is based on
    baseAmount() {return player['d'].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Calculate the multiplier for main currency from bonuses
        let exponent = new Decimal(1)
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
    effect() {
        return player[this.layer].points.add(1).pow(10)
    },
    effectDescription() { return 'multiplying stud gain by ' + format(tmp['f'].effect)},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for floors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasMilestone ("r", 6)|hasMilestone ("f", 1)) {return true}},
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
        "Challenges": {
            content: ['main-display','prestige-button','challenges'],
        },
    },
    upgrades: {
    },
    buyables: {
    },
    milestones: {
        1: {
            requirementDescription: "Requires: 1 floor",
            effectDescription: "Unlock 1 door and closet buyable per floor milestone, and unlock some gold upgrades. (oh and doors/closets still reset nothing)",
            done() { return player[this.layer].points.gte(1) },
        },
    },
    challenges: {
    },
})