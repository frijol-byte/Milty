# TI4 Milty Draft Tool

A web-based Milty-style draft tool for **Twilight Imperium 4th Edition** (with Prophecy of Kings). Designed to be hosted on GitHub Pages.

## Features

### Map Slice Generator
- Generates **N+1 slices** for the number of players selected (3–8)
- Each slice shows 5 system tiles with total Resources, Influence, and combined value
- Visual indicators for wormholes, anomalies, and legendary planets
- Color-coded slice cards for easy differentiation

### Faction Draft Pool
- Randomizes **N+3 factions** from all 24 base + PoK factions
- Draft tracking with player assignment (Player 1 through N)
- Click any faction card to open a **detailed info modal** with:
  - Faction ability, starting units, starting tech, home system
  - Flagship name and stats
  - Mech name and ability
  - Promissory note
  - Lore and flavor text
  - Strengths and weaknesses analysis
  - Complexity rating and commodity count

### Galactic Event Randomizer
- Draws 3 random events from a pool of 18 custom galactic events
- Events are severity-rated: Minor, Moderate, Major, Catastrophic
- Re-roll button for fresh events each round

### All Factions Reference
- Complete browsable reference of all 24 factions
- Click any faction for full detailed breakdown

## Factions Included

All base game and Prophecy of Kings factions:

| Base Game | Prophecy of Kings |
|-----------|-------------------|
| The Arborec | The Titans of Ul |
| The Barony of Letnev | The Nomad |
| The Clan of Saar | The Mahact Gene-Sorcerers |
| The Emirates of Hacan | The Naaz-Rokha Alliance |
| The Federation of Sol | The Argent Flight |
| The Ghosts of Creuss | The Vuil'raith Cabal |
| The L1Z1X Mindnet | The Empyrean |
| The Mentak Coalition | The Council Keleres |
| The Naalu Collective | |
| The Nekro Virus | |
| Sardakk N'orr | |
| The Universities of Jol-Nar | |
| The Winnu | |
| The Xxcha Kingdom | |
| The Yin Brotherhood | |
| The Embers of Muaat | |

## Deployment

### GitHub Pages

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Set source to the `main` branch, root directory
4. Your draft tool will be live at `https://<username>.github.io/<repo-name>/`

### Local

Simply open `index.html` in any modern browser. No build step or server required.

## Tech Stack

- **React 18** (via CDN)
- **Babel** (for in-browser JSX transpilation)
- Pure CSS with inline styles — no external CSS frameworks
- Zero dependencies beyond React

## How Milty Draft Works

1. **Select player count** (3–8 players)
2. **Generate Draft** — creates slices and faction pool
3. Players draft in order, selecting:
   - A **map slice** (their section of the galaxy)
   - A **faction** from the randomized pool
   - A **speaker order** position
4. Use **Galactic Events** for optional house-rule flavor

## License

This is a fan-made tool for Twilight Imperium 4th Edition by Fantasy Flight Games. Twilight Imperium is a trademark of Fantasy Flight Games. This tool is not affiliated with or endorsed by Fantasy Flight Games.
