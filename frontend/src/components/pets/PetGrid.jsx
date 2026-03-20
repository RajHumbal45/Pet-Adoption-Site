import PropTypes from 'prop-types';
import PetCard from './PetCard';

function PetGrid({ items, loading }) {
  if (loading) {
    return (
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
    );
  }

  return (
    <section className="pet-grid" aria-label="Available pets">
      {items.length > 0 ? (
        items.map((pet) => <PetCard key={pet._id} pet={pet} />)
      ) : (
        <article className="empty-state">
          <h2>No pets matched these filters.</h2>
          <p>Try clearing one filter or broadening the search term.</p>
        </article>
      )}
    </section>
  );
}

PetGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PetGrid;
