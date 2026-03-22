import { useEffect, useState } from 'react';
import api from '../api';

export function useMyApplications(user) {
  const [applicationState, setApplicationState] = useState({
    items: [],
    loading: false,
    error: '',
  });

  useEffect(() => {
    let isActive = true;

    if (!user) {
      setApplicationState({
        items: [],
        loading: false,
        error: '',
      });
      return undefined;
    }

    async function loadApplications() {
      setApplicationState({
        items: [],
        loading: true,
        error: '',
      });

      try {
        const { data } = await api.get('/adoptions/me');

        if (!isActive) {
          return;
        }

        setApplicationState({
          items: data.items,
          loading: false,
          error: '',
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setApplicationState({
          items: [],
          loading: false,
          error: error.response?.data?.message || 'Unable to load your applications.',
        });
      }
    }

    loadApplications();

    return () => {
      isActive = false;
    };
  }, [user]);

  return {
    applicationState,
    async refreshApplications() {
      if (!user) {
        return;
      }

      const { data } = await api.get('/adoptions/me');
      setApplicationState({
        items: data.items,
        loading: false,
        error: '',
      });
    },
  };
}

