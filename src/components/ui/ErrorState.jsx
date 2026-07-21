import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import Button from './Button';

function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="glass flex flex-col items-center gap-[0.65rem] rounded-xl px-6 py-12 text-center">
      <div className="mb-[0.35rem] grid size-16 place-items-center rounded-[18px] bg-[rgba(220,38,38,0.12)] text-danger">
        <HiOutlineExclamationCircle size={28} />
      </div>
      <h3 className="text-[1.15rem] font-bold">{title}</h3>
      <p className="mb-2 max-w-[360px] text-fg-muted">{message}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export default ErrorState;
