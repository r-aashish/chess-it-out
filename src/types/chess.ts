/**
 * ChessStats interface defines the structure for chess statistics data.
 * It includes properties for daily, rapid, bullet, and blitz chess stats, as well as tactics, lessons, and puzzle rush data.
 */
export interface ChessStats {
  chess_daily?: {
    last: {
      rating: number;
      date: number;
      rd: number;
    };
    best: {
      rating: number;
      date: number;
      game: string;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  chess_rapid?: {
    last: {
      rating: number;
      date: number;
      rd: number;
    };
    best: {
      rating: number;
      date: number;
      game: string;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  chess_bullet?: {
    last: {
      rating: number;
      date: number;
      rd: number;
    };
    best: {
      rating: number;
      date: number;
      game: string;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  chess_blitz?: {
    last: {
      rating: number;
      date: number;
      rd: number;
    };
    best: {
      rating: number;
      date: number;
      game: string;
    };
    record: {
      win: number;
      loss: number;
      draw: number;
    };
  };
  fide: number;
  tactics: {
    highest: {
      rating: number;
      date: number;
    };
    lowest: {
      rating: number;
      date: number;
    };
  };
  lessons: {
    highest: {
      rating: number;
      date: number;
    };
    lowest: {
      rating: number;
      date: number;
    };
  };
  puzzle_rush?: {
    best: {
      total_attempts: number;
      score: number;
    };
  };
}

/**
 * ChessGame interface defines the structure for chess game data.
 * It includes properties for the game URL, UUID, PGN, time control, end time, rating, FEN, time class, rules, and player information.
 */
export interface ChessGame {
  url: string;
  uuid: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  fen: string;
  time_class: string;
  rules: string;
  white: {
    rating: number;
    result: string;
    username: string;
    avatar?: string;
  };
  black: {
    rating: number;
    result: string;
    username: string;
    avatar?: string;
  };
  event?: string;
  site?: string;
  date?: string;
  result?: string;
  eco?: string;
  opening?: string;
  termination?: string;
  utc_date?: string;
  utc_time?: string;
  moveHistory: { white: string; black: string; moveNumber: number; }[];
  llm_feedback: string;
  initialFen?: string;
}

/**
 * Move interface defines the structure for a chess move.
 * It includes properties for the white and black moves, and the move number.
 */
export interface Move {
  white: string;
  black: string;
  moveNumber: number;
}

/**
 * PlayerProfile interface defines the structure for player profile data.
 * It includes properties for the player ID, URL, username, title, status, name, avatar, location, country, join date, last online, followers, and other information.
 */
export interface PlayerProfile {
  '@id': string;
  url: string;
  username: string;
  player_id: number;
  title?: string;
  status: string;
  name?: string;
  avatar?: string;
  location?: string;
  country?: string;
  joined: number;
  last_online: number;
  followers: number;
  is_streamer: boolean;
  twitch_url?: string;
  fide?: number;
  verified: boolean;
  rating?: number;
  rating_change?: number;
  stats?: {
    wins: number;
    losses: number;
    draws: number;
  };
}
