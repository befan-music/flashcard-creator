import { useState } from 'react';
import Dashboard from './components/Dashboard';
import DeckView from './components/DeckView';
import './App.css';

function App() {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  return (
    <div className="app">
      {selectedDeckId ? (
        <DeckView
          deckId={selectedDeckId}
          onBack={() => setSelectedDeckId(null)}
        />
      ) : (
        <Dashboard onSelectDeck={setSelectedDeckId} />
      )}
    </div>
  );
}

export default App;
