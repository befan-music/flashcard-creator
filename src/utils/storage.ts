import type { Deck, AppState } from '../types';

const STORAGE_KEY = 'flashcard-app-state';

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return { decks: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return { decks: [] };
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const saveDeck = (deck: Deck): void => {
  const state = loadState();
  const existingIndex = state.decks.findIndex(d => d.id === deck.id);

  if (existingIndex >= 0) {
    state.decks[existingIndex] = deck;
  } else {
    state.decks.push(deck);
  }

  saveState(state);
};

export const deleteDeck = (deckId: string): void => {
  const state = loadState();
  state.decks = state.decks.filter(d => d.id !== deckId);
  saveState(state);
};

export const getDeck = (deckId: string): Deck | undefined => {
  const state = loadState();
  return state.decks.find(d => d.id === deckId);
};
