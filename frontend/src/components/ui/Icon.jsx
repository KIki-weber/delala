

const icons = {
  close: (
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  note: (
    <path
      d="M9 5h6l4 4v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm6 0v4h4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  price: (
    <path
      d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <path
      d="M20.59 13.41L11 3H3v8l10.59 9.59a2 2 0 0 0 2.82 0l3.18-3.18a2 2 0 0 0 0-2.82z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  location: (
    <path
      d="M12 21s-7-4.35-7-11a7 7 0 0 1 14 0c0 6.65-7 11-7 11z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  phone: (
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.88.31 1.74.57 2.57a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.51-1.13a2 2 0 0 1 2.11-.45c.83.26 1.69.45 2.57.57A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  wrench: (
    <path
      d="M14.7 6.3a4 4 0 0 0-5.66 5.66L3 17.99V21h3.01l6.03-6.04a4 4 0 0 0 5.66-5.66l-2 2-2-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <path
      d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  eye: (
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export default function Icon({ name, className = '', title }) {
  const body = icons[name];
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {body}
    </svg>
  );
}

