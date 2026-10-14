import type { ReactNode } from "react";

interface IconActionButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

export function IconActionButton({ label, onClick, children, disabled = false }: IconActionButtonProps) {
  return (
    <button
      className="flex size-8 items-center justify-center rounded bg-gray-200 enabled:hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
