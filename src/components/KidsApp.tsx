import React, { useState, useEffect } from 'react';
import { HomeMenu } from './HomeMenu';
import { GameRoom } from './GameRoom';
import { RecordsView } from './RecordsView';
import { ParentGate } from './ParentGate';
import { isParentPath, canonicalAppPath } from '../utils/parentAccess';

interface KidsAppProps { initialGameId?: string; initialView?: 'home' | 'records'; initialPath?: string; }

export const KidsApp: React.FC<KidsAppProps> = ({ initialGameId, initialView = 'home', initialPath }) => {
  const [path, setPath] = useState(() => canonicalAppPath(typeof window !== 'undefined'
    ? window.location.pathname
    : initialPath ?? (initialGameId ? `/play/${initialGameId}` : initialView === 'records' ? '/parents/records' : '/')));
  // Memory-only: leaving the parent area or refreshing locks it again.
  const [parentUnlocked, setParentUnlocked] = useState(false);

  useEffect(() => {
    if (window.location.pathname !== path) window.history.replaceState(null, '', path);
    const handlePopState = () => {
      const next = canonicalAppPath(window.location.pathname);
      if (!isParentPath(next)) setParentUnlocked(false);
      if (next !== window.location.pathname) window.history.replaceState(null, '', next);
      setPath(next);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (next: string) => {
    const destination = canonicalAppPath(next);
    if (!isParentPath(destination)) setParentUnlocked(false);
    window.history.pushState(null, '', destination);
    setPath(destination);
  };
  const exit = () => navigate('/');

  // Every parent route passes this boundary before mounting its contents.
  if (isParentPath(path)) {
    if (!parentUnlocked) return <ParentGate onUnlock={() => setParentUnlocked(true)} onCancel={exit} />;
    if (path.replace(/\/$/, '') === '/parents/records') return <RecordsView onBackToHome={exit} />;
    return <main className="parent-gate"><button className="utility-button" onClick={exit}>Back to games</button></main>;
  }
  if (path.startsWith('/play/')) return <GameRoom gameId={path.slice(6).replace(/\/$/, '')} onExit={exit} />;
  return <HomeMenu onSelectMode={(id) => navigate(`/play/${id}`)} onOpenRecords={() => navigate('/parents/records')} />;
};
