import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ThemeToggle from '../../components/ui/ThemeToggle';
import HeroOrbit from '../../components/common/HeroOrbit';
import { APP_NAME, APP_TAGLINE } from '../../constants';

function Register() {
  const { register: registerAccount, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    document.title = `Create account | ${APP_NAME}`;
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      await registerAccount({
        username: values.username.trim(),
        password: values.password,
        email: values.email.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      });
      navigate('/dashboard', { replace: true });
    } catch {
      /* toast handled in context */
    }
  };

  return (
    <div
      className="relative grid min-h-screen grid-cols-[1.15fr_1fr] max-[960px]:grid-cols-1"
      style={{ background: 'var(--bg-hero)' }}
    >
      <div className="absolute top-[1.1rem] right-[1.1rem] z-[5]">
        <ThemeToggle />
      </div>

      <motion.section
        className="relative grid place-items-center overflow-hidden p-12 max-[960px]:min-h-[36vh] max-[960px]:px-5 max-[960px]:pt-8 max-[960px]:pb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <HeroOrbit className="absolute inset-[6%_6%_auto_auto] w-[min(400px,58%)] opacity-95 max-[960px]:inset-[auto_4%_4%_auto] max-[960px]:w-[190px] max-[960px]:opacity-60" />
        <div className="relative z-[1] max-w-[480px]">
          <p className="font-display text-[clamp(2.8rem,5vw,4.2rem)] leading-[0.95] tracking-[-0.03em] mb-[1.4rem]">
            {APP_NAME}
          </p>
          <h1 className="max-w-[14ch] text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.03em]">
            Create your workspace
            <em className="font-display italic font-normal text-accent">
              {' '}
              in seconds.
            </em>
          </h1>
          <p className="mt-4 max-w-[36ch] text-[1.02rem] text-fg-secondary">
            {APP_TAGLINE}. Sign up locally — your account stays in this browser.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="grid place-items-center p-8 max-[960px]:px-[1.15rem] max-[960px]:pt-4 max-[960px]:pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <form
          className="glass flex w-[min(100%,420px)] flex-col gap-[0.95rem] rounded-xl p-7"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
        >
          <div>
            <h2 className="text-[1.45rem] tracking-[-0.02em]">Create account</h2>
            <p className="mt-[0.3rem] mb-[0.35rem] text-[0.92rem] text-fg-muted">
              Choose a username and password you will use to sign in.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
            <Input
              label="First name"
              placeholder="Adi"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last name"
              placeholder="Sharma"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email"
            type="email"
            leftIcon={<HiOutlineEnvelope size={16} />}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
          />

          <Input
            label="Username"
            leftIcon={<HiOutlineUser size={16} />}
            placeholder="Choose a username"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
            })}
          />

          <Input
            label="Password"
            type="password"
            leftIcon={<HiOutlineLockClosed size={16} />}
            placeholder="Create a password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 4, message: 'Minimum 4 characters' },
            })}
          />

          <Input
            label="Confirm password"
            type="password"
            leftIcon={<HiOutlineLockClosed size={16} />}
            placeholder="Repeat password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Create account
          </Button>

          <p className="text-center text-[0.86rem] text-fg-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-[650] text-accent">
              Sign in
            </Link>
          </p>
        </form>
      </motion.section>
    </div>
  );
}

export default Register;
