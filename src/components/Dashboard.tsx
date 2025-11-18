import React, { useState, useEffect } from 'react';
import type { Deck } from '../types';
import { loadState, saveDeck } from '../utils/storage';
import { initializeCardOrder } from '../utils/cardPriority';

interface DashboardProps {
  onSelectDeck: (deckId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectDeck }) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const state = loadState();
    setDecks(state.decks);
  }, []);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);

        // Validate JSON structure
        if (!jsonData.name || !Array.isArray(jsonData.cards)) {
          alert('Invalid deck format. Expected { name: string, cards: Array }');
          return;
        }

        // Create deck with proper structure
        const newDeck: Deck = {
          id: `deck-${Date.now()}`,
          name: jsonData.name,
          cards: jsonData.cards.map((card: any, index: number) => ({
            id: card.id || `card-${Date.now()}-${index}`,
            question: card.question || card.front || '',
            answer: card.answer || card.back || '',
            hidden: false,
          })),
          progress: [],
          cardOrder: [],
        };

        // Initialize card order with randomized sequence
        newDeck.cardOrder = initializeCardOrder(newDeck.cards);

        // Save to storage and update state
        saveDeck(newDeck);
        setDecks([...decks, newDeck]);

        alert(`Deck "${newDeck.name}" imported successfully!`);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error parsing JSON file. Please check the file format.');
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Flashcard Decks</h1>

      <div style={styles.importSection}>
        <label htmlFor="file-input" style={styles.importButton}>
          Import Deck (JSON)
        </label>
        <input
          id="file-input"
          type="file"
          accept=".json"
          onChange={handleFileImport}
          style={styles.fileInput}
        />
      </div>

      {decks.length === 0 ? (
        <p style={styles.emptyState}>No decks yet. Import a JSON deck to get started!</p>
      ) : (
        <div style={styles.deckGrid}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              style={styles.deckCard}
              onClick={() => onSelectDeck(deck.id)}
            >
              <h3 style={styles.deckName}>{deck.name}</h3>
              <p style={styles.deckInfo}>
                {deck.cards.filter(c => !c.hidden).length} cards
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  } as React.CSSProperties,
  importSection: {
    marginBottom: '30px',
  } as React.CSSProperties,
  importButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  fileInput: {
    display: 'none',
  } as React.CSSProperties,
  emptyState: {
    textAlign: 'center',
    color: '#666',
    fontSize: '18px',
    marginTop: '60px',
  } as React.CSSProperties,
  deckGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  deckCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  } as React.CSSProperties,
  deckName: {
    margin: '0 0 10px 0',
    fontSize: '1.25rem',
    color: '#333',
  } as React.CSSProperties,
  deckInfo: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  } as React.CSSProperties,
};

export default Dashboard;
