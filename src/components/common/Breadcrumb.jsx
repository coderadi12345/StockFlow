import { Link } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi2';

function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[0.85rem] text-fg-muted">
        <li className="inline-flex items-center gap-1">
          <Link
            to="/dashboard"
            aria-label="Dashboard"
            className="text-fg-secondary transition-colors duration-[180ms] ease-in-out hover:text-accent"
          >
            <HiHome size={15} />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              <HiChevronRight className="opacity-55" size={14} />
              {isLast || !item.to ? (
                <span aria-current="page" className="font-semibold text-fg">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-fg-secondary transition-colors duration-[180ms] ease-in-out hover:text-accent"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
