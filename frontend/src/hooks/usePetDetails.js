import { useEffect, useState } from 'react';
import api from '../api';

export function usePetDetails(selectedPetId) {
  const [detailState, setDetailState] = useState({
    item: null,
    loading: false,
    error: '',
  });

  useEffect(() => {
    let isActive = true;

    if (!selectedPetId) {
      setDetailState({
        item: null,
        loading: false,
        error: '',
      });
      return undefined;
    }

    async function loadPetDetails() {
      setDetailState({
        item: null,
        loading: true,
        error: '',
      });

      try {
        const { data } = await api.get(`/pets/${selectedPetId}`, {
          params: {
            _: Date.now(),
          },
        });

        if (!isActive) {
          return;
        }

        if (!data?.item) {
          setDetailState({
            item: null,
            loading: false,
            error: 'Unable to load pet details right now. Please try again.',
          });
          return;
        }

        setDetailState({
          item: data.item,
          loading: false,
          error: '',
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setDetailState({
          item: null,
          loading: false,
          error:
            error.response?.data?.message ||
            'Unable to load pet details right now. Please try again.',
        });
      }
    }

    loadPetDetails();

    return () => {
      isActive = false;
    };
  }, [selectedPetId]);

  return detailState;
}

