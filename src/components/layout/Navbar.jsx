import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import ThemeToggle from '../ui/ThemeToggle';
import SearchBar from '../ui/SearchBar';
import { getInitials } from '../../utils/helpers';

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => p.title?.toLowerCase().includes(q)).slice(0, 6);
  }, [products, query]);

  const onDebouncedChange = useCallback(
    (value) => {
      if (value.trim().length >= 2) {
        navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      }
    },
    [navigate]
  );

  return (
    <header className="glass sticky top-0 z-50 flex h-navbar items-center justify-between gap-4 border-b border-border px-5 max-[720px]:px-[0.85rem]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="hidden size-10 place-items-center rounded-md border border-border bg-bg-muted text-fg cursor-pointer max-[980px]:grid"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <HiOutlineBars3 size={22} />
        </button>
        <SearchBar
          value={query}
          onChange={setQuery}
          onDebouncedChange={onDebouncedChange}
          suggestions={suggestions}
          onSuggestionSelect={(item) => navigate(`/products/${item.id}`)}
          placeholder="Instant search…"
          className="max-w-[380px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/profile"
          className="flex items-center gap-[0.65rem] rounded-full border border-border bg-bg-muted py-1 pr-[0.55rem] pl-1 transition-[border-color] duration-[180ms] ease-in-out hover:border-accent"
        >
          {user?.image ? (
            <img src={user.image} alt="" className="size-[34px] rounded-full object-cover" />
          ) : (
            <span className="grid size-[34px] place-items-center rounded-full bg-accent text-[0.75rem] font-bold text-white">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
          )}
          <span className="flex flex-col leading-tight pr-[0.35rem] max-[720px]:hidden">
            <strong className="text-[0.82rem]">
              {user?.firstName} {user?.lastName}
            </strong>
            <small className="text-[0.7rem] text-fg-muted">
              @{user?.username}
            </small>
          </span>
        </Link>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-border bg-bg-elevated text-fg-secondary cursor-pointer hover:border-[rgba(220,38,38,0.35)] hover:text-danger"
          onClick={logout}
          aria-label="Logout"
          title="Logout"
        >
          <HiOutlineArrowRightOnRectangle size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
