import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Navbar from '../components/Navbar';
import './stylepages/DonatePage.css';

interface IDonateCreditCardInput {
  amount: number;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  holderId: string;
}

interface DonatePageProps {
  onNavigateToHome?: () => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({ onNavigateToHome }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAmountConfirmed, setIsAmountConfirmed] = useState<boolean>(false);

  const predefinedAmounts = [180, 360, 720, 1250, 3600];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IDonateCreditCardInput>();

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

  const handleConfirmAmount = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount && finalAmount > 0) {
      setIsAmountConfirmed(true);
    }
  };

  const onSubmitPayment: SubmitHandler<IDonateCreditCardInput> = () => {
    alert('התשלום דורש חיבור לספק סליקה מאובטח. לא בוצע חיוב.');
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
                />
              </div>

              <button
                type="submit"
                className="confirm-amount-btn"
                disabled={!finalAmount || finalAmount <= 0}
              >
                אישור סכום והמשך לתשלום
              </button>
            </form>
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

              <div className="form-group">
                <label htmlFor="holderId">מספר תעודת זהות של בעל הכרטיס</label>
                <input
                  id="holderId"
                  type="text"
                  maxLength={9}
                  placeholder="9 ספרות"
                  {...register('holderId', {
                    required: 'שדה חובה',
                    pattern: {
                      value: /^\d{9}$/,
                      message: 'תעודת זהות חייבת להכיל 9 ספרות',
                    },
                  })}
                  className={errors.holderId ? 'input-error' : ''}
                />
                {errors.holderId && <span className="error-msg">{errors.holderId.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">מספר כרטיס אשראי</label>
                <input
                  id="cardNumber"
                  type="text"
                  maxLength={16}
                  placeholder="16 ספרות ללא רווחים"
                  {...register('cardNumber', {
                    required: 'שדה חובה',
                    pattern: {
                      value: /^\d{16}$/,
                      message: 'מספר כרטיס אשראי תקין מכיל 16 ספרות',
                    },
                  })}
                  className={errors.cardNumber ? 'input-error' : ''}
                />
                {errors.cardNumber && <span className="error-msg">{errors.cardNumber.message}</span>}
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label htmlFor="cardExpiry">תוקף (MM/YY)</label>
                  <input
                    id="cardExpiry"
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    {...register('cardExpiry', {
                      required: 'שדה חובה',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                        message: 'פורמט לא תקין (MM/YY)',
                      },
                    })}
                    className={errors.cardExpiry ? 'input-error' : ''}
                  />
                  {errors.cardExpiry && <span className="error-msg">{errors.cardExpiry.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardCvv">3 ספרות בגב הכרטיס (CVV)</label>
                  <input
                    id="cardCvv"
                    type="password"
                    maxLength={3}
                    placeholder="CVV"
                    {...register('cardCvv', {
                      required: 'שדה חובה',
                      pattern: {
                        value: /^\d{3}$/,
                        message: 'חייב להכיל 3 ספרות',
                      },
                    })}
                    className={errors.cardCvv ? 'input-error' : ''}
                  />
                  {errors.cardCvv && <span className="error-msg">{errors.cardCvv.message}</span>}
                </div>
              </div>

              <button type="submit" className="submit-payment-btn" disabled={isSubmitting}>
                ביצוע תשלום מאובטח
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonatePage;