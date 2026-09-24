import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

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
  onSubmit?: SubmitHandler<IContactInput>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess,
  idPrefix = 'form',
  onSubmit: onSubmitProp,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IContactInput>();

  const onSubmit: SubmitHandler<IContactInput> = (data) => {
    onSubmitProp?.(data);
    reset();
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form" noValidate>
      {isSubmitSuccessful && (
        <div className="success-message">
          הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.
        </div>
      )}

      <div className="form-group">
        <label htmlFor={`${idPrefix}-firstName`}>שם פרטי</label>
        <input
          id={`${idPrefix}-firstName`}
          type="text"
          placeholder="שם פרטי"
          {...register('firstName', { required: 'שדה חובה' })}
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
          {...register('lastName', { required: 'שדה חובה' })}
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
          placeholder="מספר טלפון"
          {...register('phone', {
            required: 'שדה חובה',
            pattern: {
              value: /^0\d{8,9}$/,
              message: 'מספר טלפון לא תקין',
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
          {...register('message', { required: 'שדה חובה' })}
          className={errors.message ? 'input-error' : ''}
        />
        {errors.message && (
          <span className="error-msg">{errors.message.message}</span>
        )}
      </div>

      <button type="submit" className="contact-submit-btn">
        שלח הודעה
      </button>
    </form>
  );
};