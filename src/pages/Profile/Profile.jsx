import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (values) => {
    updateProfile(values);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page flex flex-col gap-[1.15rem]">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      <header>
        <h1 className="text-[clamp(1.55rem,2.4vw,2rem)] tracking-[-0.03em]">
          Profile
        </h1>
        <p className="mt-1 text-fg-muted">
          Manage your account details and workspace preferences.
        </p>
      </header>

      <div className="grid grid-cols-[280px_1fr] items-start gap-4 max-[860px]:grid-cols-1">
        <aside className="glass flex flex-col gap-[0.55rem] rounded-xl p-[1.35rem] text-center">
          <div className="mb-[0.35rem] grid place-items-center">
            {user?.image ? (
              <img
                src={user.image}
                alt=""
                className="size-24 rounded-[28px] object-cover shadow-md"
              />
            ) : (
              <span className="grid size-24 place-items-center rounded-[28px] bg-[linear-gradient(135deg,#0f766e,#c2410c)] text-[1.6rem] font-bold text-white shadow-md">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            )}
          </div>
          <h2 className="text-[1.2rem]">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-[0.88rem] text-fg-muted">@{user?.username}</p>
          <p className="break-all text-[0.88rem] text-fg-muted">{user?.email}</p>

          <div className="mx-0 my-3 mb-[0.35rem] flex items-center justify-between rounded-md bg-bg-muted px-3 py-[0.65rem] text-[0.88rem] font-semibold">
            <span>Theme</span>
            <ThemeToggle />
          </div>

          <Button
            variant="danger"
            fullWidth
            leftIcon={<HiOutlineArrowRightOnRectangle />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </aside>

        <form
          className="glass rounded-xl p-[1.35rem]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-[1.1rem]">Edit profile</h3>
          <p className="my-[0.35rem] mb-4 text-[0.85rem] text-fg-muted">
            Changes are stored locally in your browser for this frontend demo.
          </p>

          <div className="grid grid-cols-2 gap-[0.9rem] max-[860px]:grid-cols-1">
            <Input label="First name" {...register('firstName', { required: true })} />
            <Input label="Last name" {...register('lastName', { required: true })} />
            <Input label="Email" type="email" {...register('email', { required: true })} />
            <Input label="Username" {...register('username', { required: true })} />
          </div>

          <div className="mt-[1.1rem]">
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
