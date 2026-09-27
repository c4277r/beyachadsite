import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Navbar from '../components/Navbar';
import { submitDonation, ApiRequestError } from '../lib/api';
import './stylepages/DonatePage.css';

// This page only collects donor details, never card data - card entry
// happens on the payment processor's own hosted page (not implemented yet,
// see server/src/services/kesherService.ts). Fields mirror
// server/src/utils/validation.ts createDonationSchema exactly.
interface IDonateDetailsInput {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
}

// Keep in sync with MAX_DONATION_AMOUNT_ILS in server/src/utils/validation.ts
const MAX_DONATION_AMOUNT_ILS = 50_000;

interface DonatePageProps {
  onNavigateToHome?: () => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({ onNavigateToHome }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAmountConfirmed, setIsAmountConfirmed] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const predefinedAmounts = [180, 360, 720, 1250, 3600];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<IDonateDetailsInput>();

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setValue('amount', amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setSelectedAmount(null);
    setValue('amount', Number(val));
  };

  const finalAmount = selectedAmount ?? Number(customAmount);
  const isAmountValid = finalAmount > 0 && finalAmount <= MAX_DONATION_AMOUNT_ILS;

  const handleConfirmAmount = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAmountValid) {
      setIsAmountConfirmed(true);
    }
  };

  const onSubmitPayment: SubmitHandler<IDonateDetailsInput> = async (data) => {
    setSubmitError(null);
    try {
      await submitDonation({
        amount: finalAmount,
        paymentType: 'CREDIT_CARD',
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donorPhone: data.donorPhone || undefined,
      });
    } catch (error) {
      setSubmitError(
        error instanceof ApiRequestError ? error.message : 'שליחת התרומה נכשלה, אנא נסה שוב'
      );
    }
  };

  return (
    <div className="donate-page-container">
      <Navbar isDonationPage onNavigateToHome={onNavigateToHome} />

      <main className="donate-main">
        <div className="donate-card-box">
          {onNavigateToHome && (
            <button className="back-to-home-btn" onClick={onNavigateToHome}>
              &rarr; חזרה לדף הבית
            </button>
          )}

          <h1 className="donate-title">תרומה לבית ביחד</h1>
          <p className="donate-subtitle">התרומה שלך מעניקה אור ושמחה לילדים</p>

          {!isAmountConfirmed ? (
            <form onSubmit={handleConfirmAmount} className="amount-selection-form">
              <h3>בחר סכום לתרומה (בש"ח)</h3>

              <div className="predefined-amounts-grid">
                {predefinedAmounts.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    className={`amount-btn ${selectedAmount === amt ? 'selected' : ''}`}
                    onClick={() => handleSelectAmount(amt)}
                  >
                    ₪{amt}
                  </button>
                ))}
              </div>

              <div className="custom-amount-wrapper">
                <label htmlFor="customAmount">או הכנס סכום חופשי:</label>
                <input
                  type="number"
                  id="customAmount"
                  placeholder="הכנס סכום בש״ח"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  min="1"
                  max={MAX_DONATION_AMOUNT_ILS}
                />
                {customAmount !== '' && !isAmountValid && (
                  <span className="error-msg">{`סכום חייב להיות בין ₪1 ל-₪${MAX_DONATION_AMOUNT_ILS}`}</span>
                )}
              </div>

              <button type="submit" className="confirm-amount-btn" disabled={!isAmountValid}>
                אישור סכום והמשך
              </button>
            </form>
          ) : isSubmitSuccessful ? (
            <div className="success-message">
              תרומתך בסך ₪{finalAmount} נקלטה בהצלחה! ניצור עמך קשר בהקדם להשלמת התשלום. תודה על התמיכה.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitPayment)} className="credit-card-form" noValidate>
              <div className="selected-amount-summary">
                <span>סכום התרומה שנבחר: </span>
                <strong>₪{finalAmount}</strong>
                <button
                  type="button"
                  className="change-amount-btn"
                  onClick={() => setIsAmountConfirmed(false)}
                >
                  שינוי סכום
                </button>
              </div>

              {submitError && <div className="error-msg">{submitError}</div>}

              <div className="form-group">
                <label htmlFor="donorName">שם מלא</label>
                <input
                  id="donorName"
                  type="text"
                  placeholder="שם מלא"
                  {...register('donorName', {
                    required: 'שדה חובה',
                    minLength: { value: 2, message: 'שם קצר מדי' },
                  })}
                  className={errors.donorName ? 'input-error' : ''}
                />
                {errors.donorName && <span className="error-msg">{errors.donorName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="donorEmail">אימייל</label>
                <input
                  id="donorEmail"
                  type="email"
                  placeholder="לצורך שליחת קבלה"
                  {...register('donorEmail', {
                    required: 'שדה חובה',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'כתובת אימייל לא תקינה',
                    },
                  })}
                  className={errors.donorEmail ? 'input-error' : ''}
                />
                {errors.donorEmail && <span className="error-msg">{errors.donorEmail.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="donorPhone">מספר טלפון (לא חובה)</label>
                <input
                  id="donorPhone"
                  type="tel"
                  placeholder="05XXXXXXXX"
                  {...register('donorPhone', {
                    pattern: {
                      // Must match server's `^05\d{8}$` (Israeli mobile format).
                      value: /^05\d{8}$/,
                      message: 'מספר טלפון לא תקין (דוגמה: 0501234567)',
                    },
                  })}
                  className={errors.donorPhone ? 'input-error' : ''}
                />
                {errors.donorPhone && <span className="error-msg">{errors.donorPhone.message}</span>}
              </div>

              <button type="submit" className="submit-payment-btn" disabled={isSubmitting}>
                {isSubmitting ? 'שולח...' : 'אישור פרטים והמשך לתרומה'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonatePage;