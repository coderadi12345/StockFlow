import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../../hooks/useTheme';

function ThemeSkeleton({ children }) {
  const { isDark } = useTheme();
  return (
    <SkeletonTheme
      baseColor={isDark ? '#1a2438' : '#e5ebe9'}
      highlightColor={isDark ? '#243049' : '#f4f7f6'}
    >
      {children}
    </SkeletonTheme>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <ThemeSkeleton>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div className="glass rounded-lg p-[1.15rem]" key={i}>
            <Skeleton height={28} width={28} borderRadius={8} />
            <Skeleton height={14} width="40%" style={{ marginTop: 16 }} />
            <Skeleton height={28} width="55%" style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    </ThemeSkeleton>
  );
}

export function ProductCardSkeleton({ count = 8 }) {
  return (
    <ThemeSkeleton>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div className="glass rounded-lg p-[0.9rem]" key={i}>
            <Skeleton height={160} borderRadius={12} />
            <Skeleton height={16} width="70%" style={{ marginTop: 12 }} />
            <Skeleton height={12} width="40%" style={{ marginTop: 8 }} />
            <Skeleton height={20} width="35%" style={{ marginTop: 12 }} />
          </div>
        ))}
      </div>
    </ThemeSkeleton>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <ThemeSkeleton>
      <div className="glass flex flex-col gap-3 rounded-lg p-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="flex items-center gap-[0.85rem] px-1 py-[0.35rem]" key={i}>
            <Skeleton height={42} width={42} borderRadius={10} />
            <div className="flex-1">
              <Skeleton height={14} width="55%" />
              <Skeleton height={10} width="30%" style={{ marginTop: 6 }} />
            </div>
            <Skeleton height={14} width={60} />
            <Skeleton height={14} width={50} />
          </div>
        ))}
      </div>
    </ThemeSkeleton>
  );
}

export function DetailSkeleton() {
  return (
    <ThemeSkeleton>
      <div className="glass grid grid-cols-[1.1fr_1fr] gap-6 rounded-xl p-5 max-md:grid-cols-1">
        <Skeleton height={320} borderRadius={16} />
        <div>
          <Skeleton height={28} width="60%" />
          <Skeleton height={14} width="40%" style={{ marginTop: 12 }} />
          <Skeleton height={80} style={{ marginTop: 20 }} />
          <Skeleton height={40} width="30%" style={{ marginTop: 20 }} />
        </div>
      </div>
    </ThemeSkeleton>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-content-center gap-[0.85rem] text-center text-fg-muted">
      <div className="mx-auto size-[42px] animate-spin rounded-full border-[3px] border-border border-t-accent" />
      <p>Loading…</p>
    </div>
  );
}

export default ThemeSkeleton;
