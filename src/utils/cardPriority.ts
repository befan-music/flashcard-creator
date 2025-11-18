import type { Deck, CardProgress, Rating, Flashcard } from '../types';

// Rating weights - lower is worse, higher is better
const RATING_WEIGHTS: Record<Rating, number> = {
  VERY_BAD: -2,
  BAD: -1,
  NEUTRAL: 0,
  GOOD: 1,
  VERY_GOOD: 2,
};

/**
 * Calculate average score for a card based on its rating history
 * Lower scores mean the card needs more practice
 */
const calculateCardScore = (progress: CardProgress): number => {
  if (!progress.ratings || progress.ratings.length === 0) {
    return 0; // New cards get neutral score
  }

  const totalWeight = progress.ratings.reduce((sum, rating) => {
    return sum + RATING_WEIGHTS[rating];
  }, 0);

  return totalWeight / progress.ratings.length;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Initialize card order for a new deck or deck without order
 * Starts with randomized order
 */
export const initializeCardOrder = (cards: Flashcard[]): string[] => {
  const visibleCards = cards.filter(card => !card.hidden);
  return shuffleArray(visibleCards.map(card => card.id));
};

/**
 * Update card order after a rating
 * Worst performing cards should appear first
 */
export const updateCardOrder = (deck: Deck): string[] => {
  const visibleCards = deck.cards.filter(card => !card.hidden);

  // Calculate scores for all cards
  const cardScores = visibleCards.map(card => {
    const progress = deck.progress.find(p => p.cardId === card.id);
    const score = progress ? calculateCardScore(progress) : 0;
    return { id: card.id, score };
  });

  // Sort by score (ascending) - worst performers first
  cardScores.sort((a, b) => a.score - b.score);

  return cardScores.map(cs => cs.id);
};

/**
 * Get the next card to review
 */
export const getNextCard = (deck: Deck, currentCardId?: string): Flashcard | null => {
  if (!deck.cardOrder || deck.cardOrder.length === 0) {
    return null;
  }

  // Filter out hidden cards from order
  const visibleOrder = deck.cardOrder.filter(cardId => {
    const card = deck.cards.find(c => c.id === cardId);
    return card && !card.hidden;
  });

  if (visibleOrder.length === 0) {
    return null;
  }

  // If no current card, return first card
  if (!currentCardId) {
    const firstCardId = visibleOrder[0];
    return deck.cards.find(c => c.id === firstCardId) || null;
  }

  // Find current card index and return next card
  const currentIndex = visibleOrder.indexOf(currentCardId);
  const nextIndex = (currentIndex + 1) % visibleOrder.length;
  const nextCardId = visibleOrder[nextIndex];

  return deck.cards.find(c => c.id === nextCardId) || null;
};
