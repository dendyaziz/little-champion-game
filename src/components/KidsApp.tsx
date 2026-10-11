import React, { useState, useEffect } from 'react';
import { HomeMenu } from './HomeMenu';
import { GameRoom } from './GameRoom';
import { RecordsView } from './RecordsView';

interface KidsAppProps {
  initialGameId?: string;
  initialView?: 'home' | 'records';
}

export const KidsApp: React.FC<KidsAppProps> = ({ initialGameId, initialView = 'home' }) => {
  const [currentGameId, setCurrentGameId] = useState<string | null>(() => {
    if (initialGameId) return initialGameId;
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/play/')) {
        const id = path.replace('/play/', '').replace(/\/$/, '');
        if (id) return id;
      }
    }
    return null;
  });

  const [showRecords, setShowRecords] = useState<boolean>(() => {
    if (initialView === 'records') return true;
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/records');
    }
    return false;
  });

  // Handle browser back and forward button events
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/play/')) {
        const id = path.replace('/play/', '').replace(/\/$/, '');
        setCurrentGameId(id || null);
        setShowRecords(false);
      } else if (path.startsWith('/records')) {
        setCurrentGameId(null);
        setShowRecords(true);
      } else {
        setCurrentGameId(null);
        setShowRecords(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When a kid taps a mode card on the Home Menu:
  // INSTANTANEOUS view switch (0ms delay, no browser reload, no freeze)!
  const handleSelectMode = (modeId: string) => {
    window.history.pushState(null, '', `/play/${modeId}`);
    setShowRecords(false);
    setCurrentGameId(modeId);
  };

  // When opening Speed Records:
  const handleOpenRecords = () => {
    window.history.pushState(null, '', '/records');
    setCurrentGameId(null);
    setShowRecords(true);
  };

  // When exiting back to home menu:
  // INSTANTANEOUS return (0ms delay, no browser reload)!
  const handleExitToHome = () => {
    window.history.pushState(null, '', '/');
    setShowRecords(false);
    setCurrentGameId(null);
  };

  if (currentGameId) {
    return <GameRoom gameId={currentGameId} onExit={handleExitToHome} />;
  }

  if (showRecords) {
    return <RecordsView onBackToHome={handleExitToHome} />;
  }

  return <HomeMenu onSelectMode={handleSelectMode} onOpenRecords={handleOpenRecords} />;
};
