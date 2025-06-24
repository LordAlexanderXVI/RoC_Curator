// data/magic.js

// The "export" keyword here is crucial. It makes the variable available to other files.
export const tomeData = {
    "Tome of Embers": {
        name: "Tome of Embers",
        description: "Focuses on the destructive and illuminating power of fire."
    },
    "Tome of Stone's Embrace": {
        name: "Tome of Stone's Embrace",
        description: "Teaches manipulation of earth for defense and control."
    },
    "Tome of Whispering Winds": {
        name: "Tome of Whispering Winds",
        description: "Deals with air, sound, illusion, and subtle influence."
    }
};

// The "export" keyword is also needed for this variable.
export const incantationData = {
    "Candleflame": {
        tome: "Tome of Embers",
        type: "Cantrip",
        cost: 0,
        lockCost: 1,
        duration: "10 minutes + 5 minutes per point of Study",
        description: "You conjure a small, harmless flame that can be held or placed on a surface, providing light equivalent to a candle."
    },
    "Burning Touch": {
        tome: "Tome of Embers",
        type: "Lesser Incantation",
        cost: 2, // PP cost to learn
        baseDice: 1,
        maxDice: 2,
        description: "Flames wreathe your hand. Make a melee spell attack. Deals 2 fire damage per success."
    }
};