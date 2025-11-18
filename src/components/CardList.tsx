import React, { useState } from 'react';
import type { Deck, Flashcard } from '../types';
import { saveDeck } from '../utils/storage';
import CardEditor from './CardEditor';

interface CardListProps {
  deck: Deck;
  onDeckUpdate: (deck: Deck) => void;
}

const CardList: React.FC<CardListProps> = ({ deck, onDeckUpdate }) => {
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const handleToggleHide = (cardId: string) => {
    const updatedCards = deck.cards.map(card =>
      card.id === cardId ? { ...card, hidden: !card.hidden } : card
    );

    const updatedDeck = { ...deck, cards: updatedCards };
    saveDeck(updatedDeck);
    onDeckUpdate(updatedDeck);
  };

  const handleDelete = (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    const updatedCards = deck.cards.filter(card => card.id !== cardId);
    const updatedProgress = deck.progress.filter(p => p.cardId !== cardId);
    const updatedOrder = deck.cardOrder.filter(id => id !== cardId);

    const updatedDeck = {
      ...deck,
      cards: updatedCards,
      progress: updatedProgress,
      cardOrder: updatedOrder,
    };

    saveDeck(updatedDeck);
    onDeckUpdate(updatedDeck);
  };

  const handleSaveEdit = (updatedCard: Flashcard) => {
    const updatedCards = deck.cards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );

    const updatedDeck = { ...deck, cards: updatedCards };
    saveDeck(updatedDeck);
    onDeckUpdate(updatedDeck);
    setEditingCard(null);
  };

  if (editingCard) {
    return (
      <CardEditor
        card={editingCard}
        onSave={handleSaveEdit}
        onCancel={() => setEditingCard(null)}
      />
    );
  }

  return (
    <div>
      <p style={styles.info}>
        Total cards: {deck.cards.length} |
        Visible: {deck.cards.filter(c => !c.hidden).length} |
        Hidden: {deck.cards.filter(c => c.hidden).length}
      </p>

      <div style={styles.cardList}>
        {deck.cards.map((card) => (
          <div
            key={card.id}
            style={{
              ...styles.cardItem,
              ...(card.hidden ? styles.hiddenCard : {}),
            }}
          >
            <div style={styles.cardContent}>
              <div style={styles.cardSection}>
                <strong>Question:</strong>
                <p>{card.question}</p>
              </div>
              <div style={styles.cardSection}>
                <strong>Answer:</strong>
                <p>{card.answer}</p>
              </div>
            </div>

            <div style={styles.cardActions}>
              <button
                onClick={() => setEditingCard(card)}
                style={styles.modifyButton}
              >
                Modify
              </button>
              <button
                onClick={() => handleToggleHide(card.id)}
                style={card.hidden ? styles.unhideButton : styles.hideButton}
              >
                {card.hidden ? 'Unhide' : 'Hide'}
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  info: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  } as React.CSSProperties,
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  } as React.CSSProperties,
  cardItem: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
  } as React.CSSProperties,
  hiddenCard: {
    opacity: 0.5,
    backgroundColor: '#e9ecef',
  } as React.CSSProperties,
  cardContent: {
    marginBottom: '15px',
  } as React.CSSProperties,
  cardSection: {
    marginBottom: '10px',
  } as React.CSSProperties,
  cardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  modifyButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  hideButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  unhideButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  } as React.CSSProperties,
};

export default CardList;
