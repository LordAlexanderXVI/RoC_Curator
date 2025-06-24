// data/weapons.js

// Master list of all possible weapon properties
export const weaponProperties = {
    "Finesse": { name: "Finesse", desc: "You may use your Agility attribute instead of Brawn for Attack and Parry actions made with this weapon." },
    "Quick Strike": { name: "Quick Strike", desc: "You can draw or stow this weapon as part of the same action used to Attack or Parry with it." },
    "Precise(LA)": { name: "Precise(LA)", desc: "As a Limited Action, make a Perception roll to gain +1 success on your next attack roll for each success you achieve." },
    "Thrown": { name: "Thrown", desc: "You can make ranged attacks with this weapon (range 20/40). Uses the same attribute as melee attacks.", type: "Melee Only" },
    "Versatile": { name: "Versatile", desc: "If you wield this weapon with two hands, you increase its Damage per success by 1." },
    "Reach": { name: "Reach", desc: "This property doubles your melee attack range to 10 feet.", type: "Melee Only" },
    "Riposte": { name: "Riposte", desc: "If you successfully Parry an attack (reduce successes to 0), you may spend 1 die to make an immediate counter-attack." },
    "Defensive": { name: "Defensive", desc: "You gain +1 success on Parry rolls made with this weapon." },
    "Impact": { name: "Impact", desc: "Targets hit must make a Brawn check or be knocked back 5 feet per success you achieved." },
    "Broad": { name: "Broad", desc: "You can target all creatures in a 5-foot cone, splitting your successes among them." },
    "Momentum": { name: "Momentum", desc: "If you moved at least 10 feet towards a target before attacking, you gain +1 success on that roll.", type: "Melee Only" },
    "Brutal": { name: "Brutal", desc: "When you roll a natural 12 on an attack die, it counts as 2 successes instead of 1 (the extra success does not explode)." }
};

// Weapon categories now reference the master list by name
export const weaponData = {
    Light: {
        description: "Light weapons are characterized by their ease of handling and speed.",
        brawnRequirement: 0,
        upgradePoints: 2,
        properties: ["Finesse", "Quick Strike", "Precise(LA)", "Thrown"]
    },
    Medium: {
        description: "Medium weapons strike a balance between offense and defense. Requires Brawn 3.",
        brawnRequirement: 3,
        upgradePoints: 4,
        properties: ["Versatile", "Reach", "Riposte", "Defensive"]
    },
    Heavy: {
        description: "Heavy weapons are designed for maximum impact and raw power. Requires Brawn 6.",
        brawnRequirement: 6,
        upgradePoints: 6,
        properties: ["Impact", "Broad", "Momentum", "Brutal"]
    }
};