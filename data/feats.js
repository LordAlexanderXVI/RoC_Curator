// data/feats.js

export const featData = {
    "HP Boost": {
        tier: 2,
        cost: 2,
        description: "Increase your maximum HP by an amount equal to your higher score of Brawn or Agility.",
        prerequisites: {},
        effects: [{ type: "HP_BOOST" }]
    },
    "Durable": {
        tier: 1,
        cost: 1,
        description: "When you regain Hit Points from resting or another effect that restores HP, you may regain an additional 2 HP per D12 roll.",
        prerequisites: {},
		maxPurchases: 1
    },
    "Fleet Footed": {
        tier: 1,
        cost: 1,
        description: "Your base movement speed increases by 5 feet.",
        prerequisites: {},
		maxPurchases: 1,
        effects: [{ type: "SPEED_MODIFIER", value: 5 }]
    },
    "Alert": {
        tier: 2,
        cost: 2,
        description: "You gain a +1 bonus die to Perception checks made to notice ambushes or hidden threats. You cannot be surprised while conscious.",
        prerequisites: { "Intuition": 4 },
		maxPurchases: 1
	},
	
	"Initiate of the Arcane": {
        tier: 2,
        cost: 2,
        description: "You gain access to one Common Tome of your choice and immediately learn one Cantrip from it.",
        prerequisites: { "Study": 4 },
		maxPurchases: 1,
        effects: [
            { type: "TOME_ACCESS", value: 1 }
        ]
    },
	
    "Attribute Enhancement": {
        tier: 3,
        cost: 4,
        description: "Increase one Attribute score of your choice by 1. This feat can be purchased a maximum of 3 times per character.",
        prerequisites: {},
        maxPurchases: 3
        // Note: The mechanical effect of this would be more complex and is a good future feature.
    },
	
	"Diehard": {
		tier: 3,
		cost: 4,
		description: "When you make a Stabilization Test while in the Weakened state, a roll of 11 or 12 on the D12 counts as two successes.",
		prerequisites: { "Brawn": 5 },
		maxPurchases: 1
}
};