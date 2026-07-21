import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

function Pagination({ page, totalPages, onPageChange, total, pageSize }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  for (let i = start; i <= end; i += 1) pages.push(i);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btnClass =
    'min-w-9 h-9 grid place-items-center border border-border rounded-[10px] bg-bg-elevated text-fg-secondary cursor-pointer transition-all duration-[180ms] ease-in-out disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-accent hover:enabled:text-accent';

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-[0.85rem] max-sm:flex-col max-sm:items-stretch">
      <p className="text-[0.85rem] text-fg-muted">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-[0.35rem] max-sm:justify-center">
        <button
          type="button"
          className={btnClass}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <HiChevronLeft size={18} />
        </button>
        {start > 1 && (
          <>
            <button type="button" className={btnClass} onClick={() => onPageChange(1)}>
              1
            </button>
            {start > 2 && <span className="px-[0.2rem] text-fg-muted">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`${btnClass} ${
              p === page
                ? '!bg-accent !border-accent !text-white hover:!border-accent hover:!text-white'
                : ''
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-[0.2rem] text-fg-muted">…</span>}
            <button type="button" className={btnClass} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
        <button
          type="button"
          className={btnClass}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <HiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
