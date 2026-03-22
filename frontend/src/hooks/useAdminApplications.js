import { useEffect, useState } from 'react';
import api from '../api';

export function useAdminApplications(user) {
  const [adminApplicationsState, setAdminApplicationsState] = useState({
    items: [],
    loading: false,
    error: '',
    success: '',
  });

  useEffect(() => {
    let isActive = true;

    if (!user || user.role !== 'admin') {
      setAdminApplicationsState({
        items: [],
        loading: false,
        error: '',
        success: '',
      });
      return undefined;
    }

    async function loadApplications() {
      setAdminApplicationsState((current) => ({
        ...current,
        loading: true,
        error: '',
      }));

      try {
        const { data } = await api.get('/adoptions/admin/all');

        if (!isActive) {
          return;
        }

        setAdminApplicationsState({
          items: data.items,
          loading: false,
          error: '',
          success: '',
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setAdminApplicationsState({
          items: [],
          loading: false,
          error: error.response?.data?.message || 'Unable to load admin applications.',
          success: '',
        });
      }
    }

    loadApplications();

    return () => {
      isActive = false;
    };
  }, [user]);

  async function refreshApplications() {
    if (!user || user.role !== 'admin') {
      return;
    }

    const { data } = await api.get('/adoptions/admin/all');
    setAdminApplicationsState((current) => ({
      ...current,
      items: data.items,
      loading: false,
      error: '',
    }));
  }

  async function reviewApplication(id, status) {
    try {
      const { data } = await api.patch(`/adoptions/${id}/status`, { status });
      await refreshApplications();
      setAdminApplicationsState((current) => ({
        ...current,
        success: data.message,
        error: '',
      }));
    } catch (error) {
      setAdminApplicationsState((current) => ({
        ...current,
        error: error.response?.data?.message || 'Unable to update application.',
      }));
    }
  }

  return {
    adminApplicationsState,
    reviewApplication,
  };
}

