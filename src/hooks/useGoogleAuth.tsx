import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '139168155004-7kc5pgvf9n58nhi4f2accjfn1qu3n7lq.apps.googleusercontent.com';

const ensureGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      // If already loaded before listener
      if (window.google?.accounts?.oauth2) {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In SDK'));
    document.head.appendChild(script);
  });
};

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuthResponse = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', { access_token: accessToken });
      const user = response.data;
      login(user);
      toast.success(`Welcome, ${user.name || 'Trader'}!`);
      navigate('/');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Google authentication failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Ensure SDK is ready
      await ensureGoogleScript();

      if (!window.google?.accounts?.oauth2) {
        setIsLoading(false);
        toast.error('Google Sign-In SDK is unavailable. Please check your internet connection.');
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              toast.error(`Google Sign-In error: ${tokenResponse.error}`);
            }
            return;
          }
          if (tokenResponse.access_token) {
            handleGoogleAuthResponse(tokenResponse.access_token);
          } else {
            setIsLoading(false);
          }
        },
        error_callback: (err: any) => {
          setIsLoading(false);
          toast.error('Google popup was closed or blocked by browser.');
          console.error('[Google OAuth Error]', err);
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Failed to initialize Google Sign-In');
    }
  };

  return {
    signInWithGoogle,
    isLoading,
  };
}
