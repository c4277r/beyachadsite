import React, { useState, useEffect, useRef } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import Navbar from '../components/Navbar';
import { ContactForm, type IContactInput } from './ContactForm';
import logoImg from '../images/logo.png';
import { DonateModal, type DonateModalType } from './DonateModel';
import { FlipCard } from './FlipCard';

// יבוא התמונות לכרטיסי העשייה
import educationalImg from '../images/Educational assistance.png';
import mentoringImg from '../images/Mentoring.png';
import workshopsImg from '../images/Workshops.png';
import Kits from '../images/Kits.png';

// יבוא התמונות לגלריה
import img0 from '../images/activity.png';
import img1 from '../images/activity1.png';
import img2 from '../images/activity2.png';
import img3 from '../images/activity3.png';
import img4 from '../images/activity4.png';
import img5 from '../images/activity5.png';
import img6 from '../images/activity6.png';
import img7 from '../images/activity7.png';
import img9 from '../images/activity9.png';
import img10 from '../images/activity10.png';
import img11 from '../images/activity11.png';
import img12 from '../images/activity12.png';

import './stylepages/HomePage.css';

interface HomePageProps {
  onNavigateToDonate?: () => void;
}

export const Home: React.FC<HomePageProps> = ({ onNavigateToDonate }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeDonateModal, setActiveDonateModal] = useState<DonateModalType>(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const galleryRef = useRef<HTMLElement | null>(null);

  // סגירת מודאל צור קשר בלחיצה על מקש ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContactOpen(false);
      }
    };

    if (isContactOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isContactOpen]);

  // IntersectionObserver לטעינה ואנימציה של הגלריה
  useEffect(() => {
    const target = galleryRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsGalleryVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const galleryImages = [
    { id: 0, src: img0, alt: 'עמותה בפעילות' },
    { id: 1, src: img1, alt: 'עמותה בפעילות' },
    { id: 2, src: img2, alt: 'עמותה בפעילות' },
    { id: 3, src: img3, alt: 'עמותה בפעילות' },
    { id: 4, src: img4, alt: 'עמותה בפעילות' },
    { id: 5, src: img5, alt: 'עמותה בפעילות' },
    { id: 6, src: img6, alt: 'עמותה בפעילות' },
    { id: 7, src: img7, alt: 'עמותה בפעילות' },
    { id: 9, src: img9, alt: 'עמותה בפעילות' },
    { id: 10, src: img10, alt: 'עמותה בפעילות' },
    { id: 11, src: img11, alt: 'עמותה בפעילות' },
    { id: 12, src: img12, alt: 'עמותה בפעילות' },
  ];

  const onSubmitModal: SubmitHandler<IContactInput> = (data) => {
    void data;
    setIsContactOpen(false);
  };

  const onSubmitBottom: SubmitHandler<IContactInput> = (data) => {
    void data;
  };

  const handleOpenContact = () => setIsContactOpen(true);
  const handleCloseContact = () => setIsContactOpen(false);

  const handleNavigateToDonate = () => {
    if (onNavigateToDonate) {
      onNavigateToDonate();
    }
  };

  return (
    <div className="home-container">
      <Navbar onOpenContact={handleOpenContact} onNavigateToDonate={handleNavigateToDonate} />

      {/* Hero Section */}
      <main className="home-hero">
        <div className="gold-decorations-wrapper">
          <svg
            viewBox="0 0 1200 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="gold-decor-svg"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F6D365" />
                <stop offset="30%" stopColor="#FDA085" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#F3A152" />
                <stop offset="100%" stopColor="#E6C875" />
              </linearGradient>
            </defs>
            <path
              d="M -50 180 Q 150 290 300 150 T 600 120 T 900 220 T 1250 100"
              stroke="url(#goldGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M -20 120 C 120 20 220 250 350 180 C 500 100 700 260 850 140 C 1000 30 1150 180 1250 150"
              stroke="url(#goldGradient)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 50 220 Q 200 80 400 200 T 800 180 T 1150 250"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="home-logo-container">
          <img src={logoImg} alt="Logo" className="home-logo" />
        </div>

        <div className="curved-text-container">
          <svg viewBox="0 0 500 150" className="curved-svg">
            <path id="curve" fill="transparent" d="M 50 20 Q 250 200 450 20" />
            <text className="curved-text-content">
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                הבית השלם של הילדים.
              </textPath>
            </text>
          </svg>
        </div>
      </main>

      {/* section אודותינו */}
      <section id="about-us" className="about-section">
        <h2 className="about-title">אודות בית ביחד</h2>
        <p className="about-text">
          עמותת "בית ביחד" הוקמה כדי להעניק מעטפת חמה, מקיפה ואוהבת לילדים להורים גרושים ולבני משפחותיהם.
          מתוך אמונה שלכל ילד מגיעה תחושת ביטחון ושמחה, העמותה דואגת לכל צרכיהם הפיזיים – מארוחות חמות וביגוד ועד למשחקים, תעסוקה ומתנות.
          לצד התמיכה החומרית, מתנדבי העמותה מעניקים לילדים מלווים מסורים, זמן איכות, אוזן קשבת והמון חום ואכפתיות.
          כלל השירותים והפעילויות ניתנים בחינם לחלוטין, במטרה להקל על ההורים ולהבטיח לכל ילד בית תומך ומחבק.
        </p>
        <button className="contact-submit-btn" style={{ marginTop: '20px' }} onClick={handleOpenContact}>
          לכל דבר מוזמנים ליצור איתנו קשר
        </button>
      </section>

      {/* section העשייה שלנו */}
      <section id="our-work" className="work-section">
        <div className="work-header">
          <h2 className="work-title">ככה העמותה שלנו משמחת ומחזקת ילדים:</h2>
        </div>

        <div className="cards-grid">
          <FlipCard
            title="תמיכה חומרית וציוד"
            text="דואגים לכל הצרכים הפיזיים: מארוחות חמות וביגוד איכותי ועד למשחקים ומתנות שמשמחות את הלב."
          />
          <FlipCard
            title="חונכות וזמן איכות"
            text="מלווים מסורים שמעניקים לילדים יחס אישי, אוזן קשבת, עזרה בלימודים והמון חום ואכפתיות."
            imgSrc={mentoringImg}
            imgAlt="חונכות וזמן איכות"
          />
          <FlipCard
            title="פעילויות וימי כיף"
            text="מארגנים ימי שיא, סדנאות חווייתיים ואירועים מיוחדים כדי להעניק לילדים רגעים של שמחה וגיבוש."
          />
          <FlipCard
            title="סיוע לימודי"
            text="מערך עזרה בהכנת שיעורי בית, תגבורים לימודיים והכנה למבחנים כדי להבטיח הצלחה וביטחון עצמי."
            imgSrc={educationalImg}
            imgAlt="סיוע לימודי"
          />
          <FlipCard
            title="סדנאות והעצמה"
            text="חוגים יצירתיים, סדנאות מיומנויות חיים ופעילויות המעניקות לילדים כלים להתפתחות אישית ורגשית."
            imgSrc={workshopsImg}
            imgAlt="סדנאות והעצמה"
          />
          <FlipCard
            title="ערכות חג ומתנות"
            text="חלוקת ערכות חגיגיות, מתנות ימי הולדת והפתעות שמביאות אור וחיוך לכל בית."
            imgSrc={Kits}
            imgAlt="ערכות חג ומתנות"
          />
        </div>
      </section>

      {/* section גלריה */}
      <section
        id="gallery"
        ref={galleryRef}
        className={`gallery-section ${isGalleryVisible ? 'animate' : ''}`}
      >
        <h2 className="gallery-title">העמותה בפעילות</h2>
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item"
              style={{ '--i': index } as React.CSSProperties}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="gallery-image" 
                loading="lazy"
                decoding="async"
              />
              <div className="gallery-overlay"></div>
            </div>
          ))}
        </div>
      </section>

      {/* section מילים מהלב */}
      <section id="words-of-kids" className="words-section">
        <h2 className="words-title">מילים מהלב - מה שילדים מספרים:</h2>
        <div className="quotes-grid">
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p className="quote-text">
              "מאז שהגעתי ל'בית ביחד', הרגשתי שפתאום יש לי מקום שבו באמת מבינים אותי. מעבר לזה שיש שם ארוחה חמה, משחקים וכל מה שאני צריך, הכי חשוב לי זה שיש מי שמקשיב לי, נותן לי זמן מכל הלב ומשרה עליי תחושה שאני לא לבד. זה מביא לי המון שקט ושמחה."
            </p>
            <div className="quote-author">- חיים, בן 16</div>
          </div>
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p className="quote-text">
              הימי כיף והמתנות שקיבלנו בחגים גרמו לי להרגיש שדואגים לנו ושמחים איתנו. זה נותן לי המון כוח וחיוך.
            </p>
            <div className="quote-author">- ישראל, בן 10</div>
          </div>
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p className="quote-text">
              "מאז שבאתי ל'בית ביחד' הכל נהיה לי הרבה יותר קל וכיף. תמיד מחכים לי שם חיוך גדול, ארוחה טעימה, משחקים ומתנות, אבל הכי כיף זה שיש מישהו שיושב איתי, משחק איתי ומקשיב לי באמת. זה עושה לי הכי טוב על הלב שאפשר!"
            </p>
            <div className="quote-author">- שלומי, בן 11</div>
          </div>
        </div>
      </section>

      {/* section שאלות ותשובות */}
      <section id="faq" className="faq-section">
        <h2 className="faq-main-title">שאלות ותשובות</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <div className="faq-header">
              <h3 className="faq-question">למי מיועדות הפעילויות שלנו?</h3>
            </div>
            <div className="faq-body">
              <p className="faq-answer">
                הפעילויות שלנו מיועדות באהבה לילדים להורים גרושים, החל מגיל צעיר ועד ליום חתונתם. אנחנו כאן בשביל כל ילד שזקוק לרגע של הקלה, משענת של תמיכה, ושמחה אמיתית.
              </p>
            </div>
          </div>
          <div className="faq-card">
            <div className="faq-header">
              <h3 className="faq-question">איך פונים אלינו?</h3>
            </div>
            <div className="faq-body">
              <p className="faq-answer">
                הדרך להצטרף למשפחת "בית ביחד" פשוטה ונגישה לכולם. כל שנדרש הוא להגיע למזכירות העמותה, לבצע הרשמה קצרה – ומאותו רגע תוכלו ליהנות מכל המעטפת, הפעילויות והתמיכה שיש לנו להציע.
              </p>
            </div>
          </div>
          <div className="faq-card">
            <div className="faq-header">
              <h3 className="faq-question">מה מייחד אותנו מעמותות אחרות?</h3>
            </div>
            <div className="faq-body">
              <p className="faq-answer">
                מה שמאפיין את "בית ביחד" יותר מכל הוא הנוכחות האמיתית והאכפתית שלנו לצד הילדים. אנחנו לא רק מעניקים סיוע, אלא נמצאים כאן בשבילם בכל רגע – בלב פתוח ובקשר אישי בגובה העיניים.
              </p>
            </div>
          </div>
          <div className="faq-card">
            <div className="faq-header">
              <h3 className="faq-question">למי מיועדת העמותה?</h3>
            </div>
            <div className="faq-body">
              <p className="faq-answer">
                עמותת "בית ביחד" מיועדת לילדים ולבני נוער להורים גרושים, החל מגיל קטן ועד לצעדים הראשונים בבניית בית משלהם, וכן למשפחותיהם.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section תרומה */}
      <section id="donate" className="donate-section">
        <div className="donate-container-box">
          <h2 className="donate-section-title">שותפים לשינוי</h2>
          <p className="donate-section-subtitle">
            בזכות התרומה שלכם, אנחנו יכולים להמשיך להעניק חום, בית, שמחה ותמיכה מלאה לילדים.
          </p>

          <div className="donate-cards-grid-layout">
            <div className="donate-row top-row">
              <div className="donate-card-box">
                <div className="donate-card-icon-svg">
                  <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm-4 8H7v-2h6v2z"/></svg>
                </div>
                <h3 className="donate-card-title-text">תרומה בהוראת קבע</h3>
                <button className="donate-card-action-btn" onClick={() => setActiveDonateModal('horatKava')}>
                  לתרומה &larr;
                </button>
              </div>

              <div className="donate-card-box">
                <div className="donate-card-icon-svg">
                  <svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
                </div>
                <h3 className="donate-card-title-text">תרומה בביט</h3>
                <button className="donate-card-action-btn" onClick={handleNavigateToDonate}>
                  לתרומה &larr;
                </button>
              </div>

              <div className="donate-card-box featured">
                <div className="donate-card-icon-svg">
                  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                </div>
                <h3 className="donate-card-title-text">תרומה בכרטיס אשראי</h3>
                <button className="donate-card-action-btn" onClick={handleNavigateToDonate}>
                  לתרומה &larr;
                </button>
              </div>
            </div>

            <div className="donate-row bottom-row">
              <div className="donate-card-box">
                <div className="donate-card-icon-svg">
                  <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <h3 className="donate-card-title-text">תרומה בשיחת טלפון</h3>
                <div className="donate-card-text-details">
                  בטלפון מס': <strong>0538207000</strong>
                </div>
                <button className="donate-card-action-btn" onClick={() => setActiveDonateModal('phone')}>
                  לתרומה &larr;
                </button>
              </div>

              <div className="donate-card-box">
                <div className="donate-card-icon-svg">
                  <svg viewBox="0 0 24 24"><path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zM12 1L2 6v2h20V6z"/></svg>
                </div>
                <h3 className="donate-card-title-text">תרומה בהעברה בנקאית</h3>
                <div className="donate-card-text-details">
                  מזרחי טפחות סניף <strong>430</strong> | מספר חשבון <strong>363197</strong><br />
                  ע"ש תמיד לצידכם ע"ר
                </div>
                <button className="donate-card-action-btn" onClick={() => setActiveDonateModal('bank')}>
                  לתרומה &larr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* סעיף צור קשר בתחתית */}
      <section id="contact" className="contact-section">
        <div className="contact-card">
          <h2 className="contact-title">לכל שאלה מוזמנים ליצור איתנו קשר</h2>
          <p className="contact-subtitle">
            אנחנו כאן לכל פנייה, שרבוט או מחשבה. נשמח לחזור אליכם בהקדם!
          </p>
          <ContactForm idPrefix="bottom" onSubmit={onSubmitBottom} />
        </div>
      </section>

      {/* Modal צור קשר */}
      {isContactOpen && (
        <div className="modal-overlay" onClick={handleCloseContact}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseContact} aria-label="סגור">
              &times;
            </button>

            <h2 className="contact-title">לכל שאלה מוזמנים ליצור איתנו קשר</h2>
            <p className="contact-subtitle">
              אנחנו כאן לכל פנייה, שרבוט או מחשבה.
            </p>
            <ContactForm idPrefix="modal" onSubmit={onSubmitModal} />
          </div>
        </div>
      )}

      {/* רכיב מודאל תרומות מופרד */}
      <DonateModal
        type={activeDonateModal}
        onClose={() => setActiveDonateModal(null)}
      />
    </div>
  );
};

export default Home;