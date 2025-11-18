# Flashcard Creator App

A modern, interactive flashcard application built with React and TypeScript. Create, manage, and review flashcard decks with an intelligent spaced repetition system.

## Features

### 1. Landing Page / Dashboard
- View all imported flashcard decks
- Click on any deck to open it
- Import new decks from JSON files

### 2. Import Functionality
- Import flashcard decks from JSON files
- Supports custom deck names and card structures
- Automatically generates unique IDs for cards

### 3. Deck Management
- View all cards in a deck
- See statistics (total cards, visible cards, hidden cards)
- Access review mode for active learning

### 4. Review Mode
- Interactive flashcard review system
- Shows question first, then reveals answer on click
- Rate your performance on each card:
  - **Very Bad** - Struggled significantly
  - **Bad** - Had difficulty
  - **Neutral** - Average performance
  - **Good** - Performed well
  - **Very Good** - Mastered the concept

### 5. Intelligent Card Ordering
- Cards start in randomized order
- After ratings, worst-performing cards appear first
- Algorithm prioritizes cards you need most practice with
- Card order persists between sessions

### 6. Card Editing
- **Modify** - Edit question and answer text
- **Hide** - Temporarily remove cards from review mode
- **Delete** - Permanently remove cards from the deck

### 7. Local Storage Persistence
- All decks, cards, and progress are saved locally
- Your ratings and card order persist between sessions
- No internet connection required

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## JSON Deck Format

Create your own flashcard decks using this JSON format:

```json
{
  "name": "Your Deck Name",
  "cards": [
    {
      "question": "What is the question?",
      "answer": "This is the answer."
    },
    {
      "question": "Another question?",
      "answer": "Another answer."
    }
  ]
}
```

### Alternative Card Format

The app also supports these field names:
- `front` instead of `question`
- `back` instead of `answer`

### Sample Deck

A sample deck (`sample-deck.json`) is included with JavaScript fundamentals questions.

## How to Use

1. **Import a Deck**
   - Click "Import Deck (JSON)" on the dashboard
   - Select a JSON file from your computer
   - The deck will appear on the dashboard

2. **Review Cards**
   - Click on a deck to open it
   - Click "Review Cards" to start reviewing
   - Read the question, then click "Show Answer"
   - Rate your performance
   - Continue through all cards

3. **Manage Cards**
   - View all cards in the deck view
   - Click "Modify" to edit a card
   - Click "Hide" to exclude from reviews
   - Click "Delete" to remove permanently

4. **Track Progress**
   - Your ratings influence which cards appear next
   - Cards you struggle with will be shown more frequently
   - All progress is saved automatically

## Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Storage**: Browser localStorage
- **State Management**: React hooks (useState, useEffect)
- **Styling**: Inline styles with React.CSSProperties

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main landing page
│   ├── DeckView.tsx       # Individual deck view
│   ├── ReviewMode.tsx     # Flashcard review interface
│   ├── CardList.tsx       # List of all cards in deck
│   └── CardEditor.tsx     # Card editing form
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   ├── storage.ts         # localStorage utilities
│   └── cardPriority.ts    # Card ordering algorithm
├── App.tsx                # Main app component
└── main.tsx               # App entry point
```

## Card Priority Algorithm

The app uses a weighted scoring system:
- Very Bad: -2 points
- Bad: -1 point
- Neutral: 0 points
- Good: +1 point
- Very Good: +2 points

Cards with lower average scores appear first in the review queue, ensuring you practice the material you need most.

## Browser Compatibility

Works on all modern browsers that support:
- localStorage API
- ES6+ JavaScript features
- CSS Grid and Flexbox

## Future Enhancements

Potential features for future versions:
- Export decks to JSON
- Create new decks directly in the app
- Add images to flashcards
- Statistics and analytics
- Multiple deck review sessions
- Tagging and filtering system

## License

MIT License - Feel free to use and modify as needed!
