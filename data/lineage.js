// data/lineage.js (New Data-Driven Structure)

export const raceData = {
    Aerie: {
        description: "The Aerie are a graceful and striking people, their forms seemingly sculpted by the very winds that dominate their lofty domains.",
        attributeBonuses: [{ attribute: "Intuition", value: 1 }],
		speed: 30,
        features: [
            {
                name: "Heart of the Storm",
                description: "You have Advantage on all Perception checks that rely on sight and you do not suffer Disadvantage on ranged attack rolls due to long range. All weapons with the range property also count as having the Finesse property.",
                // This 'effect' tells the engine to grant Finesse if the condition is met.
                effects: [
                    { type: "CONDITIONAL_WEAPON_PROPERTY", propertyName: "Finesse", condition: "weapon.variant === 'Range'" }
                ]
            },
           
		   {
				name: "Wind's Grace",
				description: "Your base movement speed increases by 5 feet.",
				effects: [
					{ type: "SPEED_MODIFIER", value: 5 }
				]
			},
			
            { name: "Gifted Sight", description: "You can see clearly in lightly obscured areas (like mist or light foliage) within 60 feet as if they were clear, and dim light doesn't impose Disadvantage on your Perception checks." }
        ]
    },
    Brevi: {
        description: "The Brevi are a sight to behold, possessing large, round bodies that give them an almost spherical appearance, adapted for their humid, subterranean homes.",
		speed:25,
        attributeBonuses: [{ attribute: "Brawn", value: 1 }],
        features: [
            {
                name: "Resilient Form & Hydration",
                description: "Your starting Hit Points increase by 3, and you get an extra 2 HP each time you take the HP Boost feat. You have Advantage on checks to resist dehydration or extreme heat.",
                // This feature now declares its mechanical effects directly.
                effects: [
                    { type: "HP_MODIFIER", value: 3 },
                    { type: "HP_BOOST_MODIFIER", value: 2 }
                ]
            },
            { name: "Powerful Leap", description: "You are always considered to have a running start when calculating jump distance, and your maximum jump distance is doubled." },
            { name: "Subterranean Adaptation", description: "You gain Darkvision, allowing you to see in dim/darkness within 60 feet." }
        ]
    },
	
    Erudite: {
        description: "The Erudites are living conduits of an ancient magical heritage, their physical forms often subtly reflecting potent arcane energies.",
		speed:25,
        attributeBonuses: [{ attribute: "Study", value: 1 }],
		features: [
					{
						name: "Arcane Inheritance",
						description: "Increase your Study attribute by an additional +1. When you spend PP to research an Incantation, the cost is reduced by 1 (min 1).",

						effects: [
							{ type: "ATTRIBUTE_BONUS", attribute: "Study", value: 1 },
							{ type: "INCANTATION_COST_MODIFIER", value: -1, min: 1 } 
						]
					},
					{ 
						name: "Tome Affinity", 
						description: "You begin play with knowledge of one additional Cantrip and access to one Common Tome.",
						
						effects: [
							{ type: "TOME_ACCESS", value: 1 }
						]
					},
					{ name: "Relic Sense", description: "You have Advantage on checks made to decipher ancient writings..." }
				]
	},

	
    Human: {
        description: "Humans are a remarkably diverse and adaptable people, found in nearly every corner of the known world, defined by their ambition and enduring spirit.",
		speed:30,
        attributeBonuses: [], // The +1 is now handled by the feature below.
        features: [
            {
                name: "Versatile Humanity",
                description: "You are versatile and quick to adapt, gaining an additional point to distribute among your core attributes during character creation.",
                // This new effect keyword increases the starting pool of attribute points.
                effects: [
                    { type: "ATTRIBUTE_POINTS_MODIFIER", value: 1 }
                ]
            },
            {
                name: "Adaptable Spirit",
                description: "When you make an attack roll, ability check, or saving throw, you can choose to roll an additional D12 and add it to your pool a number of times per Rest equal to (Luck/2)."
            },
            {
                name: "Quick Learner",
                description: "You gain one additional Proficiency Point at 1st level, and one additional Proficiency Point every 4 levels thereafter.",
                effects: [
                    { type: "PP_MODIFIER", base: 1, interval: 4 }
                ]
            }
        ]
    },
	
};

export const brandData = {
    'Fate-Marked': {
        feature: {
            name: "Destiny's Hand",
            description: "You gain a +1 bonus to your Luck attribute. Additionally, once per rest, you can declare the result of one D12 to be a natural 12.",
            effects: [{ type: "ATTRIBUTE_BONUS", attribute: "Luck", value: 1 }]
        }
    },
    'Primal-Heart': {
        feature: {
            name: "Savage Instinct",
            description: "You gain a +1 bonus to your Brawn attribute. You can enter a primal focus to enhance your Brawn-based attacks and Athletics checks.",
            effects: [{ type: "ATTRIBUTE_BONUS", attribute: "Brawn", value: 1 }]
        }
    },
    'Spirit-Bound': {
        feature: {
            name: "Spirit's Counsel",
            description: "You gain a +1 bonus to your Intuition attribute. You can reroll failed checks or gain Advantage on Insight/Investigation checks.",
            effects: [{ type: "ATTRIBUTE_BONUS", attribute: "Intuition", value: 1 }]
        }
    },
    'Warp-Touched': {
        feature: {
            name: "Unstable Surge",
            description: "You gain a +1 bonus to your Study attribute. You can unleash a surge of wild energy to empower attacks or spells at a risk.",
            effects: [{ type: "ATTRIBUTE_BONUS", attribute: "Study", value: 1 }]
        }
    }
};