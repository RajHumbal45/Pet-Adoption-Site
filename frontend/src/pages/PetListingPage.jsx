import PropTypes from 'prop-types';
import { useState } from 'react';
import api from '../api';
import PetDetailsPanel from '../components/pets/PetDetailsPanel';
import PetFilters from '../components/pets/PetFilters';
import PetGrid from '../components/pets/PetGrid';
import PetPagination from '../components/pets/PetPagination';
import { usePets } from '../hooks/usePets';
import { usePetDetails } from '../hooks/usePetDetails';

function PetListingPage({ currentUser, onApplicationCreated, onToast }) {
  const { filters, listingState, updateFilter, goToPage } = usePets();
  const [selectedPetId, setSelectedPetId] = useState('');
  const detailState = usePetDetails(selectedPetId);
  const [adoptionState, setAdoptionState] = useState({
    loading: false,
    error: '',
    success: '',
  });

  async function handleApply() {
    if (!selectedPetId) {
      return;
    }

    if (!currentUser) {
      setAdoptionState({
        loading: false,
        error: 'Sign in before applying to adopt a pet.',
        success: '',
      });
      onToast({ type: 'error', message: 'Sign in before applying to adopt a pet.' });
      return;
    }

    setAdoptionState({
      loading: true,
      error: '',
      success: '',
    });

    try {
      const { data } = await api.post('/adoptions', {
        petId: selectedPetId,
        message: `I would like to adopt ${detailState.item?.name || 'this pet'}.`,
      });

      setAdoptionState({
        loading: false,
        error: '',
        success: data.message,
      });
      onToast({ type: 'success', message: data.message });
      await onApplicationCreated();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to submit application.';
      setAdoptionState({
        loading: false,
        error: message,
        success: '',
      });
      onToast({ type: 'error', message });
    }
  }

  return (
    <section className="listing-shell">
      <section className="catalog-panel">
        <div className="section-head">
          <div>
            <p className="panel-label">Pet List</p>
            <h2>Available pets</h2>
            <p className="application-copy">
              Search, filter, and open a pet profile to learn more before applying.
            </p>
          </div>
          {listingState.pagination ? (
            <div className="catalog-summary">
              <strong>{listingState.pagination.totalItems}</strong>
              <span>pets available</span>
            </div>
          ) : null}
        </div>

        <PetFilters
          filters={filters}
          filterOptions={listingState.filterOptions}
          onChange={updateFilter}
        />

        {listingState.error ? <p className="state-banner error">{listingState.error}</p> : null}

        <PetGrid
          items={listingState.items}
          loading={listingState.loading}
          onViewDetails={(petId) => {
            setSelectedPetId(petId);
            setAdoptionState({
              loading: false,
              error: '',
              success: '',
            });
          }}
        />
        <PetPagination pagination={listingState.pagination} onPageChange={goToPage} />
      </section>

      <PetDetailsPanel
        isOpen={Boolean(selectedPetId)}
        detailState={detailState}
        currentUser={currentUser}
        adoptionState={adoptionState}
        onApply={handleApply}
        onClose={() => setSelectedPetId('')}
      />
    </section>
  );
}

PetListingPage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  onApplicationCreated: PropTypes.func.isRequired,
  onToast: PropTypes.func.isRequired,
};

PetListingPage.defaultProps = {
  currentUser: null,
};

export default PetListingPage;
