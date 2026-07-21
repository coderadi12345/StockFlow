import { useTheme } from '../../hooks/useTheme';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`grid size-10 place-items-center rounded-md border border-border bg-bg-elevated text-fg-secondary cursor-pointer transition-[background,color,transform] duration-[180ms] ease-in-out hover:-translate-y-px hover:text-accent ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
    </button>
  );
}

export default ThemeToggle;
