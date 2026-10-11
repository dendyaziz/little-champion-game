import React, { useEffect, useRef, useState } from 'react';
import { X, Delete } from 'lucide-react';
import { createParentChallenge, DIGIT_WORDS } from '../utils/parentAccess';

interface ParentGateProps { onUnlock: () => void; onCancel: () => void; }

export const ParentGate: React.FC<ParentGateProps> = ({ onUnlock, onCancel }) => {
  const [challenge, setChallenge] = useState(createParentChallenge);
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterDigit = (digit: string) => {
    if (entry.length >= 3) return;
    const next = entry + digit;
    setError(false);
    if (next.length === 3) {
      if (next === challenge) {
        setEntry(next);
        unlockTimerRef.current = setTimeout(() => {
          onUnlock();
        }, 500);
      } else {
        setEntry('');
        setChallenge(createParentChallenge());
        setError(true);
      }
    } else setEntry(next);
  };
  useEffect(() => {
    closeRef.current?.focus();
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) { event.preventDefault(); enterDigit(event.key); }
      else if ((event.key === 'Backspace' || event.key === 'Delete') && entry.length < 3) { event.preventDefault(); setEntry((value) => value.slice(0, -1)); setError(false); }
      else if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entry, challenge, onUnlock, onCancel]);
  return (
    <main className="parent-gate">
      <section className="parent-gate-content" aria-labelledby="parent-gate-title">
        <button ref={closeRef} className="parent-gate-close" onClick={onCancel} aria-label="Back to games"><X /></button>
        <h1 id="parent-gate-title">Are you a grown-up?</h1>
        <p>Tap the numbers written below</p>
        <div className="parent-challenge">{challenge.split('').map((digit, index) => <span key={index}>{DIGIT_WORDS[Number(digit)]}</span>)}</div>
        <div className="parent-entry" aria-label={`${entry.length} of 3 digits entered`}>
          {[0, 1, 2].map((index) => <span key={index} aria-hidden="true">{entry[index] ?? ''}</span>)}
        </div>
        <div className="parent-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => <button key={digit} onClick={() => enterDigit(String(digit))}>{digit}</button>)}
          <span aria-hidden="true" />
          <button onClick={() => enterDigit('0')}>0</button>
          <button className="parent-erase" aria-label="Erase last digit" onClick={() => { if (entry.length < 3) { setEntry((value) => value.slice(0, -1)); setError(false); } }}><Delete /></button>
        </div>
        <p className="parent-gate-status" role="status">{error ? 'Try the new number' : '\u00a0'}</p>
      </section>
    </main>
  );
};
