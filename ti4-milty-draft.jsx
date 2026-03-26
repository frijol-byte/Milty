import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const FACTIONS = [
  { id: "arborec", name: "The Arborec", color: "#4a7c3f", tagline: "Living Forest of War", ability: "Mitosis: At the start of the status phase, place 1 infantry on any planet you control.", startingUnits: "1 Carrier, 1 Cruiser, 2 Fighters, 4 Infantry, 1 PDS, 1 Space Dock", startingTech: "Magen Defense Grid", homeSystem: "Nestphar (3/2)", commodities: 3, promissory: "Stymie: Place this card face-up in your play area when another player moves ships into a system that contains 1 or more of your ships.", flagshipName: "Duha Menaimon", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 5 — After you activate this system, you may produce up to 5 units in this system.", mechName: "Letani Behemoth", mechAbility: "After this unit is destroyed, roll 1 die; on 6+, place the unit on this card. At the start of your next turn, place it on a planet you control.", lore: "The Arborec are a vast sentient plant network spanning entire worlds. Each 'individual' is merely a node in a planetary consciousness that dreams in centuries and wages war with the patience of geology.", strengths: "Strong ground game, self-sustaining infantry production, excellent at holding territory", weaknesses: "Slow expansion, limited starting fleet, poor early game mobility", complexity: 2 },
  { id: "letnev", name: "The Barony of Letnev", color: "#8b1a1a", tagline: "Military Industrial Machine", ability: "Munitions Reserves: At the start of each round of space combat, you may spend 2 trade goods to re-roll any number of your dice.", startingUnits: "1 Dreadnought, 1 Carrier, 1 Destroyer, 1 Fighter, 3 Infantry, 1 Space Dock", startingTech: "Antimass Deflectors, Plasma Scoring", homeSystem: "Arc Prime (4/0), Wren Terra (2/1)", commodities: 2, promissory: "War Funding: After a player's destroyer or cruiser is destroyed, you may place 1 of your destroyers from your reinforcements in that system's space area.", flagshipName: "Arc Secundus", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — Other players' units in this system lose PLANETARY SHIELD.", mechName: "Dunlain Reaper", mechAbility: "During combat against a player who has the most victory points, apply +2 to the result of each of this unit's combat rolls.", lore: "Beneath the frozen surface of Arc Prime, the Barony forges the mightiest warfleet the galaxy has ever known.", strengths: "Powerful combat rerolls, strong starting tech, versatile military", weaknesses: "Low commodities, trade-good hungry, needs economy to fuel war machine", complexity: 1 },
  { id: "saar", name: "The Clan of Saar", color: "#c4a23a", tagline: "Nomadic Scavengers", ability: "Scavenge: After you gain control of a planet, gain 1 trade good.", startingUnits: "2 Carriers, 1 Cruiser, 2 Fighters, 4 Infantry, 1 Space Dock", startingTech: "Antimass Deflectors", homeSystem: "Lisis II (1/0), Ragh (2/1)", commodities: 3, promissory: "Ragh's Call: After you commit 1 or more units to a planet, the active player places 1 infantry from their reinforcements on that planet.", flagshipName: "Son of Ragh", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — ANTI-FIGHTER BARRAGE 6 (×4)", mechName: "Scavenger Zeta", mechAbility: "After you gain control of a planet, you may place 1 mech on that planet from your reinforcements.", lore: "Displaced from their homeworld by cosmic catastrophe, the Clan of Saar wanders the stars in great migrant fleets.", strengths: "Mobile space docks, excellent early expansion, free trade goods from conquering", weaknesses: "Vulnerable home system, hard to defend wide territory, reliant on momentum", complexity: 2 },
  { id: "hacan", name: "The Emirates of Hacan", color: "#d4a017", tagline: "Masters of Trade", ability: "Masters of Trade: You do not have to spend a command token to resolve the secondary ability of the 'Trade' strategy card.", startingUnits: "2 Carriers, 1 Cruiser, 2 Fighters, 4 Infantry, 1 Space Dock", startingTech: "Antimass Deflectors, Sarween Tools", homeSystem: "Arretze (2/0), Hercant (1/1), Kamdorn (0/1)", commodities: 6, promissory: "Trade Convoys: Lock/unlock this card to establish trade agreements with any number of players.", flagshipName: "Wrath of Kenara", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — After you win a space combat, gain 3 trade goods.", mechName: "Pride of Kenara", mechAbility: "During combat, you may spend 2 trade goods; apply +2 to each of this unit's combat rolls.", lore: "The Emirates of Hacan control the galaxy's largest trading network from their desert homeworlds.", strengths: "Massive economy, 6 commodities, flexible trade, strong starting tech", weaknesses: "Average military, can become a target for their wealth, rely on diplomacy", complexity: 1 },
  { id: "sol", name: "The Federation of Sol", color: "#2e5cb8", tagline: "Humanity United", ability: "Orbital Drop: As an action, spend 1 command token from your reinforcements to place 2 infantry on any planet you control.", startingUnits: "2 Carriers, 1 Destroyer, 5 Infantry, 1 Space Dock", startingTech: "Antimass Deflectors, Neural Motivator", homeSystem: "Jord (4/2)", commodities: 4, promissory: "Military Support: At the start of the Sol player's turn, they may remove this card to place 2 infantry on any planet they control.", flagshipName: "Genesis", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 12 — At the end of the status phase, place 1 infantry from your reinforcements on this ship.", mechName: "ZS Thunderbolt M2", mechAbility: "After a player activates this system, you may spend 1 token from your tactics pool to place this mech on a planet you control in this system.", lore: "Humanity has united under the banner of Sol, forging an interstellar federation of incredible ambition.", strengths: "Infantry spam, versatile abilities, strong home system, good starting tech", weaknesses: "No flashy gimmick, command token hungry, average fleet", complexity: 1 },
  { id: "creuss", name: "The Ghosts of Creuss", color: "#6b3fa0", tagline: "Wormhole Weavers", ability: "Quantum Entanglement: Your system contains a delta wormhole. You may treat all systems that contain a wormhole as adjacent.", startingUnits: "2 Carriers, 1 Destroyer, 2 Fighters, 4 Infantry, 1 Space Dock", startingTech: "Gravity Drive", homeSystem: "Creuss (4/2) — in the Creuss Gate system", commodities: 4, promissory: "Creuss Iff: While this card is in your play area, your ships may use the wormhole in the Creuss system.", flagshipName: "Hil Colish", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — This ship's system contains a delta wormhole.", mechName: "Icarus Drive", mechAbility: "This unit may move through systems that contain other players' ships.", lore: "From their dimension beyond the veil, the Ghosts of Creuss manipulate the very fabric of spacetime.", strengths: "Unparalleled mobility via wormholes, surprise attacks, hard to pin down", weaknesses: "Isolated start, reliant on wormhole placement, complex to master", complexity: 3 },
  { id: "l1z1x", name: "The L1Z1X Mindnet", color: "#4a4a4a", tagline: "Cybernetic Inheritors", ability: "Assimilate: When you gain control of a planet, replace each PDS and space dock there with your own.", startingUnits: "1 Dreadnought, 1 Carrier, 2 Fighters, 5 Infantry, 1 PDS, 1 Space Dock", startingTech: "Neural Motivator, Plasma Scoring", homeSystem: "[0.0.0] (5/0)", commodities: 2, promissory: "Cybernetic Enhancements: At the start of combat, apply +1 to each of your unit's combat rolls in this system.", flagshipName: "0.0.1", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 5 — Hits from this ship and dreadnoughts must be assigned to non-fighters.", mechName: "Annihilator", mechAbility: "Bombardment 8. You may use this unit's BOMBARDMENT against planets that contain structures.", lore: "The L1Z1X are the remnants of the Lazax Empire, rebuilt with cybernetic augmentation.", strengths: "Strong dreadnought fleet, assimilate enemy structures, powerful starting tech", weaknesses: "Low commodities, aggressive playstyle makes enemies, slow fleet", complexity: 2 },
  { id: "mentak", name: "The Mentak Coalition", color: "#e8721c", tagline: "Space Pirates", ability: "Pillage: After another player gains trade goods or resolves a transaction, you may spend 1 token to take 1 of their trade goods.", startingUnits: "2 Carriers, 1 Cruiser, 3 Fighters, 4 Infantry, 1 PDS, 1 Space Dock", startingTech: "Sarween Tools, Plasma Scoring", homeSystem: "Moll Primus (4/1)", commodities: 2, promissory: "Promise of Protection: While this card is in your play area, Mentak cannot use PILLAGE against you.", flagshipName: "Fourth Moon", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — Other players' ships cannot use SUSTAIN DAMAGE.", mechName: "Moll Terminus", mechAbility: "Other player's ground forces on this planet cannot use SUSTAIN DAMAGE.", lore: "Born from the prison colonies of the old empire, the Mentak Coalition has embraced piracy as statecraft.", strengths: "Pillage disrupts opponents' economy, strong starting tech, ambush ability", weaknesses: "Makes enemies quickly, low commodities, pillage costs command tokens", complexity: 2 },
  { id: "naalu", name: "The Naalu Collective", color: "#2fa179", tagline: "Telepathic Serpents", ability: "Telepathic: At the end of the strategy phase, place the Naalu '0' token on your strategy card. You are first in initiative order.", startingUnits: "1 Carrier, 1 Cruiser, 1 Destroyer, 3 Fighters, 4 Infantry, 1 PDS, 1 Space Dock", startingTech: "Neural Motivator, Sarween Tools", homeSystem: "Druaa (3/1), Maaluuk (0/2)", commodities: 3, promissory: "Gift of Prescience: The Naalu player places the '0' token on your strategy card instead of theirs.", flagshipName: "Matriarch", flagshipStats: "Cost 8 | Combat 9(×2) | Move 1 | Capacity 6 — Commit fighters to planets as ground forces.", mechName: "Iconoclast", mechAbility: "Apply +2 to combat rolls if your opponent is the active player.", lore: "The Naalu are an ancient serpentine race with powerful telepathic abilities.", strengths: "Always go first (0 initiative), fighters as ground forces, strong starting tech", weaknesses: "Average combat stats, token-hungry, need to leverage initiative advantage", complexity: 2 },
  { id: "nekro", name: "The Nekro Virus", color: "#1a1a2e", tagline: "Technological Plague", ability: "Technological Singularity: You cannot research technology. When you win a combat, copy 1 technology from your opponent.", startingUnits: "1 Dreadnought, 1 Carrier, 2 Fighters, 2 Infantry, 1 Space Dock", startingTech: "Daxcive Animators", homeSystem: "Mordai II (4/0)", commodities: 3, promissory: "Antivirus: Nekro cannot use TECHNOLOGICAL SINGULARITY against you this combat.", flagshipName: "The Alastor", flagshipStats: "Cost 8 | Combat 9(×2) | Move 1 | Capacity 3 — Ground forces participate as ships.", mechName: "Mordred", mechAbility: "When your opponent produces a hit, you may remove this unit to cancel that hit.", lore: "The Nekro Virus is a technological pathogen that has achieved sentience.", strengths: "Free tech from combat, powerful flagship, can snowball quickly", weaknesses: "Cannot research, must fight to gain tech, universally feared/targeted", complexity: 3 },
  { id: "sardakk", name: "Sardakk N'orr", color: "#8b0000", tagline: "Warrior Hive", ability: "Unrelenting: Apply +1 to the result of each of your unit's combat rolls.", startingUnits: "2 Carriers, 1 Cruiser, 5 Infantry, 1 PDS, 1 Space Dock", startingTech: "None", homeSystem: "Tren'lak (1/0), Quinarra (3/1)", commodities: 3, promissory: "Tekklar Legion: Apply +1 to Sardakk combat rolls for the duration of invasion combat.", flagshipName: "C'Morran N'orr", flagshipStats: "Cost 8 | Combat 6(×2) | Move 1 | Capacity 3 — +1 to other ships' combat rolls.", mechName: "Valkyrie Exoskeleton", mechAbility: "After destroyed, roll 1 die; on 6+, opponent destroys 1 non-fighter ship.", lore: "The N'orr are an insectoid warrior species for whom combat is religion.", strengths: "Best combat modifier in game (+1 to everything), fearsome in battle", weaknesses: "No starting tech, slow development, must invest heavily in tech", complexity: 2 },
  { id: "jolnar", name: "The Universities of Jol-Nar", color: "#1c6ea4", tagline: "Galactic Scholars", ability: "Fragile: Apply -1 to the result of each of your unit's combat rolls.", startingUnits: "2 Carriers, 1 Dreadnought, 1 Fighter, 2 Infantry, 1 PDS, 1 Space Dock", startingTech: "Antimass Deflectors, Neural Motivator, Sarween Tools, Plasma Scoring", homeSystem: "Jol (1/2), Nar (2/3)", commodities: 4, promissory: "Research Agreement: After Jol-Nar researches a tech, you may exhaust this to research the same.", flagshipName: "J.N.S. Hylarim", flagshipStats: "Cost 8 | Combat 6(×2) | Move 1 | Capacity 3 — Results of 9-10 produce 2 additional hits.", mechName: "Shield Bearer", mechAbility: "Your PDS in this system each roll 1 additional die for SPACE CANNON.", lore: "The Universities of Jol-Nar are the galaxy's preeminent center of learning.", strengths: "4 starting techs (most in game), fastest tech progression, research power", weaknesses: "-1 to all combat rolls, fragile military, tempting target for tech theft", complexity: 2 },
  { id: "winnu", name: "The Winnu", color: "#a08040", tagline: "Custodians of Mecatol", ability: "Blood Ties: You do not have to spend influence to remove the custodians token from Mecatol Rex.", startingUnits: "1 Carrier, 1 Cruiser, 2 Fighters, 2 Infantry, 1 PDS, 1 Space Dock", startingTech: "Choose any 1 technology with no prerequisites", homeSystem: "Winnu (3/4)", commodities: 3, promissory: "Acquiescence: After Winnu resolves a tactical action in a system with their planet, you may spend 1 token.", flagshipName: "Salai Sai Corian", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — Rolls dice equal to non-fighter ships.", mechName: "Reclaimer", mechAbility: "After destroyed, place 1 PDS from reinforcements on this planet.", lore: "The Winnu are the former custodians of the imperial throne on Mecatol Rex.", strengths: "Free Mecatol Rex claim, flexible starting tech, excellent home system", weaknesses: "Mecatol-dependent strategy, average otherwise, needs early Mecatol", complexity: 2 },
  { id: "xxcha", name: "The Xxcha Kingdom", color: "#3a6b35", tagline: "Diplomatic Turtles", ability: "Peace Accords: After you resolve Diplomacy, you may gain 1 command token.", startingUnits: "1 Carrier, 1 Cruiser, 3 Fighters, 4 Infantry, 1 PDS, 1 Space Dock", startingTech: "Graviton Laser System", homeSystem: "Archon Ren (2/3), Archon Tau (1/1)", commodities: 4, promissory: "Political Favor: Cast 1 additional vote for any outcome.", flagshipName: "Loncara Ssodu", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — SPACE CANNON 5 (×3) against adjacent systems.", mechName: "Indomitus", mechAbility: "Spend 1 token to produce 1 hit against ships in the active system.", lore: "The Xxcha are a patient reptilian species renowned for their diplomatic wisdom.", strengths: "Strong PDS network, defensive, excellent at politics and Agenda phase", weaknesses: "Slow, defensive playstyle can fall behind, limited offense", complexity: 2 },
  { id: "yin", name: "The Yin Brotherhood", color: "#e8e0d0", tagline: "Fanatical Clones", ability: "Indoctrination: When you produce units, replace 1 infantry with 1 from another player's reinforcements.", startingUnits: "2 Carriers, 1 Destroyer, 4 Infantry, 1 Space Dock", startingTech: "Sarween Tools", homeSystem: "Darien (4/4)", commodities: 2, promissory: "Greyfire Mutagen: After Yin produces ships, they may produce up to 2 additional fighters.", flagshipName: "Van Hauge", flagshipStats: "Cost 8 | Combat 9(×2) | Move 1 | Capacity 3 — When destroyed, destroy ALL ships in this system.", mechName: "Moyin's Ashes", mechAbility: "When destroyed in ground combat, opponent destroys 1 non-mech ground force.", lore: "The Yin Brotherhood is a theocratic civilization of clones.", strengths: "Powerful flagship suicide ability, strong home system (4/4), clone replacement", weaknesses: "Low commodities, limited starting fleet, needs to be aggressive", complexity: 2 },
  { id: "muaat", name: "The Embers of Muaat", color: "#ff4500", tagline: "Star Forgers", ability: "Star Forge: Spend 1 strategy token to place 1 cruiser in a system with your war sun.", startingUnits: "1 War Sun, 2 Fighters, 4 Infantry, 1 Space Dock", startingTech: "Plasma Scoring", homeSystem: "Muaat (4/1)", commodities: 4, promissory: "Fires of the Gashlai: Remove to place 1 Muaat war sun in a non-home system.", flagshipName: "The Inferno", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — Spend 1 token to produce up to 3 fighters.", mechName: "Ember Colossus", mechAbility: "Units with PLANETARY SHIELD on this planet are not affected by BOMBARDMENT.", lore: "Born within the plasma storms of their molten homeworld, the Embers of Muaat have mastered the power of stars.", strengths: "Start with a war sun, powerful early game threat, star forge cruisers", weaknesses: "Expensive to maintain, war sun is slow, limited starting fleet otherwise", complexity: 3 },
  { id: "titans", name: "The Titans of Ul", color: "#7a6840", tagline: "Ancient Sleepers", ability: "Terragenesis: After you explore a planet, you may place 1 PDS from reinforcements on that planet.", startingUnits: "1 Dreadnought, 1 Carrier, 2 Fighters, 3 Infantry, 1 PDS, 1 Space Dock", startingTech: "Antimass Deflectors, Scanlink Drone Network", homeSystem: "Elysium (4/1)", commodities: 2, promissory: "Terraform: Attach to a planet; its resource and influence values increase by 1.", flagshipName: "Ouranos", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — DEPLOY: Replace with an 'ul' unit on any planet.", mechName: "Saturn Engine I/II", mechAbility: "SUSTAIN DAMAGE. Can be UPGRADED. Saturn Engine II gains DEEP SPACE CANNON 5.", lore: "The Titans of Ul slumbered for millennia beneath their world's surface.", strengths: "Free PDS from exploration, upgradeable mechs, strong defensive network", weaknesses: "Low commodities, complex PDS strategy, need to explore aggressively", complexity: 3 },
  { id: "nomad", name: "The Nomad", color: "#5c4a72", tagline: "Dimensional Wanderer", ability: "The Company: Take 3 agent cards during setup. You may have 2 agents at the same time.", startingUnits: "1 Carrier, 1 Dreadnought, 1 Destroyer, 2 Fighters, 4 Infantry, 1 Space Dock", startingTech: "Sling Relay", homeSystem: "Arcturus (4/0)", commodities: 4, promissory: "The Cavalry: At the start of space combat, Nomad may place 1 dreadnought from reinforcements.", flagshipName: "Memoria I/II", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — Can be UPGRADED. Memoria II gains AFB 5 (×3) and +1 Move.", mechName: "Quantum Manipulator", mechAbility: "Swap this unit with 1 of your mechs on another planet when ships move in.", lore: "The Nomad is a singular being who has wandered through dimensions and time.", strengths: "Three unique agents, upgradeable flagship, versatile toolkit", weaknesses: "Complex decision trees, moderate economy, agents require mastery", complexity: 3 },
  { id: "mahact", name: "The Mahact Gene-Sorcerers", color: "#9b30ff", tagline: "Genetic Warlords", ability: "Edict: When you win combat, capture 1 of your opponent's command tokens.", startingUnits: "2 Carriers, 1 Dreadnought, 2 Fighters, 3 Infantry, 1 Space Dock", startingTech: "Bio-Stims, Predictive Intelligence", homeSystem: "Ixth (3/5)", commodities: 3, promissory: "Scepter of Dominion: Mahact must return 1 captured token to use a captured commander.", flagshipName: "Arvicon Rex", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — Opposing ships cannot use SUSTAIN DAMAGE.", mechName: "Starlancer", mechAbility: "Spend a captured token to end that player's turn; then move this unit.", lore: "The Mahact were terrifying gene-sorcerers who once controlled the galaxy.", strengths: "Steal command tokens, use enemy commanders, powerful disruption", weaknesses: "Universally feared/hated, must fight to use abilities, complex", complexity: 3 },
  { id: "naazrokha", name: "The Naaz-Rokha Alliance", color: "#6b8e23", tagline: "Mech Warriors", ability: "Fabricators: When you explore a planet, spend 1 trade good to place 1 mech on that planet.", startingUnits: "1 Carrier, 1 Cruiser, 1 Destroyer, 2 Fighters, 3 Infantry, 1 Mech, 1 Space Dock", startingTech: "AI Development Algorithm, Psychoarchaeology", homeSystem: "Nar (2/3), Rokha (1/2)", commodities: 3, promissory: "Black Market Forgery: Place 1 Naaz-Rokha mech on an explored planet.", flagshipName: "Visz el Vansen", flagshipStats: "Cost 8 | Combat 9(×2) | Move 1 | Capacity 5 — Produce 1 unit after exploring a planet.", mechName: "Supercharge", mechAbility: "After destroyed, draw 1 relic fragment of any type.", lore: "The Naaz-Rokha Alliance produces the finest mechs in the galaxy.", strengths: "Free mechs from exploration, relic synergy, strong mech game", weaknesses: "Exploration-dependent, needs trade goods for ability, moderate fleet", complexity: 2 },
  { id: "argent", name: "The Argent Flight", color: "#c0c0c0", tagline: "Strike Wing Commanders", ability: "Zeal: Vote 'for' or 'against' after all other players. Cast votes for a specific outcome.", startingUnits: "2 Carriers, 1 Destroyer, 3 Fighters, 5 Infantry, 1 PDS, 1 Space Dock", startingTech: "Neural Motivator, Sarween Tools", homeSystem: "Avar (1/1), Valk (2/0), Ylir (0/2)", commodities: 3, promissory: "Strike Wing Ambuscade: Argent cannot use ZEAL against you.", flagshipName: "Quetzecoatl", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 3 — No action cards during space combat.", mechName: "Aerie Sentinel", mechAbility: "Other players' ships in this system cannot use SUSTAIN DAMAGE.", lore: "The Argent Flight are an avian species organized into strike wings.", strengths: "Vote last in Agenda phase, strong starting units, good starting tech", weaknesses: "Three-planet home system is vulnerable, average economy", complexity: 2 },
  { id: "vuilraith", name: "The Vuil'raith Cabal", color: "#2d0a1e", tagline: "Dimensional Horror", ability: "Devour: Capture opponent's non-structure units destroyed during combat.", startingUnits: "2 Carriers, 1 Dreadnought, 2 Fighters, 3 Infantry, 1 Space Dock", startingTech: "Self Assembly Routines", homeSystem: "Acheron (4/0)", commodities: 2, promissory: "Crucible: After Vuil'raith captures your units, place 2 fighters in a system with your ships.", flagshipName: "The Terror Between", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — BOMBARDMENT 5 (×3). Enemy PDS lose abilities.", mechName: "Reanimator", mechAbility: "When destroyed, place 1 infantry from reinforcements on this planet.", lore: "The Vuil'raith Cabal is an eldritch horror from beyond the dimensional rift.", strengths: "Capture enemy units, strong flagship bombardment, snowball potential", weaknesses: "Low commodities, feared by all, complex capture mechanics", complexity: 3 },
  { id: "empyrean", name: "The Empyrean", color: "#daa520", tagline: "Astral Merchants", ability: "Aetherpassage: Allow other players to move through your systems.", startingUnits: "2 Carriers, 1 Dreadnought, 2 Fighters, 3 Infantry, 1 Space Dock", startingTech: "Dark Energy Tap", homeSystem: "The Dark (3/4)", commodities: 4, promissory: "Blood Pact: After Empyrean loses a ship, you may place 1 of the same type.", flagshipName: "Dynamo", flagshipStats: "Cost 8 | Combat 5(×2) | Move 1 | Capacity 3 — Spend 2 influence to repair units using SUSTAIN DAMAGE.", mechName: "Watcher", mechAbility: "Spend 1 influence to place this unit on a planet you control when adjacent system is activated.", lore: "The Empyrean are beings of pure energy who traverse the astral plane.", strengths: "Strong home system, movement manipulation, diplomatic leverage", weaknesses: "Passive playstyle, relies on others' actions, complex timing", complexity: 3 },
  { id: "keleres", name: "The Council Keleres", color: "#b8860b", tagline: "Galactic Peacekeepers", ability: "Council Directive: Choose sub-faction (Mentak, Xxcha, or Argent). Gain their starting tech and abilities.", startingUnits: "2 Carriers, 1 Cruiser, 2 Fighters, 3 Infantry, 1 Space Dock", startingTech: "Varies by sub-faction chosen", homeSystem: "Varies by sub-faction chosen", commodities: 2, promissory: "Keleres Rider: Predict an agenda outcome; if correct, draw 1 secret objective.", flagshipName: "Artemiris", flagshipStats: "Cost 8 | Combat 7(×2) | Move 1 | Capacity 6 — Other players cannot use SUSTAIN DAMAGE.", mechName: "Omniorian Guard", mechAbility: "Hits must be assigned to non-mech ground forces if able.", lore: "The Council Keleres are the peacekeeping arm of the Galactic Council.", strengths: "Flexible sub-faction choice, peacekeeping bonuses, strong Agenda phase", weaknesses: "Low commodities, effectiveness depends on sub-faction choice", complexity: 3 },
];

// BLUE-BACKED: All planet tiles (cultural, industrial, AND hazardous) without anomalies
const BLUE_TILES = [
  // Industrial
  { id: 19, planets: [{ name: "Wellon", r: 1, i: 2, techSkip: "cybernetic" }], trait: "industrial", back: "blue" },
  { id: 21, planets: [{ name: "Thibah", r: 1, i: 1, techSkip: "propulsion" }], trait: "industrial", back: "blue" },
  { id: 22, planets: [{ name: "Tar'mann", r: 1, i: 1 }], trait: "industrial", back: "blue" },
  { id: 23, planets: [{ name: "Saudor", r: 2, i: 2 }], trait: "industrial", back: "blue" },
  { id: 27, planets: [{ name: "New Albion", r: 1, i: 1, techSkip: "biotic" }, { name: "Starpoint", r: 3, i: 1 }], trait: "industrial", back: "blue" },
  { id: 34, planets: [{ name: "Centauri", r: 1, i: 3 }, { name: "Gral", r: 1, i: 1, techSkip: "propulsion" }], trait: "industrial", back: "blue" },
  { id: 62, planets: [{ name: "Rigel I", r: 0, i: 1 }, { name: "Rigel II", r: 1, i: 2 }], trait: "industrial", back: "blue" },
  // Cultural
  { id: 25, planets: [{ name: "Quann", r: 2, i: 1 }], trait: "cultural", wormhole: "beta", back: "blue" },
  { id: 26, planets: [{ name: "Lodor", r: 3, i: 1 }], trait: "cultural", wormhole: "alpha", back: "blue" },
  { id: 29, planets: [{ name: "Qucen'n", r: 1, i: 2 }, { name: "Rarron", r: 0, i: 3 }], trait: "cultural", back: "blue" },
  { id: 32, planets: [{ name: "Dal Bootha", r: 0, i: 2 }, { name: "Xxehan", r: 1, i: 1 }], trait: "cultural", back: "blue" },
  { id: 33, planets: [{ name: "Corneeq", r: 1, i: 2 }, { name: "Resculon", r: 2, i: 0 }], trait: "cultural", back: "blue" },
  { id: 36, planets: [{ name: "Arnor", r: 2, i: 1 }, { name: "Lor", r: 1, i: 2 }], trait: "cultural", back: "blue" },
  { id: 59, planets: [{ name: "Sem-Lore", r: 3, i: 2, techSkip: "cybernetic" }], trait: "cultural", back: "blue" },
  { id: 60, planets: [{ name: "Vorhal", r: 0, i: 2, techSkip: "biotic" }], trait: "cultural", back: "blue" },
  { id: 65, planets: [{ name: "Primor", r: 2, i: 1 }], trait: "cultural", legendary: true, back: "blue" },
  // Hazardous (planet tiles — blue-backed, NOT red)
  { id: 20, planets: [{ name: "Vefut II", r: 2, i: 2 }], trait: "hazardous", back: "blue" },
  { id: 24, planets: [{ name: "Mehar Xull", r: 1, i: 3, techSkip: "warfare" }], trait: "hazardous", back: "blue" },
  { id: 28, planets: [{ name: "Tequ'ran", r: 2, i: 0 }, { name: "Torkan", r: 0, i: 3 }], trait: "hazardous", back: "blue" },
  { id: 30, planets: [{ name: "Mellon", r: 0, i: 2 }, { name: "Zohbat", r: 3, i: 1 }], trait: "hazardous", back: "blue" },
  { id: 31, planets: [{ name: "Lazar", r: 1, i: 0, techSkip: "cybernetic" }, { name: "Sakulag", r: 2, i: 1 }], trait: "hazardous", back: "blue" },
  { id: 35, planets: [{ name: "Bereg", r: 3, i: 1 }, { name: "Lirta IV", r: 2, i: 3 }], trait: "hazardous", back: "blue" },
  { id: 37, planets: [{ name: "Arinam", r: 1, i: 2 }, { name: "Meer", r: 0, i: 4 }], trait: "hazardous", back: "blue" },
  { id: 38, planets: [{ name: "Abyz", r: 3, i: 0 }, { name: "Fria", r: 2, i: 0 }], trait: "hazardous", back: "blue" },
  { id: 64, planets: [{ name: "Atlas", r: 3, i: 1 }], trait: "hazardous", wormhole: "beta", back: "blue" },
  { id: 66, planets: [{ name: "Hope's End", r: 3, i: 0 }], trait: "hazardous", legendary: true, back: "blue" },
  // PoK planet tiles
  { id: 61, planets: [{ name: "Kobadun", r: 1, i: 1 }, { name: "Londrak", r: 0, i: 4 }], trait: "cultural", back: "blue" },
  { id: 63, planets: [{ name: "Rigel III", r: 1, i: 1, techSkip: "biotic" }], trait: "industrial", back: "blue" },
];

// RED-BACKED: Anomalies and empty space ONLY (no planet-only tiles)
const RED_TILES = [
  // Base game anomalies
  { id: 39, planets: [], anomaly: "alpha-wormhole", wormhole: "alpha", back: "red" },
  { id: 40, planets: [], anomaly: "beta-wormhole", wormhole: "beta", back: "red" },
  { id: 41, planets: [], anomaly: "gravity-rift", back: "red" },
  { id: 42, planets: [], anomaly: "nebula", back: "red" },
  { id: 43, planets: [], anomaly: "supernova", back: "red" },
  { id: 44, planets: [], anomaly: "asteroid-field", back: "red" },
  { id: 45, planets: [], anomaly: "asteroid-field", back: "red" },
  // PoK anomaly tiles (planets inside anomalies — still red-backed)
  { id: 67, planets: [{ name: "Cormund", r: 2, i: 0 }], trait: "hazardous", anomaly: "nebula", back: "red" },
  { id: 68, planets: [{ name: "Everra", r: 3, i: 1 }], trait: "cultural", anomaly: "asteroid-field", back: "red" },
  // PoK empty space / frontier tiles
  { id: 69, planets: [], anomaly: "empty", back: "red" },
  { id: 70, planets: [], anomaly: "empty", back: "red" },
  { id: 71, planets: [], anomaly: "empty", wormhole: "alpha", back: "red" },
  { id: 72, planets: [], anomaly: "empty", wormhole: "beta", back: "red" },
  { id: 73, planets: [], anomaly: "empty", back: "red" },
  { id: 74, planets: [], anomaly: "empty", back: "red" },
  { id: 75, planets: [], anomaly: "gravity-rift", back: "red" },
  { id: 76, planets: [], anomaly: "nebula", back: "red" },
  { id: 77, planets: [], anomaly: "empty", back: "red" },
  { id: 78, planets: [], anomaly: "empty", back: "red" },
];

const GALACTIC_EVENTS = [
  { name: "Wormhole Cascade", desc: "All wormholes are adjacent regardless of type for this round.", icon: "🌀", severity: "major" },
  { name: "Ion Storm", desc: "All ships receive -1 to combat rolls this round.", icon: "⚡", severity: "major" },
  { name: "Ancient Artifact", desc: "A Lazax relic surfaces. The controlling player may research 1 free technology.", icon: "🏛️", severity: "minor" },
  { name: "Trade Route Disruption", desc: "All players lose 1 commodity at the start of the round.", icon: "🏴‍☠️", severity: "moderate" },
  { name: "Senate Emergency", desc: "The next Agenda phase resolves 3 agendas instead of 2.", icon: "🏛️", severity: "major" },
  { name: "Supernova Flare", desc: "All units adjacent to supernovas take 1 hit.", icon: "☀️", severity: "catastrophic" },
  { name: "Diplomatic Summit", desc: "All players may exchange promissory notes without Trade.", icon: "🤝", severity: "minor" },
  { name: "Resource Boom", desc: "All planets produce +1 resource this round.", icon: "💎", severity: "moderate" },
  { name: "Nebula Expansion", desc: "A nebula engulfs a random system. Ships there cannot retreat.", icon: "🌫️", severity: "moderate" },
  { name: "Rift Tear", desc: "Ships within 2 systems of Mecatol must make a gravity roll.", icon: "🕳️", severity: "catastrophic" },
  { name: "Tech Breakthrough", desc: "Each player may ignore 1 prerequisite when researching this round.", icon: "🔬", severity: "minor" },
  { name: "Mercenary Fleet", desc: "Player with most trade goods may hire 2 free cruisers.", icon: "⚔️", severity: "moderate" },
  { name: "Plague Outbreak", desc: "Each player destroys 1 infantry on a planet of their choice.", icon: "☣️", severity: "moderate" },
  { name: "Solar Eclipse", desc: "Movement near Mecatol Rex costs +1.", icon: "🌑", severity: "minor" },
  { name: "Arms Race", desc: "All players may produce 2 additional units during next production.", icon: "🏭", severity: "major" },
  { name: "Stellar Cartography", desc: "All ships gain +1 movement this round.", icon: "🗺️", severity: "moderate" },
  { name: "Council of Whispers", desc: "Each player may look at 1 other player's secret objectives.", icon: "🕵️", severity: "major" },
  { name: "Void Incursion", desc: "Place 1 neutral dreadnought in a random empty system.", icon: "👾", severity: "catastrophic" },
];

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function getSliceSkips(tiles) { const skips = []; tiles.forEach(t => t.planets.forEach(p => { if (p.techSkip) skips.push(p.techSkip); })); return skips; }

const SKIP_COLORS = { biotic: "#22c55e", warfare: "#ef4444", propulsion: "#3b82f6", cybernetic: "#facc15" };
const SKIP_SHORT = { biotic: "B", warfare: "W", propulsion: "P", cybernetic: "C" };
const SEVERITY_COLORS = { minor: "#4ade80", moderate: "#facc15", major: "#f97316", catastrophic: "#ef4444" };

function buildSlice(blueTiles, redTiles, usedBlue, usedRed, index, minR, maxR, minI, maxI, maxAttempts = 300) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const availBlue = shuffle(blueTiles.filter(t => !usedBlue.has(t.id)));
    const availRed = shuffle(redTiles.filter(t => !usedRed.has(t.id)));
    if (availBlue.length < 3 || availRed.length < 2) return null;
    const picked = [...availBlue.slice(0, 3), ...availRed.slice(0, 2)];
    const totalR = picked.reduce((s, t) => s + t.planets.reduce((ps, p) => ps + p.r, 0), 0);
    const totalI = picked.reduce((s, t) => s + t.planets.reduce((ps, p) => ps + p.i, 0), 0);
    if (totalR >= minR && totalR <= maxR && totalI >= minI && totalI <= maxI) {
      return { id: index + 1, tiles: picked, totalR, totalI, optimal: totalR + totalI, hasWormhole: picked.some(t => t.wormhole), hasAnomaly: picked.some(t => t.anomaly && t.anomaly !== "empty"), hasLegendary: picked.some(t => t.legendary), techSkips: getSliceSkips(picked) };
    }
  }
  const availBlue = shuffle(blueTiles.filter(t => !usedBlue.has(t.id)));
  const availRed = shuffle(redTiles.filter(t => !usedRed.has(t.id)));
  if (availBlue.length < 3 || availRed.length < 2) return null;
  const picked = [...availBlue.slice(0, 3), ...availRed.slice(0, 2)];
  const totalR = picked.reduce((s, t) => s + t.planets.reduce((ps, p) => ps + p.r, 0), 0);
  const totalI = picked.reduce((s, t) => s + t.planets.reduce((ps, p) => ps + p.i, 0), 0);
  return { id: index + 1, tiles: picked, totalR, totalI, optimal: totalR + totalI, hasWormhole: picked.some(t => t.wormhole), hasAnomaly: picked.some(t => t.anomaly && t.anomaly !== "empty"), hasLegendary: picked.some(t => t.legendary), techSkips: getSliceSkips(picked), fallback: true };
}

function StarField() {
  const stars = useMemo(() => Array.from({ length: 120 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2.5 + 0.5, delay: Math.random() * 4, dur: Math.random() * 3 + 2, opacity: Math.random() * 0.5 + 0.3 })), []);
  return (<div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>{stars.map(s => (<div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: "#fff", opacity: s.opacity, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate` }} />))}</div>);
}

function NumberStepper({ label, value, onChange, min = 0, max = 20, color = "#94a3b8" }) {
  return (<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, minWidth: 30 }}>{label}</span>
    <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${color}33`, background: `${color}0a`, color, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 600, color, minWidth: 22, textAlign: "center" }}>{value}</span>
    <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${color}33`, background: `${color}0a`, color, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
  </div>);
}

function FactionModal({ faction, onClose }) {
  if (!faction) return null;
  const cx = ["", "Beginner", "Intermediate", "Advanced"];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", padding: 16, overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(160deg, #0f1729 0%, #1a1040 50%, #0d1117 100%)", border: `1px solid ${faction.color}44`, borderRadius: 16, maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 0 60px ${faction.color}22` }}>
        <div style={{ padding: "28px 32px 20px", borderBottom: `1px solid ${faction.color}33`, background: `linear-gradient(135deg, ${faction.color}18, transparent)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: faction.color, letterSpacing: 1 }}>{faction.name}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#94a3b8", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{faction.tagline}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", width: 36, height: 36, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, background: `${faction.color}22`, color: faction.color, border: `1px solid ${faction.color}44` }}>{cx[faction.complexity]} Complexity</span>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, background: "rgba(250,204,21,0.12)", color: "#facc15", border: "1px solid rgba(250,204,21,0.3)" }}>{faction.commodities} Commodities</span>
          </div>
        </div>
        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#cbd5e1", lineHeight: 1.7, fontStyle: "italic", borderLeft: `3px solid ${faction.color}44`, paddingLeft: 16 }}>{faction.lore}</div>
          {[["Faction Ability", faction.ability], ["Starting Units", faction.startingUnits], ["Starting Technology", faction.startingTech], ["Home System", faction.homeSystem]].map(([l, v]) => (<div key={l}><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: faction.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{l}</div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15, color: "#e2e8f0", lineHeight: 1.6, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>{v}</div></div>))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["Flagship", faction.flagshipName, faction.flagshipStats], ["Mech", faction.mechName, faction.mechAbility]].map(([t, n, d]) => (<div key={t} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: faction.color, letterSpacing: 2, textTransform: "uppercase" }}>{t}</div><div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "#f1f5f9", marginTop: 4 }}>{n}</div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>{d}</div></div>))}
          </div>
          <div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: faction.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Promissory Note</div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>{faction.promissory}</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(74,222,128,0.06)", borderRadius: 10, padding: 14, border: "1px solid rgba(74,222,128,0.15)" }}><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "#4ade80", letterSpacing: 2, textTransform: "uppercase" }}>Strengths</div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: "#a7f3d0", marginTop: 6, lineHeight: 1.5 }}>{faction.strengths}</div></div>
            <div style={{ background: "rgba(239,68,68,0.06)", borderRadius: 10, padding: 14, border: "1px solid rgba(239,68,68,0.15)" }}><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "#ef4444", letterSpacing: 2, textTransform: "uppercase" }}>Weaknesses</div><div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: "#fca5a5", marginTop: 6, lineHeight: 1.5 }}>{faction.weaknesses}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliceCard({ slice, index, drafted, draftedBy, onDraft, showDraft }) {
  const colors = ["#f97316", "#3b82f6", "#a855f7", "#22c55e", "#ef4444", "#eab308", "#ec4899", "#06b6d4", "#14b8a6"];
  const c = colors[index % colors.length];
  return (
    <div style={{ background: drafted ? "rgba(255,255,255,0.02)" : `linear-gradient(160deg, ${c}0a, #0f172a 60%)`, border: `1px solid ${drafted ? "rgba(255,255,255,0.08)" : c + "33"}`, borderRadius: 14, padding: 20, transition: "transform 0.2s, box-shadow 0.2s", opacity: drafted ? 0.5 : 1, position: "relative" }}
      onMouseEnter={e => { if (!drafted) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${c}22`; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      {drafted && <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}>DRAFTED{draftedBy ? ` — ${draftedBy}` : ""}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: drafted ? "#64748b" : c, fontWeight: 700 }}>Slice {slice.id}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {slice.hasWormhole && <span title="Wormhole" style={{ fontSize: 14 }}>🌀</span>}
          {slice.hasAnomaly && <span title="Anomaly" style={{ fontSize: 14 }}>⚠️</span>}
          {slice.hasLegendary && <span title="Legendary" style={{ fontSize: 14 }}>⭐</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <div style={{ background: "rgba(251,191,36,0.12)", padding: "3px 9px", borderRadius: 6, fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>R: {slice.totalR}</div>
        <div style={{ background: "rgba(96,165,250,0.12)", padding: "3px 9px", borderRadius: 6, fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>I: {slice.totalI}</div>
        <div style={{ background: "rgba(167,139,250,0.12)", padding: "3px 9px", borderRadius: 6, fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Σ {slice.optimal}</div>
      </div>
      {slice.techSkips && slice.techSkips.length > 0 && (
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
          {slice.techSkips.map((sk, i) => (<span key={i} style={{ fontSize: 9, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: 1, background: `${SKIP_COLORS[sk]}18`, color: SKIP_COLORS[sk], border: `1px solid ${SKIP_COLORS[sk]}44`, textTransform: "uppercase" }}>{sk}</span>))}
        </div>
      )}
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {slice.tiles.map((t, i) => (<div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: t.back === "blue" ? "#3b82f6" : "#ef4444", opacity: 0.7 }} title={t.back === "blue" ? "Blue tile" : "Red tile"} />))}
        <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'Rajdhani', sans-serif", marginLeft: 4 }}>{slice.tiles.filter(t => t.back === "blue").length}B / {slice.tiles.filter(t => t.back === "red").length}R</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {slice.tiles.map((tile, i) => {
          const skips = tile.planets.filter(p => p.techSkip).map(p => p.techSkip);
          return (<div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 7, padding: "7px 10px", border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontFamily: "'Rajdhani', sans-serif", borderLeft: `3px solid ${tile.back === "blue" ? "#3b82f644" : "#ef444444"}` }}>
            {tile.planets.length > 0 ? (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#e2e8f0" }}>
                {tile.planets.map(p => p.name).join(" / ")}
                {tile.anomaly && tile.anomaly !== "empty" && <span style={{ color: "#f97316", fontSize: 10, marginLeft: 4 }}>({tile.anomaly.replace(/-/g, " ")})</span>}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {skips.map((sk, j) => (<span key={j} style={{ fontSize: 9, fontWeight: 700, color: SKIP_COLORS[sk], background: `${SKIP_COLORS[sk]}18`, padding: "1px 4px", borderRadius: 3 }}>{SKIP_SHORT[sk]}</span>))}
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{tile.planets.map(p => `${p.r}/${p.i}`).join(", ")}</span>
              </div>
            </div>) : (<span style={{ color: tile.anomaly === "empty" ? "#64748b" : tile.wormhole ? "#a78bfa" : tile.anomaly === "gravity-rift" ? "#f97316" : tile.anomaly === "nebula" ? "#818cf8" : tile.anomaly === "supernova" ? "#ef4444" : "#94a3b8" }}>{tile.anomaly === "empty" ? (tile.wormhole ? `Empty Space (${tile.wormhole} wormhole)` : "Empty Space") : (tile.anomaly || "empty").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}{tile.wormhole && tile.anomaly !== "empty" && !tile.anomaly?.includes("wormhole") ? ` (${tile.wormhole})` : ""}</span>)}
          </div>);
        })}
      </div>
      {showDraft && !drafted && (<button onClick={onDraft} style={{ marginTop: 12, width: "100%", padding: "8px 0", borderRadius: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: 12, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase", transition: "all 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.22)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(74,222,128,0.12)"}>Draft Slice</button>)}
      {slice.fallback && (<div style={{ marginTop: 8, fontSize: 10, color: "#f97316", fontFamily: "'Rajdhani', sans-serif", fontStyle: "italic" }}>⚠ Generated outside R/I bounds (insufficient tiles)</div>)}
    </div>
  );
}

function FactionCard({ faction, onClick, drafted, draftedBy }) {
  return (
    <div onClick={drafted ? undefined : onClick} style={{ background: drafted ? "rgba(255,255,255,0.02)" : `linear-gradient(160deg, ${faction.color}12, #0f172a 70%)`, border: `1px solid ${drafted ? "rgba(255,255,255,0.08)" : faction.color + "44"}`, borderRadius: 12, padding: "14px 16px", cursor: drafted ? "default" : "pointer", transition: "all 0.2s", opacity: drafted ? 0.45 : 1, position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { if (!drafted) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${faction.color}22`; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      {drafted && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}>DRAFTED{draftedBy ? ` — ${draftedBy}` : ""}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${faction.color}22`, border: `1px solid ${faction.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel', serif", fontSize: 16, color: faction.color, fontWeight: 700, flexShrink: 0 }}>{faction.name.charAt(faction.name.indexOf(" ") > -1 ? faction.name.indexOf(" ") + 1 : 0)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: drafted ? "#64748b" : "#f1f5f9", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{faction.name}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "#64748b", letterSpacing: 1, textTransform: "uppercase" }}>{faction.tagline}</div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div style={{ background: `linear-gradient(160deg, ${SEVERITY_COLORS[event.severity]}08, #0f172a 60%)`, border: `1px solid ${SEVERITY_COLORS[event.severity]}33`, borderRadius: 14, padding: 20, transition: "transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 26 }}>{event.icon}</span><div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: "#f1f5f9", fontWeight: 600 }}>{event.name}</div></div>
        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, textTransform: "uppercase", background: `${SEVERITY_COLORS[event.severity]}18`, color: SEVERITY_COLORS[event.severity], border: `1px solid ${SEVERITY_COLORS[event.severity]}33` }}>{event.severity}</span>
      </div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>{event.desc}</div>
    </div>
  );
}

export default function TI4MiltyDraft() {
  const [playerCount, setPlayerCount] = useState(6);
  const [minR, setMinR] = useState(3); const [maxR, setMaxR] = useState(12);
  const [minI, setMinI] = useState(3); const [maxI, setMaxI] = useState(12);
  const [slices, setSlices] = useState([]);
  const [factionPool, setFactionPool] = useState([]);
  const [draftedFactions, setDraftedFactions] = useState({});
  const [draftedSlices, setDraftedSlices] = useState({});
  const [events, setEvents] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [activeTab, setActiveTab] = useState("slices");
  const [draftStarted, setDraftStarted] = useState(false);
  const [currentDraftPlayer, setCurrentDraftPlayer] = useState(1);
  const [genError, setGenError] = useState(null);

  const generateDraft = useCallback(() => {
    setGenError(null);
    const numSlices = playerCount + 1;
    const usedBlue = new Set(); const usedRed = new Set();
    const newSlices = [];
    for (let i = 0; i < numSlices; i++) {
      const slice = buildSlice(BLUE_TILES, RED_TILES, usedBlue, usedRed, i, minR, maxR, minI, maxI);
      if (!slice) { setGenError(`Could not generate ${numSlices} slices. Try widening R/I range or reducing players.`); break; }
      slice.tiles.forEach(t => { if (t.back === "blue") usedBlue.add(t.id); else usedRed.add(t.id); });
      newSlices.push(slice);
    }
    if (newSlices.length > 0) {
      setSlices(newSlices);
      setFactionPool(shuffle(FACTIONS).slice(0, Math.min(playerCount + 3, FACTIONS.length)));
      setDraftedFactions({}); setDraftedSlices({}); setCurrentDraftPlayer(1); setDraftStarted(true);
      setEvents(shuffle(GALACTIC_EVENTS).slice(0, 3)); setActiveTab("slices");
    }
  }, [playerCount, minR, maxR, minI, maxI]);

  const draftFaction = (f) => { if (draftedFactions[f.id]) return; setDraftedFactions(p => ({ ...p, [f.id]: `P${currentDraftPlayer}` })); setCurrentDraftPlayer(p => p < playerCount ? p + 1 : p); };
  const draftSlice = (id) => { if (draftedSlices[id]) return; setDraftedSlices(p => ({ ...p, [id]: `P${currentDraftPlayer}` })); setCurrentDraftPlayer(p => p < playerCount ? p + 1 : p); };
  const rollNewEvents = () => setEvents(shuffle(GALACTIC_EVENTS).slice(0, 3));
  const tabs = [{ id: "slices", label: "Map Slices", icon: "⬡" }, { id: "factions", label: "Faction Pool", icon: "⚔" }, { id: "events", label: "Galactic Events", icon: "🌌" }, { id: "all", label: "All Factions", icon: "📖" }];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #030712 0%, #0c0a1e 30%, #0a0f1f 60%, #050a14 100%)", color: "#e2e8f0", position: "relative", fontFamily: "'Rajdhani', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital@0;1&family=Rajdhani:wght@300;400;500;600;700&display=swap');@keyframes twinkle{from{opacity:0.2}to{opacity:0.8}}@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#334155 transparent}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}`}</style>
      <StarField />
      <div style={{ position: "relative", zIndex: 10, padding: "36px 32px 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, letterSpacing: 6, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Twilight Imperium IV</div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2 }}>MILTY DRAFT</h1>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#475569", marginTop: 4, letterSpacing: 2 }}>SLICE GENERATOR • FACTION POOL • GALACTIC EVENTS</div>
      </div>
      <div style={{ position: "relative", zIndex: 10, padding: "24px 32px 8px", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 13, color: "#94a3b8", letterSpacing: 1 }}>PLAYERS</label>
          <div style={{ display: "flex", gap: 4 }}>
            {[3, 4, 5, 6, 7, 8].map(n => (<button key={n} onClick={() => setPlayerCount(n)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid", borderColor: playerCount === n ? "#f59e0b" : "rgba(255,255,255,0.1)", background: playerCount === n ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)", color: playerCount === n ? "#fbbf24" : "#94a3b8", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 600, transition: "all 0.15s" }}>{n}</button>))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#fbbf24", letterSpacing: 2, fontWeight: 600 }}>RESOURCES / SLICE</span>
            <NumberStepper label="Min" value={minR} onChange={setMinR} max={maxR} color="#fbbf24" />
            <NumberStepper label="Max" value={maxR} onChange={setMaxR} min={minR} color="#fbbf24" />
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#60a5fa", letterSpacing: 2, fontWeight: 600 }}>INFLUENCE / SLICE</span>
            <NumberStepper label="Min" value={minI} onChange={setMinI} max={maxI} color="#60a5fa" />
            <NumberStepper label="Max" value={maxI} onChange={setMaxI} min={minI} color="#60a5fa" />
          </div>
        </div>
        <button onClick={generateDraft} style={{ padding: "10px 28px", borderRadius: 10, border: "1px solid #f59e0b55", background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.12))", color: "#fbbf24", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1, transition: "all 0.2s", alignSelf: "center" }}
          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.28), rgba(217,119,6,0.2))"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.12))"; e.currentTarget.style.boxShadow = ""; }}>
          {draftStarted ? "⟳ Regenerate Draft" : "✦ Generate Draft"}
        </button>
      </div>
      {genError && <div style={{ position: "relative", zIndex: 10, margin: "8px 32px", padding: "10px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", fontSize: 13, fontFamily: "'Rajdhani', sans-serif" }}>{genError}</div>}
      {draftStarted && <div style={{ position: "relative", zIndex: 10, padding: "12px 32px 0", display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
        {tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", borderRadius: "10px 10px 0 0", border: "1px solid", borderBottom: "none", borderColor: activeTab === tab.id ? "rgba(255,255,255,0.15)" : "transparent", background: activeTab === tab.id ? "rgba(255,255,255,0.06)" : "transparent", color: activeTab === tab.id ? "#f1f5f9" : "#64748b", fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, cursor: "pointer", transition: "all 0.15s" }}><span style={{ marginRight: 6 }}>{tab.icon}</span>{tab.label}</button>))}
      </div>}
      {draftStarted && <div style={{ position: "relative", zIndex: 10, margin: "0 32px", padding: "10px 20px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: "#60a5fa", fontWeight: 600 }}>Now Drafting: Player {currentDraftPlayer} of {playerCount}</div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, fontFamily: "'Rajdhani', sans-serif", color: "#94a3b8" }}>
          <span>Slices: {Object.keys(draftedSlices).length}/{playerCount}</span>
          <span>Factions: {Object.keys(draftedFactions).length}/{playerCount}</span>
        </div>
      </div>}
      {draftStarted && <div style={{ position: "relative", zIndex: 10, margin: "0 32px 32px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0 0 14px 14px", padding: 24, minHeight: 300, animation: "slideUp 0.3s ease-out" }}>
        {activeTab === "slices" && <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 18 }}>Map Slices <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Rajdhani', sans-serif" }}>({slices.length} slices — 3 <span style={{ color: "#3b82f6" }}>blue</span> (planet) + 2 <span style={{ color: "#ef4444" }}>red</span> (anomaly/empty) each — R: {minR}–{maxR}, I: {minI}–{maxI})</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>{slices.map((s, i) => <SliceCard key={s.id} slice={s} index={i} showDraft={true} drafted={!!draftedSlices[s.id]} draftedBy={draftedSlices[s.id]} onDraft={() => draftSlice(s.id)} />)}</div>
        </div>}
        {activeTab === "factions" && <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 18 }}>Faction Pool <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Rajdhani', sans-serif" }}>({factionPool.length} factions — click to view details)</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>{factionPool.map(f => <div key={f.id} style={{ position: "relative" }}><FactionCard faction={f} onClick={() => setSelectedFaction(f)} drafted={!!draftedFactions[f.id]} draftedBy={draftedFactions[f.id]} />{!draftedFactions[f.id] && <button onClick={e => { e.stopPropagation(); draftFaction(f); }} style={{ position: "absolute", bottom: 10, right: 10, padding: "4px 12px", borderRadius: 6, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: 10, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" }}>Draft</button>}</div>)}</div>
        </div>}
        {activeTab === "events" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#f1f5f9" }}>Galactic Events</div>
            <button onClick={rollNewEvents} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.12)", color: "#a78bfa", fontFamily: "'Rajdhani', sans-serif", fontSize: 13, cursor: "pointer", letterSpacing: 1 }}>⟳ Roll New Events</button>
          </div>
          <div style={{ display: "grid", gap: 14 }}>{events.map((e, i) => <EventCard key={i} event={e} />)}</div>
        </div>}
        {activeTab === "all" && <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#f1f5f9", marginBottom: 18 }}>All Factions Reference <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Rajdhani', sans-serif" }}>(click any for details)</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>{FACTIONS.map(f => <FactionCard key={f.id} faction={f} onClick={() => setSelectedFaction(f)} />)}</div>
        </div>}
      </div>}
      {!draftStarted && <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "60px 32px", animation: "pulse 3s ease-in-out infinite" }}><div style={{ fontSize: 48, marginBottom: 16 }}>⬡</div><div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "#475569" }}>Select player count, set R/I bounds, and generate your draft</div></div>}
      <FactionModal faction={selectedFaction} onClose={() => setSelectedFaction(null)} />
    </div>
  );
}
