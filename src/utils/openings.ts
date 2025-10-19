import { Chess } from 'chess.js';

interface OpeningInfo {
  name: string;
  eco: string; // Encyclopedia of Chess Openings code
}

/**
 * Common chess openings database with their ECO codes and first moves
 */
const openingsDatabase: { [key: string]: OpeningInfo } = {
  'e2e4': { name: "King's Pawn Opening", eco: 'B00' },
  'e2e4 e7e5': { name: "King's Pawn Game", eco: 'C20' },
  'e2e4 c7c5': { name: 'Sicilian Defense', eco: 'B20' },
  'e2e4 e7e6': { name: 'French Defense', eco: 'C00' },
  'e2e4 c7c6': { name: 'Caro-Kann Defense', eco: 'B10' },
  'e2e4 d7d5': { name: 'Scandinavian Defense', eco: 'B01' },
  'e2e4 g8f6': { name: "Alekhine's Defense", eco: 'B02' },
  'e2e4 d7d6': { name: 'Pirc Defense', eco: 'B07' },
  'd2d4': { name: "Queen's Pawn Opening", eco: 'A40' },
  'd2d4 d7d5': { name: "Queen's Pawn Game", eco: 'D00' },
  'd2d4 g8f6': { name: 'Indian Defense', eco: 'A45' },
  'd2d4 d7d5 c2c4': { name: "Queen's Gambit", eco: 'D06' },
  'd2d4 g8f6 c2c4': { name: 'Indian Game', eco: 'E00' },
  'd2d4 g8f6 c2c4 e7e6': { name: "Queen's Indian Defense", eco: 'E12' },
  'd2d4 g8f6 c2c4 g7g6': { name: "King's Indian Defense", eco: 'E60' },
  'd2d4 g8f6 c2c4 c7c5': { name: 'Benoni Defense', eco: 'A56' },
  'c2c4': { name: 'English Opening', eco: 'A10' },
  'g1f3': { name: 'Réti Opening', eco: 'A04' },
  'g1f3 d7d5 c2c4': { name: 'Réti Opening', eco: 'A09' },
  'e2e4 e7e5 g1f3': { name: "King's Knight Opening", eco: 'C40' },
  'e2e4 e7e5 g1f3 b8c6': { name: "King's Knight Opening", eco: 'C40' },
  'e2e4 e7e5 g1f3 b8c6 f1b5': { name: 'Ruy Lopez', eco: 'C60' },
  'e2e4 e7e5 g1f3 b8c6 f1c4': { name: 'Italian Game', eco: 'C50' },
  'e2e4 e7e5 g1f3 b8c6 d2d4': { name: 'Scotch Game', eco: 'C44' },
  'e2e4 e7e5 f2f4': { name: "King's Gambit", eco: 'C30' },
  'e2e4 c7c5 g1f3': { name: 'Sicilian Defense: Open', eco: 'B20' },
  'e2e4 c7c5 g1f3 d7d6': { name: 'Sicilian Defense: Najdorf Variation', eco: 'B90' },
  'e2e4 c7c5 c2c3': { name: 'Sicilian Defense: Alapin Variation', eco: 'B22' },
  'd2d4 d7d5 c2c4 e7e6': { name: "Queen's Gambit Declined", eco: 'D30' },
  'd2d4 d7d5 c2c4 d5c4': { name: "Queen's Gambit Accepted", eco: 'D20' },
  'd2d4 d7d5 c2c4 c7c6': { name: 'Slav Defense', eco: 'D10' },
  'd2d4 g8f6 c2c4 e7e6 g1f3': { name: "Queen's Indian Defense", eco: 'E12' },
  'd2d4 g8f6 c2c4 g7g6 b1c3 f8g7': { name: "King's Indian Defense", eco: 'E60' },
  'b2b3': { name: 'Nimzowitsch-Larsen Attack', eco: 'A01' },
  'f2f4': { name: 'Bird Opening', eco: 'A02' },
  'b1c3': { name: 'Van Geet Opening', eco: 'A00' },
};

/**
 * Detects the opening name from a PGN string or move sequence
 * @param pgn - The PGN string of the game
 * @returns OpeningInfo object with name and ECO code, or null if not found
 */
export const detectOpening = (pgn: string): OpeningInfo | null => {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    const history = chess.history({ verbose: true });
    
    // Try to match increasingly longer sequences
    let moveSequence = '';
    let lastMatch: OpeningInfo | null = null;
    
    for (let i = 0; i < Math.min(history.length, 10); i++) {
      const move = history[i];
      moveSequence += (i > 0 ? ' ' : '') + move.from + move.to;
      
      if (openingsDatabase[moveSequence]) {
        lastMatch = openingsDatabase[moveSequence];
      }
    }
    
    return lastMatch;
  } catch (error) {
    console.error('Error detecting opening:', error);
    return null;
  }
};

/**
 * Gets a short description of the opening
 * @param openingName - The name of the opening
 * @returns A brief description of the opening's characteristics
 */
export const getOpeningDescription = (openingName: string): string => {
  const descriptions: { [key: string]: string } = {
    'Sicilian Defense': 'An aggressive defense leading to sharp, tactical positions.',
    'French Defense': 'A solid defense focusing on pawn structure and space.',
    'Caro-Kann Defense': 'A reliable defense with a solid pawn structure.',
    'Ruy Lopez': 'One of the oldest and most classical openings.',
    'Italian Game': 'Focuses on quick development and central control.',
    "King's Indian Defense": 'A hypermodern defense allowing White central control initially.',
    "Queen's Gambit": 'A classical opening offering a pawn for central control.',
    'English Opening': 'A flexible opening controlling the center from the flank.',
  };
  
  for (const [key, desc] of Object.entries(descriptions)) {
    if (openingName.includes(key)) {
      return desc;
    }
  }
  
  return 'A chess opening with its own strategic ideas.';
};
