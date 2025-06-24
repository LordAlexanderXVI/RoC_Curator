// script.js (Version 4.2 - Magic System Integration)

// --- IMPORTS ---
import { raceData, brandData } from './data/lineage.js';
import { weaponData, weaponProperties } from './data/weapons.js';
import { skillData, skillRankCost } from './data/skills.js';
import { featData } from './data/feats.js';
import { tomeData, incantationData } from './data/magic.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    const state = {
        level: 1,
        pointsRemaining: 10,
        characterName: '',
        selectedRace: null,
        selectedBrand: null,
        attributes: { Brawn: { points: 0 }, Agility: { points: 0 }, Study: { points: 0 }, Intuition: { points: 0 }, Luck: { points: 0 } },
        weapon: null,
        skills: {},
        feats: {},
        ppSpent: 0,
        tomeAccessCount: 0,
        knownTomes: [],
        knownIncantations: []
    };

    // --- DOM ELEMENTS ---
    const dom = {
        levelInputEl: document.getElementById('level-input'),
        pointsRemainingEl: document.getElementById('points-remaining'),
        attributeTableEl: document.querySelector('.attribute-table'),
        summaryNameEl: document.getElementById('summary-name'),
        summaryRaceEl: document.getElementById('summary-race'),
        summaryHpEl: document.getElementById('summary-hp'),
        summaryDicePoolEl: document.getElementById('summary-dicepool'),
        summaryAttributesEl: document.getElementById('summary-attributes'),
        summaryTraitsEl: document.getElementById('summary-traits'),
        summaryFeatsEl: document.getElementById('summary-feats'),
        summaryWeaponEl: document.getElementById('summary-weapon'),
        summarySpeedEl: document.getElementById('summary-speed'),
        characterNameInput: document.getElementById('characterName'),
        raceSelectEl: document.getElementById('race-select'),
        brandRadiosContainer: document.getElementById('brand-radios'),
        raceDescriptionBox: document.getElementById('race-description-box'),
        brandDescriptionBox: document.getElementById('brand-description-box'),
        viewSwitcherEl: document.getElementById('view-switcher'),
        viewPanels: document.querySelectorAll('.view-panel'),
        weaponCategorySelectEl: document.getElementById('weapon-category-select'),
        weaponCustomizationPanel: document.getElementById('weapon-customization-panel'),
        weaponVariantSelectorEl: document.getElementById('weapon-variant-selector'),
        skillsList: document.getElementById('skills-list'),
        featsList: document.getElementById('feats-list'),
        ppTracker: document.getElementById('pp-tracker'),
        ppInput: document.getElementById('pp-input'),
        magicViewButton: document.querySelector('[data-view="magic-view"]'),
        magicViewPanel: document.getElementById('magic-view'),
        tomeSelectionBox: document.getElementById('tome-selection-box'),
        tomeRadios: document.getElementById('tome-radios'),
        incantationsListSection: document.getElementById('incantations-list-section'),
        incantationsList: document.getElementById('incantations-list'),
        summaryMagicEl: document.getElementById('summary-magic'),
    };

    // --- HELPER FUNCTIONS ---

    /**
     * Calculates the final score of a single attribute.
     */
    function getFinalAttributeScore(attributeName) {
        let totalBonus = 0;
        if (state.selectedRace && raceData[state.selectedRace].attributeBonuses) {
            raceData[state.selectedRace].attributeBonuses.forEach(b => {
                if (b.attribute === attributeName) totalBonus += b.value;
            });
        }
        getEffects('ATTRIBUTE_BONUS').forEach(effect => {
            if (effect.attribute === attributeName) totalBonus += effect.value;
        });
        const pointsAdded = state.attributes[attributeName].points;
        return Math.min(1 + pointsAdded + totalBonus, 10);
    }

    /**
     * Calculates the total Proficiency Points (PP) a character has.
     */
    function calculateTotalPp() {
        const startingPP = 5; // 
        const study = getFinalAttributeScore('Study');
        let ppFromLevels = 0;
        if (state.level > 1) {
            ppFromLevels = (state.level - 1) * (2 + Math.floor(study / 4)); // 
        }
        let bonusPP = 0;
        getEffects('PP_MODIFIER').forEach(effect => {
            bonusPP += effect.base; // 
            if (effect.interval > 0) {
                bonusPP += Math.floor(state.level / effect.interval); // 
            }
        });
        return startingPP + ppFromLevels + bonusPP;
    }

    /**
     * Gathers all features from the character's race and brand.
     */
    function getCharacterFeatures() {
        if (!state.selectedRace) return [];
        const baseRace = raceData[state.selectedRace];
        let features = [...(baseRace.features || [])];
        if (state.selectedBrand) {
            const definingFeatureName = baseRace.features[0].name;
            features = features.filter(f => f.name !== definingFeatureName); // 
            features.push(brandData[state.selectedBrand].feature); // 
        }
        return features;
    }

    /**
     * Retrieves all mechanical effects of a specific type from features and feats.
     */
    function getEffects(effectType) {
        const features = getCharacterFeatures();
        let allEffects = features.flatMap(f => f.effects || []);
        for (const featName in state.feats) {
            if (featData[featName] && featData[featName].effects) {
                const count = state.feats[featName];
                for (let i = 0; i < count; i++) {
                    allEffects.push(...featData[featName].effects);
                }
            }
        }
        return allEffects.filter(e => e.type === effectType);
    }

    /**
     * Calculates the total number of Tomes a character should have access to.
     */
	function calculateTomeAccess() {
		let count = 0;
		getEffects('TOME_ACCESS').forEach(effect => {
			count += effect.value;
		});
		state.tomeAccessCount = count;
	}

    // --- RENDER FUNCTIONS ---

    /**
     * The master render function, calls all other render functions.
     */
    function render() {
        state.characterName = dom.characterNameInput.value;
        state.level = parseInt(dom.levelInputEl.value) || 1;

        // Control visibility of the magic tab based on tome access
        if (state.tomeAccessCount > 0) {
            dom.magicViewButton.style.display = 'inline-block';
        } else {
            dom.magicViewButton.style.display = 'none';
            if (dom.magicViewPanel.style.display === 'block') {
                dom.viewSwitcherEl.querySelector('[data-view="attributes-view"]').click();
            }
        }

        renderAttributes();
        renderDerivedStats();
        renderTraits();
        renderWeaponSummary();
        renderWeaponCreator();
        renderSkillsPanel();
        renderFeatsPanel();
        renderSummaryFeats();
        renderMagicPanel();
        renderSummaryMagic();
    }

    /** Redraws the attribute table and summary. */
    function renderAttributes() {
        const basePoints = 10;
        let bonusPoints = 0;
        getEffects('ATTRIBUTE_POINTS_MODIFIER').forEach(effect => {
            bonusPoints += effect.value;
        });
        const totalPoints = basePoints + bonusPoints;
        const pointsSpent = Object.values(state.attributes).reduce((sum, attr) => sum + attr.points, 0);
        state.pointsRemaining = totalPoints - pointsSpent;
        dom.pointsRemainingEl.textContent = state.pointsRemaining;
        dom.summaryNameEl.textContent = state.characterName || '...';
        dom.summaryRaceEl.textContent = state.selectedBrand ? `Branded ${state.selectedRace || '...'}` : state.selectedRace || '...';
        dom.attributeTableEl.innerHTML = `<div class="attribute-header"><div>Attribute</div><div>Points Added</div><div>Bonus</div><div>Total</div><div>DC</div></div>`;
        dom.summaryAttributesEl.innerHTML = '';
        for (const name of Object.keys(state.attributes)) {
            const finalScore = getFinalAttributeScore(name);
            const dc = 12 - finalScore;
            const pointsAdded = state.attributes[name].points;
            const totalBonus = finalScore - (1 + pointsAdded);
            const plusButtonDisabled = (finalScore >= 10 || state.pointsRemaining <= 0) ? 'disabled' : '';
            const row = document.createElement('div');
            row.className = 'attribute-row';
            row.innerHTML = `<div>${name}</div><div class="attribute-controls"><button class="minus-btn" data-attribute="${name}">-</button><span>${pointsAdded}</span><button class="plus-btn" data-attribute="${name}" ${plusButtonDisabled}>+</button></div><div>+${totalBonus}</div><div>${finalScore}</div><div>${dc}</div>`;
            dom.attributeTableEl.appendChild(row);
            const summaryAttr = document.createElement('p');
            summaryAttr.innerHTML = `<strong>${name}:</strong> ${finalScore} (DC ${dc})`;
            dom.summaryAttributesEl.appendChild(summaryAttr);
        }
    }

    /** Redraws the derived stats (HP, Dice Pool, Speed). */
	function renderDerivedStats() {
		const brawn = getFinalAttributeScore('Brawn');
		const agility = getFinalAttributeScore('Agility');
		const luck = getFinalAttributeScore('Luck');

		// --- REFACTORED HP Calculation ---
		const perLevelHpBonus = Math.max(brawn, agility);
		let hp = 12 + (2 * perLevelHpBonus) + ((state.level - 1) * perLevelHpBonus);

		// Add flat HP modifiers from any source
		getEffects('HP_MODIFIER').forEach(effect => { hp += effect.value; });

		// Add HP from HP_BOOST feats, including any modifiers to them
		const hpBoostCount = getEffects('HP_BOOST').length;
		if (hpBoostCount > 0) {
			let bonusPerBoost = 0;
			getEffects('HP_BOOST_MODIFIER').forEach(mod => {
				bonusPerBoost += mod.value;
			});
			hp += hpBoostCount * (perLevelHpBonus + bonusPerBoost);
		}
		dom.summaryHpEl.textContent = hp;

		// --- Dice Pool Calculation (remains the same) ---
		dom.summaryDicePoolEl.textContent = 3 + Math.floor(state.level / 2) + Math.floor(luck / 2);

		// --- Speed Calculation (already refactored) ---
		let finalSpeed = 0;
		if (state.selectedRace && raceData[state.selectedRace]) {
			let baseSpeed = raceData[state.selectedRace].speed || 0;
			getEffects('SPEED_MODIFIER').forEach(effect => { baseSpeed += effect.value; });
			finalSpeed = baseSpeed;
		}
		dom.summarySpeedEl.innerHTML = finalSpeed > 0 ? `${finalSpeed}ft` : '--';
	}

    /** Redraws the list of racial and brand traits. */
    function renderTraits() {
        dom.summaryTraitsEl.innerHTML = '';
        if (!state.selectedRace) { dom.summaryTraitsEl.innerHTML = `<p>Select a race to see traits.</p>`; return; }
        const features = getCharacterFeatures();
        const traitsList = document.createElement('ul');
        features.forEach(feature => {
            const traitLi = document.createElement('li');
            traitLi.innerHTML = `<strong>${feature.name}:</strong> ${feature.description}`;
            traitsList.appendChild(traitLi);
        });
        dom.summaryTraitsEl.appendChild(traitsList);
    }

    /** Redraws the created weapon's stats in the summary. */
    function renderWeaponSummary() {
        if (!state.weapon) { dom.summaryWeaponEl.innerHTML = `<p>No weapon created.</p>`; return; }
        const w = state.weapon;
        let finalProperties = w.property ? [w.property] : [];
        getEffects('CONDITIONAL_WEAPON_PROPERTY').forEach(effect => {
            if (effect.condition === "weapon.variant === 'Range'" && w.variant === 'Range') {
                if (!finalProperties.includes(effect.propertyName)) {
                    finalProperties.push(effect.propertyName);
                }
            }
        });
        dom.summaryWeaponEl.innerHTML = `<p><strong>Category:</strong> ${w.category} (${w.variant})</p><p><strong>Base/Max Dice:</strong> ${w.baseDice} / ${w.maxDice}</p><p><strong>Damage:</strong> ${w.damagePerSuccess} per success</p><p><strong>Property:</strong> ${finalProperties.join(', ') || 'None Selected'}</p>`;
    }

    /** Redraws the interactive weapon customization panel. */
    function renderWeaponCreator() {
        if (!state.weapon) { dom.weaponCustomizationPanel.innerHTML = ''; dom.weaponVariantSelectorEl.style.display = 'none'; return; }
        const w = state.weapon;
        const data = weaponData[w.category];
        const brawn = getFinalAttributeScore('Brawn');
        const requirementMet = brawn >= data.brawnRequirement;
        const variantRadiosEl = dom.weaponVariantSelectorEl.querySelector('#variant-radios');
        variantRadiosEl.innerHTML = `<label><input type="radio" name="variant" value="Melee" ${w.variant === 'Melee' ? 'checked' : ''}> Melee</label><label><input type="radio" name="variant" value="Range" ${w.variant === 'Range' ? 'checked' : ''}> Range</label>`;
        const variantDesc = w.variant === 'Range' ? 'Use Agility for Attack actions.' : 'Use Brawn for Attack and Parry actions.';
        variantRadiosEl.innerHTML += `<div class="description-box" style="margin-top:5px; width: 100%;">${variantDesc}</div>`;
        dom.weaponVariantSelectorEl.style.display = 'block';
        let availableProperties = data.properties.map(propName => weaponProperties[propName]).filter(p => !p.type || (p.type === 'Melee Only' && w.variant === 'Melee'));
        let propertiesOptions = availableProperties.map(p => `<option value="${p.name}" ${w.property === p.name ? 'selected' : ''}>${p.name}</option>`).join('');
        const selectedPropData = w.property ? availableProperties.find(p => p.name === w.property) : null;
        dom.weaponCustomizationPanel.innerHTML = `<div class="description-box">${data.description}</div>${data.brawnRequirement > 0 ? `<p style="color: ${requirementMet ? 'inherit' : '#f44336'};">Requires Brawn ${data.brawnRequirement} (You have ${brawn})</p>` : ''}<div class="weapon-stat-row"><strong>Upgrade Points Remaining:</strong><span>${w.upgradePoints}</span></div><div class="weapon-stat-row"><strong>Max Dice:</strong><div class="attribute-controls"><button data-stat="maxDice" class="minus-btn" ${w.spentPoints.maxDice > 0 ? '' : 'disabled'}>-</button><span>${w.maxDice}</span><button data-stat="maxDice" class="plus-btn" ${w.upgradePoints > 0 ? '' : 'disabled'}>+</button></div></div><div class="weapon-stat-row"><strong>Damage per Success:</strong><div class="attribute-controls"><button data-stat="damagePerSuccess" class="minus-btn" ${w.spentPoints.damagePerSuccess > 0 ? '' : 'disabled'}>-</button><span>${w.damagePerSuccess}</span><button data-stat="damagePerSuccess" class="plus-btn" ${w.upgradePoints > 0 ? '' : 'disabled'}>+</button></div></div><div id="weapon-property-selector"><label for="property-select">3. Choose Weapon Property:</label><select id="property-select"><option value="">-- Select a Property --</option>${propertiesOptions}</select><div id="property-description-box" class="description-box" style="display: ${selectedPropData ? 'block' : 'none'}; margin-top: 5px;">${selectedPropData ? selectedPropData.desc : ''}</div></div>`;
    }

    /** Redraws the skills panel. */
    function renderSkillsPanel() {
        const totalPP = calculateTotalPp();
        dom.ppInput.value = totalPP;
        const remainingPP = totalPP - state.ppSpent;
        dom.ppTracker.innerHTML = `
            <div><h4>Total PP</h4><span>${totalPP}</span></div>
            <div><h4>PP Spent</h4><span>${state.ppSpent}</span></div>
            <div><h4>PP Remaining</h4><span>${remainingPP}</span></div>`;
        dom.skillsList.innerHTML = '';
        for (const skillName in skillData) {
            const currentRank = state.skills[skillName] || 0;
            const isMaxRank = currentRank >= 5;
            const nextRankCost = isMaxRank ? 'N/A' : skillRankCost[currentRank];
            const canAfford = remainingPP >= nextRankCost;
            const skillRow = document.createElement('div');
            skillRow.className = 'skill-row';
            skillRow.innerHTML = `
                <span class="skill-name has-tooltip" data-tooltip="${skillData[skillName].description}">${skillName}</span>
                <span>${currentRank}</span>
                <span>${nextRankCost}</span>
                <div><button class="minus-btn" data-skill="${skillName}" ${currentRank === 0 ? 'disabled' : ''}>-</button></div>
                <div><button class="plus-btn" data-skill="${skillName}" ${isMaxRank || !canAfford ? 'disabled' : ''}>+</button></div>`;
            dom.skillsList.appendChild(skillRow);
        }
    }

    /** Redraws the feats panel. */
    function renderFeatsPanel() {
        dom.featsList.innerHTML = '';
        const totalPP = calculateTotalPp();
        const remainingPP = totalPP - state.ppSpent;
        for (const featName in featData) {
            const feat = featData[featName];
            const timesPurchased = state.feats[featName] || 0;
            const canAfford = remainingPP >= feat.cost;
            const atMaxPurchases = feat.maxPurchases && timesPurchased >= feat.maxPurchases;
            let meetsPrereqs = true;
            let prereqText = [];
            for (const key in feat.prerequisites) {
                const reqValue = feat.prerequisites[key];
                const attributeName = key.charAt(0).toUpperCase() + key.slice(1);
                if (key.toLowerCase() === 'level') {
                    if (state.level < reqValue) { meetsPrereqs = false; prereqText.push(`Lvl ${reqValue}`); }
                } else {
                    if (getFinalAttributeScore(attributeName) < reqValue) { meetsPrereqs = false; prereqText.push(`${attributeName} ${reqValue}`); }
                }
            }
            const featRow = document.createElement('div');
            featRow.className = 'feat-row';
            featRow.innerHTML = `
                <span class="feat-name has-tooltip" data-tooltip="${feat.description}">${featName} ${prereqText.length > 0 ? `(${prereqText.join(', ')})` : ''}</span>
                <span>${feat.cost} PP</span>
                <span>${timesPurchased > 0 ? `(Taken x${timesPurchased})` : ''}</span>
                <div><button class="minus-btn" data-feat="${featName}" ${timesPurchased === 0 ? 'disabled' : ''}>-</button></div>
                <div><button class="plus-btn" data-feat="${featName}" ${!meetsPrereqs || !canAfford || atMaxPurchases ? 'disabled' : ''}>+</button></div>`;
            dom.featsList.appendChild(featRow);
        }
    }

    /** Redraws the list of purchased feats in the summary. */
    function renderSummaryFeats() {
        dom.summaryFeatsEl.innerHTML = '';
        const purchasedFeats = Object.keys(state.feats).filter(k => state.feats[k] > 0);
        if (purchasedFeats.length === 0) {
            dom.summaryFeatsEl.innerHTML = `<p>No feats taken.</p>`;
            return;
        }
        const featList = document.createElement('ul');
        purchasedFeats.forEach(featName => {
            const count = state.feats[featName];
            const featLi = document.createElement('li');
            featLi.textContent = count > 1 ? `${featName} (x${count})` : featName;
            featList.appendChild(featLi);
        });
        dom.summaryFeatsEl.appendChild(featList);
    }
    
    /** NEW: Redraws the magic panel for Tome selection. */
    function renderMagicPanel() {
    if (state.tomeAccessCount <= 0) {
        dom.tomeSelectionBox.innerHTML = '<p>You must gain access to a Tome via a racial trait or feat.</p>';
        dom.tomeRadios.innerHTML = '';
        dom.incantationsListSection.style.display = 'none';
        return;
    }
    dom.tomeSelectionBox.innerHTML = `<p>You have access to <strong>${state.tomeAccessCount}</strong> Tome(s). Please make your selection(s).</p>`;
    dom.tomeRadios.innerHTML = '';
    for (const tomeName in tomeData) {
        const tome = tomeData[tomeName];
        const isChecked = state.knownTomes.includes(tomeName);
        const isDisabled = !isChecked && state.knownTomes.length >= state.tomeAccessCount;
        const tomeDiv = document.createElement('div');
        tomeDiv.innerHTML = `<label class="has-tooltip" data-tooltip="${tome.description}"><input type="checkbox" name="tome-select" value="${tomeName}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>${tomeName}</label>`;
        dom.tomeRadios.appendChild(tomeDiv);
    }

    if (state.knownTomes.length === 0) {
        dom.incantationsListSection.style.display = 'none';
        return;
    }
    
    dom.incantationsListSection.style.display = 'block';
    dom.incantationsList.innerHTML = '';
    const remainingPP = calculateTotalPp() - state.ppSpent;

    // --- REFACTORED COST LOGIC ---
    const costModifiers = getEffects('INCANTATION_COST_MODIFIER');
    
    Object.keys(incantationData)
        .filter(key => state.knownTomes.includes(incantationData[key].tome))
        .forEach(incantationName => {
            const incantation = incantationData[incantationName];
            if (incantation.type === 'Cantrip') return;

            let actualCost = incantation.cost;
            let costText = `${actualCost} PP`;
            
            // Apply all cost modifiers from effects
            costModifiers.forEach(mod => {
                actualCost += mod.value;
            });
            // Ensure cost doesn't drop below the minimum defined by the effect (or 1)
            actualCost = Math.max(costModifiers[0]?.min || 1, actualCost);

            if (actualCost < incantation.cost) {
                costText = `<span class="has-tooltip" data-tooltip="Original Cost: ${incantation.cost} PP. Reduced by effects.">${actualCost} PP</span>`;
            }

            const isKnown = state.knownIncantations.includes(incantationName);
            const canAfford = remainingPP >= actualCost;
            
            const incantationDiv = document.createElement('div');
            incantationDiv.className = 'feat-row';
            incantationDiv.innerHTML = `<span class="feat-name has-tooltip" data-tooltip="${incantation.description}">${incantationName} (${incantation.type})</span><span>${costText}</span><span>${isKnown ? '(Known)' : ''}</span><div></div><div><button class="plus-btn learn-btn" data-incantation="${incantationName}" ${isKnown || !canAfford ? 'disabled' : ''}>Learn</button></div>`;
            dom.incantationsList.appendChild(incantationDiv);
        });
}
    
    /** NEW: Redraws the magic section in the summary panel. */
    function renderSummaryMagic() {
        if (state.knownTomes.length === 0) {
            dom.summaryMagicEl.innerHTML = '<p>No magic learned.</p>';
            return;
        }
        let html = '<h4>Known Tomes</h4><ul>';
        state.knownTomes.forEach(tomeName => {
            html += `<li>${tomeName}</li>`;
        });
        html += '</ul>';
        if (state.knownIncantations.length > 0) {
            html += '<h4>Known Incantations</h4><ul>';
            state.knownIncantations.forEach(incantationName => {
                html += `<li>${incantationName}</li>`;
            });
            html += '</ul>';
        }
        dom.summaryMagicEl.innerHTML = html;
    }

    // --- EVENT HANDLERS ---

    function handleViewSwitch(e) { if (!e.target.matches('.view-button')) return; const targetView = e.target.dataset.view; dom.viewPanels.forEach(panel => panel.style.display = 'none'); dom.viewSwitcherEl.querySelectorAll('.view-button').forEach(button => button.classList.remove('active')); document.getElementById(targetView).style.display = 'block'; e.target.classList.add('active'); }
    
    function handleRaceChange(e) {
        state.selectedRace = e.target.value;
        const race = raceData[state.selectedRace];
        if (race) {
            let desc = `<p><strong>${race.description}</strong></p><ul>`;
            (race.features || []).forEach(trait => { desc += `<li><strong>${trait.name}:</strong> ${trait.description}</li>`; });
            desc += '</ul>';
            dom.raceDescriptionBox.innerHTML = desc;
        } else {
            dom.raceDescriptionBox.innerHTML = `<p>Select a race to see its details.</p>`;
        }
        calculateTomeAccess();
        render();
    }

    function handleBrandChange(e) {
        state.selectedBrand = e.target.value === 'None' ? null : e.target.value;
        const brand = state.selectedBrand ? brandData[state.selectedBrand] : null;
        if (brand) {
            dom.brandDescriptionBox.innerHTML = `<strong>${brand.feature.name}:</strong> ${brand.feature.description}`;
        } else {
            dom.brandDescriptionBox.innerHTML = `<p>Selecting a Brand will replace your race's Defining Feature.</p>`;
        }
        render();
    }
	
    function handleAttributeChange(attribute, change) { if (change > 0) { const score = getFinalAttributeScore(attribute); if (state.pointsRemaining > 0 && score < 10) { state.attributes[attribute].points++; } } else if (change < 0 && state.attributes[attribute].points > 0) { state.attributes[attribute].points--; } render(); }
    function handleWeaponCategoryChange(e) { const category = e.target.value; const oldVariant = state.weapon ? state.weapon.variant : 'Melee'; if (!category) { state.weapon = null; } else { state.weapon = { category: category, variant: oldVariant, baseDice: 1, maxDice: 1, damagePerSuccess: 1, property: null, upgradePoints: weaponData[category].upgradePoints, spentPoints: { maxDice: 0, damagePerSuccess: 0 } }; } render(); }
    function handleWeaponUpgrade(e) { const stat = e.target.dataset.stat; if (!stat || !state.weapon || !e.target.matches('button')) return; const isPlus = e.target.classList.contains('plus-btn'); if (isPlus && state.weapon.upgradePoints > 0) { state.weapon[stat]++; state.weapon.spentPoints[stat]++; state.weapon.upgradePoints--; } else if (!isPlus && state.weapon.spentPoints[stat] > 0) { state.weapon[stat]--; state.weapon.spentPoints[stat]--; state.weapon.upgradePoints++; } render(); }
    function handleWeaponDetailsChange(e) { if (!state.weapon) return; if (e.target.name === 'variant') { state.weapon.variant = e.target.value; const selectedPropData = weaponProperties[state.weapon.property]; if (selectedPropData && selectedPropData.type === 'Melee Only' && state.weapon.variant !== 'Melee') { state.weapon.property = null; } } if (e.target.id === 'property-select') { state.weapon.property = e.target.value || null; } render(); }
    
    function handleSkillRankUpdate(e) {
        if (!e.target.matches('[data-skill]')) return;
        const skillName = e.target.dataset.skill;
        const currentRank = state.skills[skillName] || 0;
        const isPlus = e.target.classList.contains('plus-btn');
        if (isPlus) {
            if (currentRank >= 5) return;
            const cost = skillRankCost[currentRank];
            const totalPP = parseInt(dom.ppInput.value) || 0;
            if ((state.ppSpent + cost) <= totalPP) {
                state.skills[skillName] = currentRank + 1;
                state.ppSpent += cost;
            }
        } else {
            if (currentRank === 0) return;
            const refundAmount = skillRankCost[currentRank - 1];
            state.skills[skillName] = currentRank - 1;
            state.ppSpent -= refundAmount;
        }
        render();
    }
    
    function handleFeatUpdate(e) {
        const featButton = e.target.closest('[data-feat]');
        if (!featButton) return;
        const featName = featButton.dataset.feat;
        const feat = featData[featName];
        const timesPurchased = state.feats[featName] || 0;
        const isPlus = featButton.classList.contains('plus-btn');
        if (isPlus) {
            const totalPP = parseInt(dom.ppInput.value) || 0;
            const atMaxPurchases = feat.maxPurchases && timesPurchased >= feat.maxPurchases;
            if (atMaxPurchases || (state.ppSpent + feat.cost) > totalPP) return;
            state.feats[featName] = timesPurchased + 1;
            state.ppSpent += feat.cost;
        } else {
            if (timesPurchased === 0) return;
            state.feats[featName] = timesPurchased - 1;
            state.ppSpent -= feat.cost;
        }
        calculateTomeAccess();
        render();
    }
    
    /** NEW: Handles selections in the magic panel. */
    function handleMagicChange(e) {
        if (e.target.name === 'tome-select') {
            const selectedTomes = Array.from(dom.tomeRadios.querySelectorAll('input:checked')).map(input => input.value);
            state.knownTomes = selectedTomes;
            state.knownIncantations = [];
            state.knownTomes.forEach(tomeName => {
                const cantrip = Object.keys(incantationData).find(key =>
                    incantationData[key].tome === tomeName && incantationData[key].type === 'Cantrip'
                );
                if (cantrip && !state.knownIncantations.includes(cantrip)) {
                    state.knownIncantations.push(cantrip);
                }
            });
            render();
        }
    }
	
	function handleLearnIncantation(e) {
		const learnButton = e.target.closest('.learn-btn');
		if (!learnButton) return;

		const incantationName = learnButton.dataset.incantation;
		const incantation = incantationData[incantationName];
		
		// --- REFACTORED COST CALCULATION ---
		let actualCost = incantation.cost;
		const costModifiers = getEffects('INCANTATION_COST_MODIFIER');
		costModifiers.forEach(mod => {
			actualCost += mod.value;
		});
		actualCost = Math.max(costModifiers[0]?.min || 1, actualCost);
		
		const remainingPP = calculateTotalPp() - state.ppSpent;
		if (remainingPP >= actualCost && !state.knownIncantations.includes(incantationName)) {
			state.ppSpent += actualCost;
			state.knownIncantations.push(incantationName);
			render();
		}
	}

    // --- INITIALIZATION ---
    function initialize() {
        for (const raceName of Object.keys(raceData)) { dom.raceSelectEl.add(new Option(raceName, raceName)); }
        for (const category of Object.keys(weaponData)) { dom.weaponCategorySelectEl.add(new Option(category, category)); }
        const noBrandRadio = document.createElement('div'); noBrandRadio.innerHTML = `<label><input type="radio" name="brand" value="None" checked> No Brand</label>`; dom.brandRadiosContainer.appendChild(noBrandRadio);
        for (const brandName of Object.keys(brandData)) { const radioDiv = document.createElement('div'); radioDiv.innerHTML = `<label><input type="radio" name="brand" value="${brandName}"> ${brandName.replace('-', ' ')}</label>`; dom.brandRadiosContainer.appendChild(radioDiv); }
        dom.characterNameInput.addEventListener('input', render);
        dom.levelInputEl.addEventListener('change', render);
        dom.raceSelectEl.addEventListener('change', handleRaceChange);
        dom.brandRadiosContainer.addEventListener('change', handleBrandChange);
        dom.viewSwitcherEl.addEventListener('click', handleViewSwitch);
        dom.weaponCategorySelectEl.addEventListener('change', handleWeaponCategoryChange);
        dom.weaponCustomizationPanel.addEventListener('click', handleWeaponUpgrade);
        dom.weaponVariantSelectorEl.addEventListener('change', handleWeaponDetailsChange);
        dom.weaponCustomizationPanel.addEventListener('change', handleWeaponDetailsChange);
        dom.attributeTableEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('plus-btn')) { handleAttributeChange(e.target.dataset.attribute, 1); }
            if (e.target.classList.contains('minus-btn')) { handleAttributeChange(e.target.dataset.attribute, -1); }
        });
        dom.skillsList.addEventListener('click', handleSkillRankUpdate);
        dom.featsList.addEventListener('click', handleFeatUpdate);
        dom.ppInput.addEventListener('change', render);
        // Add the new event listener for the magic panel
        dom.magicViewPanel.addEventListener('change', handleMagicChange);
        render();
    }

    // Run the script!
    initialize();
});