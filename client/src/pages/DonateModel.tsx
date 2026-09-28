import React, { useEffect } from 'react';

export type DonateModalType = 'bank' | 'horatKava' | 'phone' | null;

interface DonateModalProps {
  type: DonateModalType;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ type, onClose }) => {
  // סגירת המודאל בלחיצה על מקש ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (type) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content donate-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="סגור">
          &times;
        </button>

        {type === 'bank' && (
          <>
            <div className="donate-modal-icon">🏦</div>
            <h2 className="contact-title">פרטים להעברה בנקאית</h2>
            <div className="bank-details-box">
              <p><strong>שם החשבון:</strong> חרוצים במעש ע"ר</p>
              <p><strong>בנק:</strong> לאומי</p>
              <p><strong>סניף:</strong> 856</p>
              <p><strong>מספר חשבון:</strong> 322960014</p>
            </div>
            <p className="donate-modal-note">
              לאחר העברת התרומה, מומלץ ליצור עמנו קשר לקבלת קבלה מוכרת במס (סעיף 46).
            </p>
          </>
        )}

        {type === 'horatKava' && (
          <>
            <div className="donate-modal-icon">📜</div>
            <h2 className="contact-title">הוראת קבע בנקאית</h2>
            <p className="contact-subtitle">
              להקמת הרשאה לחיוב חשבון ישירות בבנק שלכם:
            </p>
            <div className="bank-details-box">
              <p><strong>שם החשבון:</strong> חרוצים במעש ע"ר</p>
              <p><strong>בנק:</strong> לאומי</p>
              <p><strong>סניף:</strong> 856</p>
              <p><strong>מספר חשבון:</strong> 322960014</p>
            </div>
            <button className="contact-submit-btn" onClick={onClose}>
              אישור
            </button>
          </>
        )}

        {type === 'phone' && (
          <>
            <div className="donate-modal-icon">📞</div>
            <h2 className="contact-title">תרומה טלפונית</h2>
            <p className="contact-subtitle">
              ניתן לתרום במוקד הטלפוני המאובטח שלנו:
            </p>
            <a href="tel:0534123911" className="phone-display-link">
              053-4123911
            </a>
            <p className="donate-modal-note">זמינים עבורכם א'-ה' 09:00 - 18:00</p>
          </>
        )}
      </div>
    </div>
  );
};