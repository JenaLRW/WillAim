# WillAim - School Archery Score Keeper

A mobile archery scoring app built for school NASP-style competitions. Track players, run tournaments, and record scores with an interactive archery target — all from your phone.

Built with React Native and Expo. Runs on iOS and Android via [Expo Go](https://expo.dev/go).

---

## Features

### Player Management
- Create player profiles with name, grade (3rd–12th + Adult), and avatar
- View player statistics: best score, average, total tournaments
- Browse full score history per player
- Delete individual scores from history

### Tournament Scoring
- Select one or more players for a tournament
- Score at two distances: **10 meters** and **15 meters**
- 3 rounds of 5 arrows per distance (30 total shots, max score 300)
- Tap the interactive archery target to record each shot (rings 1–10 or Miss)
- Live score grid shows every shot, round totals, and grand total
- Confirm scores after each distance before moving on
- Switch between players mid-tournament using tabs

### Interactive Archery Target
- Full SVG archery target with 10 scoring rings
- Tap any ring to record that score instantly
- Miss button for arrows off-target
- Score labels on each ring for easy identification

### Celebrations
- Trophy animation and confetti when a player completes their tournament
- Final score breakdown showing 10m and 15m totals

### Data Storage
- All data stored locally on your device
- No account or internet connection required
- Player and score data persists between sessions

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)

### Installation

```bash
# Clone the repo
git clone https://github.com/JenaLRW/WillAim.git
cd WillAim

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

1. Run `npx expo start` in your terminal
2. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)
3. The app will load on your device

---

## How to Use

### Adding Players
1. Tap **PLAYERS** on the home screen
2. Tap **+ ADD** in the top right
3. Enter the player's name, select their grade, and pick an avatar
4. Tap **CREATE PLAYER**

### Running a Tournament
1. Tap **NEW TOURNAMENT** on the home screen
2. Select one or more players by tapping their cards
3. Tap **START** in the top right
4. For each player:
   - Tap the archery target to record each arrow's score
   - After 15 shots (3 rounds × 5 arrows), confirm the 10-meter score
   - Repeat for 15 meters
   - Celebrate with confetti!
5. Switch between players using the tabs at the top
6. When all players finish, you'll return to the home screen

### Quick Shoot
- Open any player's profile and tap **SHOOT** to start a single-player tournament directly

### Viewing Stats
- Tap any player card to see their profile
- View their best score, average, and tournament count
- Scroll through their complete score history

---

## Project Structure

```
app/                        # Screens (Expo Router)
  index.tsx                 # Home screen
  players/
    index.tsx               # Player list
    add.tsx                 # Add player form
    [id].tsx                # Player profile & stats
  tournament/
    select.tsx              # Select players for tournament
    scoring.tsx             # Scoring screen

src/
  components/               # Reusable UI components
  constants/                # Theme colors & scoring rules
  hooks/                    # Data & scoring engine hooks
  store/                    # Local storage (AsyncStorage)
  utils/                    # Helper functions
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Expo](https://expo.dev/) (SDK 55) | App framework & development tooling |
| [React Native](https://reactnative.dev/) | Cross-platform mobile UI |
| [Expo Router](https://docs.expo.dev/router/) | File-based navigation |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Local data persistence |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Interactive archery target |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Smooth animations |

---

## Standard School Archery Scoring Rules

These rules align with standard NASP tournament formats.

- **Distances**: 10 meters and 15 meters
- **Rounds**: 3 rounds per distance
- **Arrows**: 5 arrows per round
- **Scoring**: Rings score 1–10 (outer to inner), Miss scores 0
- **Total**: 30 arrows, maximum possible score of **300**

---

## Disclaimer

WillAim is not affiliated with, endorsed by, or sponsored by the National Archery in the Schools Program (NASP). NASP is a registered trademark of the National Archery in the Schools Program.

## License

This project is open source. Feel free to use and modify it for your archery program.
