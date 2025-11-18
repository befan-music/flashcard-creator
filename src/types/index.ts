export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  hidden?: boolean;
}

export type Rating = 'VERY_BAD' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD';

export interface CardProgress {
  cardId: string;
  ratings: Rating[];
  lastReviewed?: number; // timestamp
}

export interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
  progress: CardProgress[];
  cardOrder: string[]; // IDs of cards in priority order
}

export interface AppState {
  decks: Deck[];
}
