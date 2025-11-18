import React, { useState } from 'react';
import type { Flashcard } from '../types';

interface CardEditorProps {
  card: Flashcard;
  onSave: (card: Flashcard) => void;
  onCancel: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ card, onSave, onCancel }) => {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      alert('Both question and answer are required');
      return;
    }

    onSave({
      ...card,
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Card</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="question" style={styles.label}>
            Question:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="Enter the question..."
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="answer" style={styles.label}>
            Answer:
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={styles.textarea}
            rows={4}
            placeholder="Enter the answer..."
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.saveButton}>
            Save Changes
          </button>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '2px solid #007bff',
  } as React.CSSProperties,
  title: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#333',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  textarea: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontFamily: 'inherit',
    resize: 'vertical',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: '10px',
  } as React.CSSProperties,
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  } as React.CSSProperties,
};

export default CardEditor;
