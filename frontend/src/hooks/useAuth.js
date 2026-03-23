import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api';

const initialFormState = {
  name: '',
  email: '',
  password: '',
  adminSetupKey: '',
};

export function useAuth() {
  const [mode, setMode] = useState('login');
  const [formState, setFormState] = useState(initialFormState);
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('pet_adoption_token') || '',
    user: null,
    loading: false,
    error: '',
    success: '',
  });

  useEffect(() => {
    if (!authState.token) {
      setAuthToken(null);
      return;
    }

    setAuthToken(authState.token);
    api
      .get('/auth/me')
      .then(({ data }) => {
        setAuthState((current) => ({
          ...current,
          user: data.user,
        }));
      })
      .catch(() => {
        localStorage.removeItem('pet_adoption_token');
        setAuthToken(null);
        setAuthState({
          token: '',
          user: null,
          loading: false,
          error: 'Session expired. Please sign in again.',
          success: '',
        });
      });
  }, [authState.token]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  async function submitAuth(event) {
    event.preventDefault();

    setAuthState((current) => ({
      ...current,
      loading: true,
      error: '',
      success: '',
    }));

    try {
      const payload =
        mode === 'register'
          ? {
              name: formState.name,
              email: formState.email,
              password: formState.password,
            }
          : { email: formState.email, password: formState.password };
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, payload);

      localStorage.setItem('pet_adoption_token', data.token);
      setAuthToken(data.token);
      setFormState(initialFormState);
      setAuthState({
        token: data.token,
        user: data.user,
        loading: false,
        error: '',
        success: mode === 'register' ? 'Account created successfully.' : 'Signed in successfully.',
      });
    } catch (error) {
      setAuthState((current) => ({
        ...current,
        loading: false,
        error: error.response?.data?.message || 'Authentication failed.',
        success: '',
      }));
    }
  }

  function logout() {
    localStorage.removeItem('pet_adoption_token');
    setAuthToken(null);
    setAuthState({
      token: '',
      user: null,
      loading: false,
      error: '',
      success: 'Signed out.',
    });
  }

  return {
    mode,
    setMode,
    formState,
    authState,
    updateField,
    submitAuth,
    logout,
  };
}

