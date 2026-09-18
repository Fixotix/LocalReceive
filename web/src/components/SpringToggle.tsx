import React, { useState } from 'react';

interface SpringToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Prototype 27 Switch from transitions.dev
 * Features double-bounce spring physics with overshoot and settling.
 */
export const SpringToggle: React.FC<SpringToggleProps> = ({
  checked,
  onChange,
  ariaLabel = 'Toggle switch',
  disabled = false,
  className = '',
}) => {
  const [isInit, setIsInit] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    if (!isInit) setIsInit(true);
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      data-on={checked ? 'true' : 'false'}
      onClick={handleClick}
      className={`p27-switch ${isInit ? 'is-init' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="p27-thumb" />
    </button>
  );
};
