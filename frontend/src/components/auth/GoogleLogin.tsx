import { GoogleLogin as GoogleOAuthButton, CredentialResponse } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { loginWithGoogle, logout } from '@/features/auth/authSlice';
import { toast } from 'sonner';
import { LogOut, User } from 'lucide-react';

export default function GoogleLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        await dispatch(loginWithGoogle(response.credential)).unwrap();
        toast.success('Welcome back, ' + (user?.name || 'User') + '!');
      } catch (err: any) {
        toast.error(err || 'Failed to login with Google');
      }
    }
  };

  const handleError = () => {
    toast.error('Google Login failed. Please try again.');
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-border shadow-sm">
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full border border-primary/20" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground leading-tight">{user.name}</span>
          <span className="text-[10px] text-mutedfg">{user.email}</span>
        </div>
        <button 
          onClick={() => dispatch(logout())}
          className="ml-1 p-2 rounded-full hover:bg-muted text-mutedfg transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="google-login-container">
      <GoogleOAuthButton
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="pill"
        theme="outline"
        text="signin_with"
        width="240"
      />
    </div>
  );
}
