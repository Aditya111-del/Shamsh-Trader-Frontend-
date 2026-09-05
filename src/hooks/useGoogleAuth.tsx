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
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleAuthResponse = async (payload: { access_token?: string; credential?: string; demoUser?: any }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', payload);
      const user = response.data;
      login(user);
      toast.success(`Welcome, ${user.name || 'Trader'}!`);
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Google authentication failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      // Show helpful modal with explanation and instant 1-click demo login
      setShowConfigModal(true);
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      toast.error('Google Sign-In SDK is loading. Please try again in a moment.');
      return;
    }

    try {
      setIsLoading(true);
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              toast.error(`Google Sign-In: ${tokenResponse.error}`);
            }
            return;
          }
          if (tokenResponse.access_token) {
            handleGoogleAuthResponse({ access_token: tokenResponse.access_token });
          }
        },
        error_callback: (err: any) => {
          setIsLoading(false);
          toast.error('Google Sign-In popup failed or was blocked.');
          console.error(err);
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Failed to initialize Google Sign-In');
    }
  };

  const loginWithDemoGoogle = async (customEmail?: string, customName?: string) => {
    setShowConfigModal(false);
    await handleGoogleAuthResponse({
      demoUser: {
        email: customEmail || 'google.trader@example.com',
        name: customName || 'Google Trader',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      },
    });
  };

  return {
    signInWithGoogle,
    loginWithDemoGoogle,
    isLoading,
    showConfigModal,
    setShowConfigModal,
  };
}
