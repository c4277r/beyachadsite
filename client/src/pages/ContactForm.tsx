import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { submitContactMessage, ApiRequestError } from '../lib/api';

// Field rules mirror server/src/utils/validation.ts createContactMessageSchema
// exactly, so a form the user believes is valid never gets rejected server-side.
export interface IContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  idPrefix?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess,
  idPrefix = 'form',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<IContactInput>();

  const onSubmit: SubmitHandler<IContactInput> = async (data) => {
    try {
      await submitContactMessage(data);
      reset();
      onSubmitSuccess?.();
    } catch (error) {
      const message =
        error instanceof ApiRequestError ? error.message : 'שליחת ההודעה נכשלה, אנא נסה שוב';
      setError('root', { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
      {isSubmitSuccessful && (
        <div className="success-message">
          הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.
        </div>
      )}
      {errors.root && (
        <div className="error-msg">{errors.root.message}</div>
      )}

      <div className="form-group">
        <label htmlFor={`${idPrefix}-firstName`}>שם פרטי</label>
        <input
          id={`${idPrefix}-firstName`}
          type="text"
          placeholder="שם פרטי"
          {...register('firstName', { required: 'שדה חובה', minLength: { value: 2, message: 'שם קצר מדי' } })}
          className={errors.firstName ? 'input-error' : ''}
        />
        {errors.firstName && (
          <span className="error-msg">{errors.firstName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-lastName`}>שם משפחה</label>
        <input
          id={`${idPrefix}-lastName`}
          type="text"
          placeholder="שם משפחה"
          {...register('lastName', { required: 'שדה חובה', minLength: { value: 2, message: 'שם קצר מדי' } })}
          className={errors.lastName ? 'input-error' : ''}
        />
        {errors.lastName && (
          <span className="error-msg">{errors.lastName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-email`}>אימייל</label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="אימייל"
          {...register('email', {
            required: 'שדה חובה',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'כתובת אימייל לא תקינה',
            },
          })}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && (
          <span className="error-msg">{errors.email.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-phone`}>מספר טלפון</label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          placeholder="05XXXXXXXX"
          {...register('phone', {
            required: 'שדה חובה',
            pattern: {
              // Must match server's `^05\d{8}$` (Israeli mobile format).
              value: /^05\d{8}$/,
              message: 'מספר טלפון לא תקין (דוגמה: 0501234567)',
            },
          })}
          className={errors.phone ? 'input-error' : ''}
        />
        {errors.phone && (
          <span className="error-msg">{errors.phone.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-message`}>הודעה</label>
        <textarea
          id={`${idPrefix}-message`}
          rows={4}
          placeholder="כתוב את הודעתך כאן..."
          {...register('message', {
            required: 'שדה חובה',
            minLength: { value: 10, message: 'הודעה חייבת להכיל לפחות 10 תווים' },
            maxLength: { value: 2000, message: 'הודעה ארוכה מדי' },
          })}
          className={errors.message ? 'input-error' : ''}
        />
        {errors.message && (
          <span className="error-msg">{errors.message.message}</span>
        )}
      </div>

      <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'שולח...' : 'שלח הודעה'}
      </button>
    </form>
  );
};