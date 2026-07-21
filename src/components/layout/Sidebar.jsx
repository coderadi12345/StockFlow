import { NavLink } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineBuildingOffice2,
  HiOutlineBuildingStorefront,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { APP_NAME } from '../../constants';

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: HiOutlineSquares2X2,
  },
  { to: '/products', label: 'Products', icon: HiOutlineCube },
  { to: '/categories', label: 'Categories', icon: HiOutlineTag },
  {
    to: '/suppliers',
    label: 'Suppliers',
    icon: HiOutlineBuildingOffice2,
  },
  {
    to: '/warehouses',
    label: 'Warehouses',
    icon: HiOutlineBuildingStorefront,
  },
  { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
  {
    to: '/settings',
    label: 'Settings',
    icon: HiOutlineCog6Tooth,
  },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-overlay ${open ? 'hidden max-[980px]:block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`glass fixed top-0 bottom-0 left-0 z-[80] flex w-sidebar flex-col border-r border-border bg-bg-sidebar px-[0.9rem] py-[1.1rem] max-[980px]:-translate-x-[105%] max-[980px]:transition-transform max-[980px]:duration-[250ms] max-[980px]:ease-in-out ${
          open ? 'max-[980px]:translate-x-0' : ''
        }`}
      >
        <div className="flex items-center gap-3 px-[0.55rem] pt-[0.35rem] pb-[1.1rem]">
          <div
            className="grid size-[38px] place-items-center rounded-md bg-linear-to-br from-[#0f766e] via-[#0d9488] to-[#c2410c] shadow-[0_8px_18px_rgba(15,118,110,0.28)]"
            aria-hidden
          >
            <span className="size-3.5 rotate-12 rounded-[4px] border-[2.5px] border-white" />
          </div>
          <div>
            <strong className="block text-[1.05rem] tracking-[-0.02em]">{APP_NAME}</strong>
            <small className="text-[0.72rem] text-fg-muted">Inventory OS</small>
          </div>
          <button
            type="button"
            className="ml-auto hidden size-[34px] place-items-center rounded-[10px] border-none bg-bg-muted text-fg-secondary cursor-pointer max-[980px]:grid"
            onClick={onClose}
            aria-label="Close menu"
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-[0.3rem]">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-[0.7rem] rounded-md px-[0.85rem] py-3 text-[0.92rem] font-semibold transition-all duration-[180ms] ease-in-out ${
                  isActive
                    ? 'bg-accent-soft text-accent'
                    : 'text-fg-secondary hover:bg-bg-muted hover:text-fg'
                }`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-border p-[0.85rem]">
          <p className="text-[0.82rem] font-[650]">Inventory Workspace</p>
          <small className="text-[0.72rem] text-fg-muted">
            Products · Stock · Warehouses
          </small>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
