import PropTypes from 'prop-types';
import { getPetPlaceholder } from '../../utils/petPlaceholder';

function PetCard({ pet, onViewDetails }) {
  return (
    <article className="pet-card">
      <div className="pet-media-wrap">
        <img
          className="pet-image"
          src={pet.imageUrl}
          alt={`${pet.name} the ${pet.breed}`}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getPetPlaceholder(pet);
          }}
        />
        <span className="pet-species-chip">{pet.species}</span>
      </div>
      <div className="pet-copy">
        <div className="pet-heading">
          <div>
            <h2>{pet.name}</h2>
            <p>{pet.breed}</p>
          </div>
          <span className="pet-badge">{pet.age} yrs</span>
        </div>
        <p className="pet-meta-line">
          {pet.location} • {pet.size} • {pet.gender}
        </p>
        <p className="pet-description">{pet.description}</p>
        <div className="pet-card-footer">
          <button className="secondary-button" type="button" onClick={() => onViewDetails(pet._id)}>
            View details
          </button>
        </div>
      </div>
    </article>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    gender: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default PetCard;

