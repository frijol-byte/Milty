# TI4 Milty Draft Tool

A web-based Milty-style draft tool for **Twilight Imperium 4th Edition** (with Prophecy of Kings). Designed to be hosted on GitHub Pages.

## Features

### Map Slice Generator
- Generates **N+1 slices** for the number of players selected (3–8)
- Each slice is built from exactly **3 blue-backed tiles** (planet tiles — cultural, industrial, hazardous) and **2 red-backed tiles** (anomalies and empty space)
- Configurable **per-slice resource and influence minimums/maximums** via stepper controls
- Each slice summary shows total Resources, Influence, combined value, and **tech skip specialties** (Biotic, Warfare, Propulsion, Cybernetic)
- Visual indicators for wormholes, anomalies, and legendary planets
- Red tiles with planets in anomalies (e.g. Cormund in nebula, Everra in asteroid field) display both planet stats and anomaly type
- Color-coded tile composition dots (blue/red) on every slice card

### Slice Drafting
- Each slice has a **Draft Slice** button for players to claim
- Drafting tracks which player claimed each slice
- Status bar shows slice and faction draft progress
- Drafted slices dim and display the drafting player

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

## Tile Classification

Tiles are classified according to the official TI4 rules:

| Back Color | Contains | Examples |
|------------|----------|---------|
| **Blue** | All planet tiles (cultural, industrial, hazardous) | Bereg/Lirta IV, Mecatol adjacents, tech skip planets |
| **Red** | Anomalies (nebula, asteroid field, supernova, gravity rift) and empty space/frontier tiles | Also includes PoK anomaly-planet combos like Cormund (nebula) and Everra (asteroid field) |

### Tile Counts
- **28 blue-backed** planet tiles (supports up to 9 slices × 3 = 27 needed for 8 players)
- **19 red-backed** anomaly/empty tiles (supports up to 9 slices × 2 = 18 needed for 8 players)

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

1. **Set player count** (3–8 players)
2. **Configure R/I bounds** — set minimum and maximum resources/influence per slice
3. **Generate Draft** — creates slices (3 blue + 2 red each) and faction pool
4. Players draft in order, selecting:
   - A **map slice** (their section of the galaxy) via the Draft Slice button
   - A **faction** from the randomized pool via the Draft button
   - A **speaker order** position (tracked externally)
5. Use **Galactic Events** for optional house-rule flavor

## Files

| File | Purpose |
|------|---------|
| `index.html` | Standalone app for GitHub Pages (zero build step) |
| `ti4-milty-draft.jsx` | React component source (for use in React projects) |
| `README.md` | This file |

## License

This is a fan-made tool for Twilight Imperium 4th Edition by Fantasy Flight Games. Twilight Imperium is a trademark of Fantasy Flight Games. This tool is not affiliated with or endorsed by Fantasy Flight Games.
