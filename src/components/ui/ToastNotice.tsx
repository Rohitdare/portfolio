'use client';

interface ToastNoticeProps {
  message: string;
  visible: boolean;
}

export default function ToastNotice({ message, visible }: ToastNoticeProps) {
  return (
    <div id="toast-notice" className={`toast-notice ${visible ? 'show' : ''}`} role="alert">
      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--vermilion)' }}>
        terminal
      </span>
      <span className="toast-text">{message}</span>
    </div>
  );
}
