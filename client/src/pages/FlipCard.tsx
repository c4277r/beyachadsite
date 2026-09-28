import React, { useState } from 'react';

interface FlipCardProps {
  title: string;
  text: string;
  imgSrc?: string;
  imgAlt?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ title, text, imgSrc, imgAlt }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`${title}: ${isFlipped ? 'הצגת תמונה' : 'הצגת פרטים'}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="card-image-wrapper">
            {imgSrc && <img src={imgSrc} alt={imgAlt || title} className="card-image" loading="lazy" />}
          </div>
          <div className="card-front-title">{title}</div>
        </div>
        <div className="flip-card-back">
          <p className="card-back-text">{text}</p>
        </div>
      </div>
    </div>
  );
};