# charity-water-prototype
# CAPTAIN H₂O × charity: water — README PROMPT

---

## Project Overview

**Captain H₂O** is an interactive web-based game developed in partnership with charity: water to raise awareness about global water contamination and the importance of clean water access. Players take on the role of a water purifier, slicing H₂O molecules while avoiding dangerous toxins. The game combines simple, addictive mechanics with real-world education about water contaminants and charity: water's mission.

---

## Game Concept

Captain H₂O transforms the abstract concept of water purification into a tangible, satisfying gameplay experience. Players swipe or click-drag across the screen to slice H₂O molecules, collecting clean water droplets in charity: water's iconic Jerry Can. Each successful slice fills the can, increases the player's oxygen supply, and adds to their "Liters Saved" total. Slicing toxins or letting them escape costs lives and contaminates the village below.

The game progresses through 10 levels, each introducing a new water contaminant with accompanying educational facts. As players advance, molecules move faster and toxins appear more frequently, increasing the challenge. Completing all levels reveals the player's total impact – translated into real-world metrics like "days of clean water for one person."

---

## Brand Integration (charity: water)

This game is built around charity: water's brand guidelines and visual identity:

- **Jerry Can**: The central collection vessel appears as the standalone Jerry Can mark – always yellow, always proportional, never modified
- **Photography**: Real charity: water images serve as backgrounds, with clean and dirty water sources shown side-by-side during level transitions
- **Logo Usage**: The stacked logo lockup (Jerry Can + "charity: water") appears on title and end screens; partner lockups include your organization's logo alongside charity: water's
- **Color Palette**: Primary accent color is Jerry Can Yellow with rich earth tones and soft blues from the brand palette
- **Respectful Representation**: Player UI never covers faces in photos; people remain the focal point with dignity
- **Typography**: Brand fonts used for all text (fallback to clean sans-serif)
- **Photo Integrity**: All images are used as-is without filters or color overlays

---

## Features

### Core Gameplay

- **Slice Mechanic**: Swipe on mobile or click-drag on desktop to cut molecules
- **Dual Objective**: Collect H₂O molecules while avoiding toxins
- **Resource Management**: Balance oxygen levels, lives, and Jerry Can fill percentage
- **Progressive Difficulty**: 10 levels with increasing speed and toxin ratio

### Educational Elements

- **Contaminant Library**: Each level introduces a real water contaminant (Lead, Arsenic, E. coli, etc.)
- **Fun Facts**: Educational tidbits appear during gameplay and level transitions
- **Visual Storytelling**: Side-by-side photos show dirty and clean water sources
- **Impact Translation**: End screen converts Liters Saved into real-world impact metrics

### Visual & Audio Feedback

- **Satisfying Splash**: H₂O slices trigger yellow sparkle effects and gentle splash sounds
- **Warning Signals**: Toxin slices trigger red flashes, screen shake, and harsh buzz sounds
- **Oxygen Alert**: Low oxygen triggers flashing red bar and heartbeat audio
- **Level Complete**: Golden glow around Jerry Can with triumphant chimes
- **End Screens**: Respectful photography with clear calls to action

### Sharing & Donation Integration

- **Score Sharing**: Players can share their total Liters Saved on social media
- **Donation Link**: Direct button to charity: water's donation page
- **Learn More**: Links to charity: water's website for deeper education

---

## Technical Specifications

### Platforms
- **Web Browser**: Playable on desktop and mobile browsers
- **Responsive**: Adapts to 16:9 (desktop) and 9:16 (mobile) aspect ratios

### Controls
| Platform | Action | Control |
|----------|--------|---------|
| Mobile | Slice | Swipe finger across screen |
| Desktop | Slice | Click and drag mouse |
| Both | Pause | Tap pause icon or press SPACE |
| Both | Restart Level | Tap restart icon or press R |
| Desktop | Quit to Menu | Press ESC |

### Core Variables
- **Oxygen**: Starts at 100%, decreases by 1% every 2 seconds, +2% per H₂O sliced
- **Lives**: Starts at 3, -1 per toxin sliced or escaped
- **Liters Saved**: +1 per H₂O sliced (persists across levels)
- **Jerry Can Fill**: Starts at 0%, +5-8% per H₂O sliced, 100% completes level
- **Level**: 1-10, increases difficulty with speed and toxin ratio

### Spawning Logic
- **Frequency**: New molecule every 1.5-3 seconds
- **Toxin Ratio**: Starts at 20%, increases to 50% by Level 10
- **Speed**: Starts at 3 seconds to cross screen, decreases to 1 second by Level 10

### Asset Requirements

| Asset Type | Format | Notes |
|------------|--------|-------|
| Background Photos | JPG | Real charity: water images, unedited, faces visible |
| Jerry Can | PNG/SVG | Standalone mark, yellow, exact proportions |
| Stacked Logo | PNG/SVG | Jerry Can + "charity: water" |
| Horizontal Logo | PNG/SVG | For partner lockups |
| H₂O Molecule | PNG | Yellow oxygen + 2 white hydrogens |
| Toxin Sprites | PNG | Earth-tone colors matching contaminant |
| UI Elements | PNG | Buttons, icons, bars |
| Audio Files | MP3/WAV | Splash, buzz, chimes, heartbeat |

---

## Level Progression

| Level | Contaminant | Toxin Color | Toxin Ratio | Speed | Fun Fact |
|-------|-------------|-------------|-------------|-------|----------|
| 1 | Sediment/Dirt | Brown | 20% | Slow | Dirt makes water cloudy but is easy to filter |
| 2 | Chlorine | Green-yellow | 25% | Slow | Too much chlorine hurts your stomach |
| 3 | Lead | Dark grey | 30% | Slow-Med | Lead damages children's brains |
| 4 | Microplastics | Blue-white speckled | 30% | Medium | Plastic is in 90% of bottled water |
| 5 | Arsenic | Orange-red | 35% | Medium | Arsenic has no taste but is poisonous |
| 6 | E. coli | Green | 40% | Medium | E. coli causes deadly diarrhea |
| 7 | Nitrates | Purple | 45% | Med-Fast | Nitrates from farms pollute rivers |
| 8 | Mercury | Silver | 45% | Fast | Mercury damages your nervous system |
| 9 | Pesticides | Yellow-green | 50% | Fast | Pesticides cause cancer over time |
| 10 | Multiple (Boss) | All colors | 60% | Very Fast | Clean water is a human right |

---

## Screen Flow

### 1. Title Screen
- charity: water stacked logo (centered)
- Real charity: water photo background (sky/ground, no faces)
- "CAPTAIN H₂O" subtitle (brand yellow)
- PLAY button (Jerry Can Yellow)
- LEARN MORE button (links to charity:water)
- Partner lockup (your org + charity: water) at bottom

### 2. Gameplay Screen
- Top bar: Oxygen meter, Lives, Liters Saved
- Center: Real charity: water photo (faces visible, UI never covers people)
- Floating molecules: H₂O (yellow + white) and toxins (earth-tones)
- Bottom bar: Jerry Can (fill level), instructional text

### 3. Level Complete Screen
- Side-by-side photos: Dirty water source (left) + Clean water source (right)
- "LEVEL [X] COMPLETE! You removed [CONTAMINANT]!"
- Fun fact about contaminant
- CONTINUE button (Jerry Can Yellow)

### 4. Game Over Screen
- Real charity: water photo (dirty water source, respectful)
- "GAME OVER" with total Liters Saved
- TRY AGAIN button (Jerry Can Yellow)
- LEARN MORE button (links to charity:water)

### 5. Game Complete Screen
- Real charity: water photo (person drinking clean water, face visible, dignified)
- Trophy icon + "YOU DID IT! CAPTAIN H₂O!"
- Total Liters Saved + impact translation
- PLAY AGAIN, SHARE SCORE, and DONATE buttons
- charity: water stacked logo + partner lockup

---

## Brand Compliance Checklist

- [ ] Logo never split onto two lines
- [ ] Jerry Can proportions never modified
- [ ] Jerry Can always yellow
- [ ] Photos never filtered or edited
- [ ] Faces never covered by UI
- [ ] Clean and dirty water shown together in transitions
- [ ] Text always legible on solid backgrounds
- [ ] Respectful representation of people at all times
- [ ] Partner lockup follows spacing guidelines
- [ ] All links direct to charity: water's official website

---

## Development Notes

### Recommended Engines
- **Unity**: For polished WebGL builds
- **Phaser.js**: For lightweight HTML5 browser games
- **Construct 3**: For no-code/low-code development

### Performance Targets
- 60fps on modern browsers
- <5 second load time
- Mobile-friendly touch controls
- Responsive to window resizing

### Testing Focus Areas
- Touch responsiveness on various devices
- Screen shake intensity (should not cause motion sickness)
- Audio feedback clarity
- Photo loading and caching
- Level progression and save states
- Social sharing functionality

---

## Call to Action

This game is designed to be a powerful engagement tool for charity: water. We recommend:

1. **Embedding** on the charity: water website
2. **Sharing** via social media campaigns
3. **Featuring** at events and fundraisers
4. **Leveraging** as an educational resource for schools
5. **Using** the share functionality to drive donations

---

## License & Attribution

This game includes proprietary charity: water brand assets including:
- Jerry Can mark
- charity: water logos (stacked and horizontal)
- charity: water photography library
- Brand color palette

All charity: water assets are used with permission and in accordance with the charity: water Brand Usage Guide. For questions about asset usage, please contact the charity: water brand team.

