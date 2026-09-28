import React, { useEffect, useRef } from 'react';

interface AccessibleDialogProps {
  titleId: string;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  titleId,
  className = '',
  onClose,
  children,
}) => {
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusableElements = getFocusableElements();
    (focusableElements[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const elements = getFocusableElements();
      if (elements.length === 0) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === elements[0]) {
        event.preventDefault();
        elements[elements.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) {
        event.preventDefault();
        elements[0].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      <section
        ref={dialogRef}
        className={`modal-content ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {children}
      </section>
    </div>
  );
};

export default AccessibleDialog;