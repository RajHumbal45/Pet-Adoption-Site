import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import api from './api';

const ageGroupOptions = [
  { value: '', label: 'All ages' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];

function App() {
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    breed: '',
    ageGroup: '',
    page: 1,
  });
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

  return (
    <main className="app-shell">
      <section className="hero catalogue-shell">
        <div className="hero-copy">
          <p className="eyebrow">Visitor Experience</p>
          <h1>Find adoptable pets with search, filters, and quick browsing.</h1>
          <p className="intro">
            This branch focuses on the public catalog: available pets, responsive filters,
            and paginated browsing backed by the API.
          </p>
        </div>
        <div className="hero-accent">
          <span>Available pets</span>
          <strong>{listingState.pagination?.totalItems ?? 0}</strong>
        </div>
      </section>

      <section className="filter-bar" aria-label="Pet filters">
        <label>
          Search by name or breed
          <input
            name="search"
            value={filters.search}
            onChange={updateFilter}
            placeholder="Try Labrador or Luna"
          />
        </label>

        <label>
          Species
          <select name="species" value={filters.species} onChange={updateFilter}>
            <option value="">All species</option>
            {listingState.filterOptions.species.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </label>

        <label>
          Breed
          <select name="breed" value={filters.breed} onChange={updateFilter}>
            <option value="">All breeds</option>
            {listingState.filterOptions.breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>

        <label>
          Age
          <select name="ageGroup" value={filters.ageGroup} onChange={updateFilter}>
            {ageGroupOptions.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {listingState.error ? <p className="state-banner error">{listingState.error}</p> : null}

      {listingState.loading ? (
        <section className="pet-grid" aria-label="Loading pets">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="pet-card pet-card-skeleton" key={`skeleton-${index}`}>
              <div className="skeleton-media" />
              <div className="skeleton-line long" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </article>
          ))}
        </section>
      ) : (
        <section className="pet-grid" aria-label="Available pets">
          {listingState.items.length > 0 ? (
            listingState.items.map((pet) => (
              <article className="pet-card" key={pet._id}>
                <img
                  className="pet-image"
                  src={pet.imageUrl}
                  alt={`${pet.name} the ${pet.breed}`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="pet-copy">
                  <div className="pet-heading">
                    <div>
                      <h2>{pet.name}</h2>
                      <p>
                        {pet.breed} · {pet.species}
                      </p>
                    </div>
                    <span className="pet-badge">{pet.age} yrs</span>
                  </div>
                  <p className="pet-description">{pet.description}</p>
                  <dl className="pet-meta">
                    <div>
                      <dt>Location</dt>
                      <dd>{pet.location}</dd>
                    </div>
                    <div>
                      <dt>Size</dt>
                      <dd>{pet.size}</dd>
                    </div>
                    <div>
                      <dt>Gender</dt>
                      <dd>{pet.gender}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))
          ) : (
            <article className="empty-state">
              <h2>No pets matched these filters.</h2>
              <p>Try clearing one filter or broadening the search term.</p>
            </article>
          )}
        </section>
      )}

      {listingState.pagination ? (
        <nav className="pagination" aria-label="Pagination">
          <button
            type="button"
            onClick={() => goToPage(listingState.pagination.page - 1)}
            disabled={!listingState.pagination.hasPreviousPage}
          >
            Previous
          </button>
          <span>
            Page {listingState.pagination.page} of {listingState.pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(listingState.pagination.page + 1)}
            disabled={!listingState.pagination.hasNextPage}
          >
            Next
          </button>
        </nav>
      ) : null}
    </main>
  );
}

export default App;

