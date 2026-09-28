import React, { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  onOpenContact?: () => void;
  onNavigateToDonate?: () => void;
  isDonationPage?: boolean;
  onNavigateToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onNavigateToDonate,
  isDonationPage = false,
  onNavigateToHome,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    }
  };

  const handleDonateClick = () => {
    setIsMenuOpen(false);
    if (onNavigateToDonate) {
      onNavigateToDonate();
    }
  };

  return (
    <nav className="navbar" aria-label="ניווט ראשי">
      <button
        type="button"
        className="navbar-toggle"
        aria-label={isMenuOpen ? 'סגירת תפריט ניווט' : 'פתיחת תפריט ניווט'}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div id="primary-navigation" className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
        {isDonationPage ? (
          <button className="nav-button" onClick={() => { setIsMenuOpen(false); onNavigateToHome?.(); }}>
            דף הבית
          </button>
        ) : (
          <>
        <button 
          className="nav-button" 
          onClick={() => scrollToSection('about-us')}
        >
          אודותינו
        </button>

        <button 
          className="nav-button" 
          onClick={() => scrollToSection('our-work')}
        >
          העשיה שלנו
        </button>

        <button 
          className="nav-button" 
          onClick={() => scrollToSection('gallery')}
        >
          גלריה
        </button>

        <button 
          className="nav-button" 
          onClick={() => scrollToSection('words-of-kids')}
        >
          המלצות
        </button>

        <button 
          className="nav-button" 
          onClick={() => scrollToSection('faq')}
        >
          שאלות ותשובות
        </button>

        <button 
          className="nav-button" 
          onClick={handleContactClick}
        >
          צור קשר
        </button>
          </>
        )}
      </div>

      <div className="navbar-donate">
        <button 
          className="nav-button donate-button" 
          onClick={handleDonateClick}
          disabled={isDonationPage}
        >
          תרום
        </button>
      </div>
    </nav>
  );
};

export default Navbar;