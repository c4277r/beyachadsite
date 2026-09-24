import React from 'react';
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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    }
  };

  const handleDonateClick = () => {
    if (onNavigateToDonate) {
      onNavigateToDonate();
    }
  };

  return (
    <nav className="navbar" aria-label="ניווט ראשי">
      <div className="navbar-menu">
        {isDonationPage ? (
          <button className="nav-button" onClick={onNavigateToHome}>
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