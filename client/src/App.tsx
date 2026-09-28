import React, { useEffect, useState } from 'react';
import Home from './pages/HomePage';
import DonatePage from './pages/DonatePage';
import AdminPage from './pages/AdminPage';

type Page = 'home' | 'donate' | 'admin';

const App: React.FC = () => {
  const getPageFromLocation = (): Page => {
    if (window.location.hash === '#donate') return 'donate';
    if (window.location.hash === '#admin') return 'admin';
    return 'home';
  };
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromLocation);

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
    <>
      {currentPage === 'home' && (
        <Home onNavigateToDonate={navigateToDonate} />
      )}
      {currentPage === 'donate' && (
        <DonatePage onNavigateToHome={navigateToHome} />
      )}
      {currentPage === 'admin' && <AdminPage />}
    </>
  );
};

export default App;