import React from 'react'
import Link from 'next/link'

export type IconMenuButtonProps = {
  iconSrc: string
  label: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  href?: string
}

const baseStyle =
  'flex flex-col items-center justify-center w-full h-[90px] p-1.5 rounded-2xl border border-[#E0E0E0] bg-white shadow active:scale-95 transition-all duration-100 select-none cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';

const IconMenuButton: React.FC<IconMenuButtonProps> = ({
  iconSrc,
  label,
  onClick,
  className = '',
  disabled = false,
  href,
}) => {
  const content = (
    <div className="border border-[#E5E5E5] w-full h-full block rounded-xl p-2">
      <div className="flex flex-col items-center">
        <img src={iconSrc} alt="" className="w-10 h-10 object-contain" />
        <span className="text-xs text-[#444] font-bold whitespace-pre">{label}</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyle} ${className} ${disabled ? 'pointer-events-none' : ''}`}>{content}</Link>
    );
  }
  return (
    <button
      type="button"
      className={`${baseStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default IconMenuButton;
