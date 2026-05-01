/**
 * Login page — demo credentials pre-filled for hackathon.
 */
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Pill } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notify';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Login — MediSave' },
      { name: 'description', content: 'Sign in to MediSave to save your prescriptions and track savings.' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('demo@medisave.in');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = await login(email, password);
    if (ok) {
      notify.success('Welcome back! 👋');
      navigate({ to: '/dashboard' });
    } else {
      notify.error('Invalid credentials. Use demo@medisave.in / demo1234');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center gap-2" aria-label="MediSave home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Pill className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MediSave</span>
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-mutedfg">Sign in to track your medicine savings</p>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-lg bg-primary/8 px-4 py-3">
          <p className="text-xs font-semibold text-primary">Demo credentials</p>
          <p className="mt-0.5 font-mono text-xs text-foreground">demo@medisave.in / demo1234</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              placeholder="you@example.com"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg border bg-background px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
                placeholder="••••••••"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedfg hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-sm text-mutedfg">
          <Link to="/" className="font-medium text-primary hover:underline">
            Skip login — browse medicines →
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-mutedfg/60">
          Not medical advice · Prices updated daily
        </p>
      </motion.div>
    </div>
  );
}
