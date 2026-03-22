import PropTypes from 'prop-types';
import { useState } from 'react';
import api from '../api';
import PetDetailsPanel from '../components/pets/PetDetailsPanel';
import PetFilters from '../components/pets/PetFilters';
import PetGrid from '../components/pets/PetGrid';
import PetPagination from '../components/pets/PetPagination';
import { usePets } from '../hooks/usePets';
import { usePetDetails } from '../hooks/usePetDetails';

function PetListingPage({ currentUser, onApplicationCreated }) {
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
      await onApplicationCreated();
    } catch (error) {
      setAdoptionState({
        loading: false,
        error: error.response?.data?.message || 'Unable to submit application.',
        success: '',
      });
    }
  }

  return (
    <section className="listing-shell">
      <PetFilters
        filters={filters}
        filterOptions={listingState.filterOptions}
        onChange={updateFilter}
      />

      {listingState.error ? <p className="state-banner error">{listingState.error}</p> : null}

      <section className="details-layout">
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
        <PetDetailsPanel
          detailState={detailState}
          currentUser={currentUser}
          adoptionState={adoptionState}
          onApply={handleApply}
          onClose={() => setSelectedPetId('')}
        />
      </section>
      <PetPagination pagination={listingState.pagination} onPageChange={goToPage} />
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
};

PetListingPage.defaultProps = {
  currentUser: null,
};

export default PetListingPage;
