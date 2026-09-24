import React, { useEffect, useState } from 'react';
import Home from './pages/HomePage';
import DonatePage from './pages/DonatePage';

const App: React.FC = () => {
  const getPageFromLocation = (): 'home' | 'donate' =>
    window.location.hash === '#donate' ? 'donate' : 'home';
  const [currentPage, setCurrentPage] = useState<'home' | 'donate'>(getPageFromLocation);

  useEffect(() => {
    const handlePopState = () => setCurrentPage(getPageFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: 'home' | 'donate') => {
    window.history.pushState({}, '', page === 'donate' ? '#donate' : '#home');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToDonate = () => {
    navigate('donate');
  };

  const navigateToHome = () => {
    navigate('home');
  };

  return (
    <main>
      {currentPage === 'home' && (
        <Home onNavigateToDonate={navigateToDonate} />
      )}
      {currentPage === 'donate' && (
        <DonatePage onNavigateToHome={navigateToHome} />
      )}
    </main>
  );
};

export default App;