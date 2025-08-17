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
    resetsNothing() {return hasUpgrade('r', 11)},
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
                return player[this.layer].points.add(1).log2().add(1).pow(new Decimal(1).add(buyableEffect('c', 13)))
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
                return player.points.add(1).log10().div(2).add(1).pow(new Decimal(1).add(buyableEffect('c', 13)))
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
        {key: "c", description: "C: Reset for closets", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){if (hasUpgrade('d',13)|inChallenge('r',11)) {return true}},
    resetsNothing() {return hasUpgrade('r', 15)},
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
                return new Decimal(10).pow(getBuyableAmount(this.layer,this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
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
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",14))}
        },
        13: {
            cost(x) { return new Decimal(85).add((x.pow(2)).mul(10)).floor()},
            title: "Closeted Studs 3",
            display() { return `Exponentiate Doors 4 and Doors 6 by +0.5 per level.
            <b>Cost:</b>` + format(this.cost()) + `
            <b>Amount:</b>` + format(getBuyableAmount(this.layer,this.id)) +`
            <b>Effect:</b>` + '+' + format(this.effect())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(){
                return getBuyableAmount(this.layer,this.id).mul(0.5)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return (hasUpgrade("r",15))}
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
    color: "#333333",
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
    },
    challenges: {
        11: {
            name: "Trapped",
            challengeDescription: "You can't get doors. (you still have the closets layer)",
            goalDescription: "1e14 studs",
            rewardDescription: "x1.025 stud exponent.",
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
            rewardDescription: "Unlock the next layer (unreleased) and ^1.03 stud gain.",
            canComplete() {return player.points.gte(1e5)},
            unlocked(){if (hasUpgrade("c",25)|inChallenge('r',22)|hasChallenge('r',22)) {return true}},
        },
    },
})