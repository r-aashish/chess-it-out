# ChessItOut

ChessItOut is a web application that allows users to analyze chess.com profiles, explore game histories, and dive into detailed game analysis.

## Features

- **Profile Analysis:** Search for chess.com players and view their profile information, including username, avatar, and rating.
- **Game History:** Browse through a player's game history and select a game to analyze.
- **Advanced Game Filtering:** 
  - Search games by opponent name
  - Filter by game result (wins, losses, draws)
  - Filter by time control (bullet, blitz, rapid, daily)
- **Detailed Game Analysis:**
  - Interactive chessboard display with move highlighting.
  - Move list with navigation.
  - Engine evaluation using Stockfish.js.
  - AI-powered feedback on each move using the Gemini API.
  - Opening detection with ECO codes and descriptions.
  - Export game PGN and analysis.
- **Keyboard Navigation:**
  - Arrow keys to navigate moves
  - 'F' to flip board orientation
  - '?' for keyboard shortcuts help
  - 'Esc' to close modals
- **Theme Toggle:** Switch between light and dark themes with persistent storage.
- **Responsive Design:** The application is designed to work on different screen sizes.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A build tool that provides a fast and optimized development experience.
- **TypeScript:** A superset of JavaScript that adds static typing.
- **Tailwind CSS:** A utility-first CSS framework.
- **chess.js:** A JavaScript chess library for move generation and validation.
- **chessboardjsx:** A React component for displaying chessboards.
- **Stockfish.js:** A JavaScript port of the Stockfish chess engine.
- **Gemini API:** Used for AI-powered move analysis.
- **react-router-dom:** For routing between different pages.
- **axios:** For making HTTP requests to the chess.com API.
- **date-fns:** For date formatting.
- **framer-motion:** For animations.
- **lucide-react:** For icons.
- **react-icons:** For icons.
- **react-lazyload:** For lazy loading images.
- **react-tooltip:** For tooltips.
- **recharts:** For charts.
- **@mliebelt/pgn-parser:** For parsing PGN strings.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file and add your Gemini API key as `VITE_GEMINI_API_KEY`.
4. Start the development server using `npm run dev`.
5. Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- `src/`: Contains the source code for the application.
  - `components/`: Contains the React components.
    - `ChessAnalysis/`: Contains components related to chess analysis.
    - `ChessBoard/`: Contains components related to the chessboard.
  - `hooks/`: Contains custom React hooks.
  - `services/`: Contains services for fetching data from the chess.com API.
  - `types/`: Contains TypeScript type definitions.
  - `utils/`: Contains utility functions.
  - `workers/`: Contains web workers.
- `public/`: Contains static assets.
- `images/`: Contains images used in the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
