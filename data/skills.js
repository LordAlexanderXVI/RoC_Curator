// data/skills.js (Version 4.1)

export const skillData = {
    "Acrobatics": { 
        defaultAttribute: "Agility", 
        description: "Measures your ability to perform feats requiring balance, speed, and coordination, like balancing on narrow ledges or tumbling past foes." 
    },
    "Athletics": { 
        defaultAttribute: "Brawn", 
        description: "Represents raw physical power for activities like climbing, swimming against strong currents, jumping, or breaking down doors." 
    },
    "Crafting": { 
        defaultAttribute: "Study", 
        description: "Reflects talent in creating, mending, or modifying items, such as forging weapons, brewing potions, or constructing devices." 
    },
    "Deception": { 
        defaultAttribute: "Intuition", 
        flexibleWith: ["Study"], 
        description: "Your ability to mislead others through convincing falsehoods, clever misdirection, or subtle manipulation." 
    },
    "Insight": { 
        defaultAttribute: "Intuition", 
        description: "Governs your capacity to read situations, discern truth from falsehoods, and understand the underlying intentions of others." 
    },
    "Investigation": { 
        defaultAttribute: "Intuition", 
        description: "The skill of actively searching for clues, meticulously examining evidence, and making logical deductions to solve mysteries." 
    },
    "Lore": { 
        defaultAttribute: "Study", 
        description: "Represents accumulated knowledge concerning history, arcane secrets, geography, cultural practices, and creatures." 
    },
    "Medicine": { 
        defaultAttribute: "Study", 
        flexibleWith: ["Intuition"], 
        description: "Measures your ability to treat wounds, diagnose illnesses or poisons, and provide care to the injured." 
    },
    "Perception": { 
        defaultAttribute: "Intuition", 
        description: "Your general awareness and ability to notice details in your surroundings using all your senses." 
    },
    "Performance": { 
        defaultAttribute: "Intuition", 
        flexibleWith: ["Agility"], 
        description: "Reflects talent in captivating, entertaining, or inspiring an audience through acting, music, oratory, dance, or storytelling." 
    },
    "Persuasion": { 
        defaultAttribute: "Intuition", 
        flexibleWith: ["Study", "Brawn"], 
        description: "Your skill in influencing others through reasoned arguments, intimidation, or heartfelt appeals." 
    },
    "Sleight of Hand": { 
        defaultAttribute: "Agility", 
        description: "Measures manual dexterity for subtle tasks requiring quick movements, like pickpocketing or manipulating locks." 
    },
    "Stealth": { 
        defaultAttribute: "Agility", 
        description: "Governs your ability to move without being seen or heard, essential for ambush, infiltration, or evasion." 
    },
    "Survival": { 
        defaultAttribute: "Intuition", 
        flexibleWith: ["Study"], 
        description: "Represents skill in navigating the natural world, tracking prey, foraging for food, and predicting weather." 
    }
};

// Tiered cost for buying skill ranks
export const skillRankCost = [1, 2, 4, 7, 11]; // Cost for Rank 1, 2, 3, 4, 5