import React, { useState, useEffect } from 'react';
import type { Deck, Flashcard, Rating, CardProgress } from '../types';
import { saveDeck } from '../utils/storage';
import { getNextCard, updateCardOrder } from '../utils/cardPriority';

interface ReviewModeProps {
  deck: Deck;
  onExit: () => void;
  onDeckUpdate: (deck: Deck) => void;
}

const RATINGS: { value: Rating; label: string; color: string }[] = [
  { value: 'VERY_BAD', label: 'Very Bad', color: '#dc3545' },
  { value: 'BAD', label: 'Bad', color: '#fd7e14' },
  { value: 'NEUTRAL', label: 'Neutral', color: '#ffc107' },
  { value: 'GOOD', label: 'Good', color: '#28a745' },
  { value: 'VERY_GOOD', label: 'Very Good', color: '#20c997' },
];

const ReviewMode: React.FC<ReviewModeProps> = ({ deck, onExit, onDeckUpdate }) => {
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    // Load first card
    const firstCard = getNextCard(deck);
    setCurrentCard(firstCard);
  }, []);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleRating = (rating: Rating) => {
    if (!currentCard) return;

    // Update progress for current card
    const existingProgress = deck.progress.find(p => p.cardId === currentCard.id);

    let updatedProgress: CardProgress[];
    if (existingProgress) {
      updatedProgress = deck.progress.map(p =>
        p.cardId === currentCard.id
          ? { ...p, ratings: [...p.ratings, rating], lastReviewed: Date.now() }
          : p
      );
    } else {
      updatedProgress = [
        ...deck.progress,
        { cardId: currentCard.id, ratings: [rating], lastReviewed: Date.now() },
      ];
    }

    // Update card order based on all progress
    const deckWithProgress = { ...deck, progress: updatedProgress };
    const newCardOrder = updateCardOrder(deckWithProgress);

    // Save updated deck
    const updatedDeck = {
      ...deckWithProgress,
      cardOrder: newCardOrder,
    };

    saveDeck(updatedDeck);
    onDeckUpdate(updatedDeck);

    // Move to next card
    const nextCard = getNextCard(updatedDeck, currentCard.id);
    setCurrentCard(nextCard);
    setShowAnswer(false);
    setReviewedCount(reviewedCount + 1);
  };

  const visibleCards = deck.cards.filter(c => !c.hidden);

  if (visibleCards.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>No cards to review</h2>
          <p>All cards are hidden or there are no cards in this deck.</p>
          <button onClick={onExit} style={styles.exitButton}>
            Exit Review Mode
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h2>Review Complete!</h2>
          <p>You've reviewed {reviewedCount} cards.</p>
          <button onClick={onExit} style={styles.exitButton}>
            Exit Review Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onExit} style={styles.backButton}>
          ← Exit Review
        </button>
        <div style={styles.progress}>
          Cards reviewed: {reviewedCount} | Remaining: {visibleCards.length}
        </div>
      </div>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <div style={styles.cardSide}>
            <h3 style={styles.sideLabel}>Question</h3>
            <p style={styles.cardText}>{currentCard.question}</p>
          </div>

          {showAnswer && (
            <div style={{ ...styles.cardSide, ...styles.answerSide }}>
              <h3 style={styles.sideLabel}>Answer</h3>
              <p style={styles.cardText}>{currentCard.answer}</p>
            </div>
          )}
        </div>

        {!showAnswer ? (
          <button onClick={handleShowAnswer} style={styles.showAnswerButton}>
            Show Answer
          </button>
        ) : (
          <div style={styles.ratingContainer}>
            <p style={styles.ratingLabel}>How did you do?</p>
            <div style={styles.ratingButtons}>
              {RATINGS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  style={{ ...styles.ratingButton, backgroundColor: color }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    minHeight: '100vh',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
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
  progress: {
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  } as React.CSSProperties,
  card: {
    width: '100%',
    backgroundColor: '#fff',
    border: '2px solid #dee2e6',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  cardSide: {
    marginBottom: '30px',
  } as React.CSSProperties,
  answerSide: {
    borderTop: '2px solid #dee2e6',
    paddingTop: '30px',
  } as React.CSSProperties,
  sideLabel: {
    fontSize: '14px',
    textTransform: 'uppercase',
    color: '#6c757d',
    marginBottom: '15px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  cardText: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#333',
    margin: 0,
    whiteSpace: 'pre-wrap',
  } as React.CSSProperties,
  showAnswerButton: {
    padding: '15px 40px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  ratingContainer: {
    width: '100%',
    textAlign: 'center',
  } as React.CSSProperties,
  ratingLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  } as React.CSSProperties,
  ratingButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  ratingButton: {
    padding: '12px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'opacity 0.2s',
    minWidth: '100px',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    marginTop: '100px',
  } as React.CSSProperties,
  exitButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  } as React.CSSProperties,
};

export default ReviewMode;
