import PetFilters from '../components/pets/PetFilters';
import PetGrid from '../components/pets/PetGrid';
import PetPagination from '../components/pets/PetPagination';
import { usePets } from '../hooks/usePets';

function PetListingPage() {
  const { filters, listingState, updateFilter, goToPage } = usePets();

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

      <PetFilters
        filters={filters}
        filterOptions={listingState.filterOptions}
        onChange={updateFilter}
      />

      {listingState.error ? <p className="state-banner error">{listingState.error}</p> : null}

      <PetGrid items={listingState.items} loading={listingState.loading} />
      <PetPagination pagination={listingState.pagination} onPageChange={goToPage} />
    </main>
  );
}

export default PetListingPage;

