import PropTypes from 'prop-types';

function PetCard({ pet, onViewDetails }) {
  return (
    <article className="pet-card">
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
              {pet.breed} - {pet.species}
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
        <button className="secondary-button" type="button" onClick={() => onViewDetails(pet._id)}>
          View details
        </button>
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

