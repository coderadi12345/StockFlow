import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useProducts } from '../../hooks/useProducts';
import { APP_NAME, STORAGE_KEYS } from '../../constants';
import { toast } from 'react-toastify';

function Settings() {
  const { logout } = useAuth();
  const { theme, setLight, setDark } = useTheme();
  const { fetchProducts } = useProducts();
  const navigate = useNavigate();

  const clearLocalData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS_OVERRIDE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.WAREHOUSES);
    localStorage.removeItem(STORAGE_KEYS.WAREHOUSE_STOCK);
    localStorage.removeItem(STORAGE_KEYS.WAREHOUSE_OPS);
    toast.success('Local inventory data cleared');
    fetchProducts();
    window.location.reload();
  };

  return (
    <div className="page flex flex-col gap-4">
      <Breadcrumb items={[{ label: 'Settings' }]} />

      <header>
        <h1 className="text-[clamp(1.55rem,2.4vw,2rem)] tracking-[-0.03em]">
          Settings
        </h1>
        <p className="mt-1 text-fg-muted">
          Control appearance and local workspace data for {APP_NAME}.
        </p>
      </header>

      <section className="glass rounded-xl px-5 py-[1.2rem]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h3 className="mb-[0.3rem] text-[1.05rem]">Appearance</h3>
            <p className="max-w-[58ch] text-[0.88rem] text-fg-muted">
              Switch between light and dark themes. Preference is saved locally.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={setLight}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={setDark}
            >
              Dark
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </section>

      <section className="glass rounded-xl px-5 py-[1.2rem]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h3 className="mb-[0.3rem] text-[1.05rem]">Local inventory data</h3>
            <p className="max-w-[58ch] text-[0.88rem] text-fg-muted">
              Product add/edit/delete changes are stored in localStorage over DummyJSON
              data. Reset to restore the original catalog snapshot.
            </p>
          </div>
          <Button variant="outline" onClick={clearLocalData}>
            Reset local changes
          </Button>
        </div>
      </section>

      <section className="glass rounded-xl px-5 py-[1.2rem]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h3 className="mb-[0.3rem] text-[1.05rem]">Session</h3>
            <p className="max-w-[58ch] text-[0.88rem] text-fg-muted">
              Sign out so you can sign in with a different account.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
