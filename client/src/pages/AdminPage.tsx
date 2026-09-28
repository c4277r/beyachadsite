import React, { useEffect, useState } from 'react';
import {
  ApiRequestError,
  getAdminContactMessages,
  getAdminDonations,
  loginAdmin,
  updateAdminContactMessage,
} from '../lib/api';
import './stylepages/AdminPage.css';

const TOKEN_KEY = 'bait-beyached-admin-token';

type ContactStatus = 'UNREAD' | 'READ' | 'HANDLED' | 'ARCHIVED';

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

interface Donation {
  id: string;
  amount: number;
  paymentType: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'STANDING_ORDER' | 'PHONE_PLEDGE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  donorName: string | null;
  donorEmail: string | null;
  createdAt: string;
}

const contactStatusLabels: Record<ContactStatus, string> = {
  UNREAD: 'חדש',
  READ: 'נקרא',
  HANDLED: 'טופל',
  ARCHIVED: 'בארכיון',
};

const donationStatusLabels: Record<Donation['status'], string> = {
  PENDING: 'ממתינה',
  COMPLETED: 'הושלמה',
  FAILED: 'נכשלה',
};

const paymentTypeLabels: Record<Donation['paymentType'], string> = {
  CREDIT_CARD: 'כרטיס אשראי',
  BANK_TRANSFER: 'העברה בנקאית',
  STANDING_ORDER: 'הוראת קבע',
  PHONE_PLEDGE: 'תרומה טלפונית',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('he-IL', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
}

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState(() => window.sessionStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'donations'>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [savingMessageId, setSavingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let isCurrent = true;
    setIsLoading(true);
    setError(null);
    Promise.all([getAdminContactMessages(token), getAdminDonations(token)])
      .then(([contactResult, donationResult]) => {
        if (!isCurrent) return;
        setMessages(contactResult);
        setDonations(donationResult);
      })
      .catch((requestError: unknown) => {
        if (!isCurrent) return;
        if (requestError instanceof ApiRequestError && requestError.status === 401) {
          window.sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
        setError(requestError instanceof Error ? requestError.message : 'טעינת הנתונים נכשלה');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await loginAdmin(email, password);
      window.sessionStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setPassword('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'ההתחברות נכשלה');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMessages([]);
    setDonations([]);
  };

  const handleMessageStatusChange = async (id: string, status: ContactStatus) => {
    if (!token) return;
    setSavingMessageId(id);
    setError(null);
    try {
      await updateAdminContactMessage(token, id, { status });
      setMessages((current) => current.map((message) => (message.id === id ? { ...message, status } : message)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'עדכון ההודעה נכשל');
    } finally {
      setSavingMessageId(null);
    }
  };

  if (!token) {
    return (
      <main className="admin-shell" dir="rtl">
        <section className="admin-login">
          <p className="admin-eyebrow">בית ביחד · ניהול</p>
          <h1>כניסה למערכת</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="admin-email">דוא״ל</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="admin-password">סיסמה</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'מתחבר...' : 'התחברות'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell" dir="rtl">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">בית ביחד · ניהול</p>
          <h1>תיבת פניות ותרומות</h1>
        </div>
        <button type="button" className="admin-logout" onClick={handleLogout}>יציאה</button>
      </header>

      <nav className="admin-tabs" aria-label="תצוגת ניהול">
        <button type="button" aria-pressed={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
          פניות ({messages.length})
        </button>
        <button type="button" aria-pressed={activeTab === 'donations'} onClick={() => setActiveTab('donations')}>
          תרומות ({donations.length})
        </button>
      </nav>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="admin-state" role="status">טוען נתונים...</p>
      ) : activeTab === 'messages' ? (
        <section className="admin-list" aria-label="פניות שהתקבלו">
          {messages.length === 0 ? <p className="admin-state">אין פניות להצגה.</p> : messages.map((message) => (
            <article className="admin-entry" key={message.id}>
              <div className="admin-entry-heading">
                <div>
                  <h2>{message.firstName} {message.lastName}</h2>
                  <p>{formatDate(message.createdAt)}</p>
                </div>
                <label className="admin-status-label">
                  <span>סטטוס</span>
                  <select
                    value={message.status}
                    disabled={savingMessageId === message.id}
                    onChange={(event) => handleMessageStatusChange(message.id, event.target.value as ContactStatus)}
                  >
                    {Object.entries(contactStatusLabels).map(([value, label]) => (
                      <option value={value} key={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="admin-contact-links">
                <a href={`mailto:${message.email}`}>{message.email}</a>
                <a href={`tel:${message.phone}`}>{message.phone}</a>
              </p>
              <p className="admin-message-body">{message.message}</p>
            </article>
          ))}
        </section>
      ) : (
        <section className="admin-list" aria-label="תרומות שהתקבלו">
          {donations.length === 0 ? <p className="admin-state">אין תרומות להצגה.</p> : donations.map((donation) => (
            <article className="admin-entry" key={donation.id}>
              <div className="admin-entry-heading">
                <div>
                  <h2>₪{donation.amount} · {paymentTypeLabels[donation.paymentType]}</h2>
                  <p>{formatDate(donation.createdAt)}</p>
                </div>
                <span className={`admin-donation-status status-${donation.status.toLowerCase()}`}>
                  {donationStatusLabels[donation.status]}
                </span>
              </div>
              <p className="admin-contact-links">
                <span>{donation.donorName ?? 'שם לא נמסר'}</span>
                {donation.donorEmail && <a href={`mailto:${donation.donorEmail}`}>{donation.donorEmail}</a>}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default AdminPage;
