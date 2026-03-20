import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import api from '../api';

export const ageGroupOptions = [
  { value: '', label: 'All ages' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];

const initialFilters = {
  search: '',
  species: '',
  breed: '',
  ageGroup: '',
  page: 1,
};

export function usePets() {
  const [filters, setFilters] = useState(initialFilters);
  const deferredSearch = useDeferredValue(filters.search);
  const [listingState, setListingState] = useState({
    items: [],
    pagination: null,
    filterOptions: {
      species: [],
      breeds: [],
    },
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isActive = true;

    async function loadPets() {
      setListingState((current) => ({
        ...current,
        loading: true,
        error: '',
      }));

      try {
        const { data } = await api.get('/pets', {
          params: {
            page: filters.page,
            limit: 6,
            search: deferredSearch,
            species: filters.species,
            breed: filters.breed,
            ageGroup: filters.ageGroup,
          },
        });

        if (!isActive) {
          return;
        }

        setListingState({
          items: data.items,
          pagination: data.pagination,
          filterOptions: {
            species: data.filters.species,
            breeds: data.filters.breeds,
          },
          loading: false,
          error: '',
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setListingState((current) => ({
          ...current,
          items: [],
          loading: false,
          error:
            error.response?.data?.message ||
            'Unable to load pets right now. Check the API and database connection.',
        }));
      }
    }

    loadPets();

    return () => {
      isActive = false;
    };
  }, [deferredSearch, filters.ageGroup, filters.breed, filters.page, filters.species]);

  function updateFilter(event) {
    const { name, value } = event.target;

    startTransition(() => {
      setFilters((current) => ({
        ...current,
        [name]: value,
        page: 1,
      }));
    });
  }

  function goToPage(page) {
    startTransition(() => {
      setFilters((current) => ({
        ...current,
        page,
      }));
    });
  }

  return {
    filters,
    listingState,
    updateFilter,
    goToPage,
  };
}

