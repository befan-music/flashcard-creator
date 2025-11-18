import React, { useState, useEffect } from 'react';
import type { Deck } from '../types';
import { getDeck } from '../utils/storage';
import ReviewMode from './ReviewMode';
import CardList from './CardList';

interface DeckViewProps {
  deckId: string;
  onBack: () => void;
}

const DeckView: React.FC<DeckViewProps> = ({ deckId, onBack }) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    const loadedDeck = getDeck(deckId);
    if (loadedDeck) {
      setDeck(loadedDeck);
    }
  }, [deckId]);

  const handleDeckUpdate = (updatedDeck: Deck) => {
    setDeck(updatedDeck);
  };

  if (!deck) {
    return (
      <div style={styles.container}>
        <p>Deck not found</p>
        <button onClick={onBack} style={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <ReviewMode
        deck={deck}
        onExit={() => setIsReviewMode(false)}
        onDeckUpdate={handleDeckUpdate}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>{deck.name}</h1>
        <button onClick={() => setIsReviewMode(true)} style={styles.reviewButton}>
          Review Cards
        </button>
      </div>

      <CardList deck={deck} onDeckUpdate={handleDeckUpdate} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    margin: 0,
    color: '#333',
  } as React.CSSProperties,
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  reviewButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  } as React.CSSProperties,
};

export default DeckView;
