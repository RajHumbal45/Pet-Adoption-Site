import PropTypes from 'prop-types';
import { getPetPlaceholder } from '../../utils/petPlaceholder';

function PetDetailsPanel({ isOpen, detailState, currentUser, adoptionState, onApply, onClose }) {
  const { item, loading, error } = detailState;
  const goodWith = item?.goodWith ?? [];
  const energyLevel = item?.energyLevel || 'Not specified';
  const vaccinatedLabel = typeof item?.vaccinated === 'boolean'
    ? item.vaccinated
      ? 'Yes'
      : 'No'
    : 'Not specified';

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="details-panel details-modal"
        aria-live="polite"
        role="dialog"
        aria-modal="true"
        aria-label="Pet profile"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="section-head">
          <div>
            <p className="eyebrow panel-eyebrow">Pet Details</p>
            <h2>Pet profile</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details">
            Close
          </button>
        </div>

        {loading ? (
          <div className="details-loading">
            <div className="skeleton-media" />
            <div className="skeleton-line long" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ) : null}

        {error ? <p className="state-banner error details-error">{error}</p> : null}

        {!item && !loading && !error ? (
          <div className="details-empty">
            <p className="details-empty-title">Pet details are not available right now.</p>
            <p>Close this panel and try opening the profile again.</p>
          </div>
        ) : null}

        {item ? (
          <div className="details-content">
            <div className="details-hero">
              <img
                className="details-image"
                src={item.imageUrl}
                alt={`${item.name} the ${item.breed}`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getPetPlaceholder(item);
                }}
              />
              <div className="details-hero-overlay">
                <span className={`status-pill ${item.adoptionStatus}`}>{item.adoptionStatus}</span>
                <span className="pet-badge">{item.age} yrs</span>
              </div>
            </div>
            <div className="details-copy">
              <div className="details-title">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.breed} - {item.species}</p>
                </div>
              </div>

              <p className="pet-description">{item.description}</p>

              <dl className="detail-facts">
                <div>
                  <dt>Location</dt>
                  <dd>{item.location}</dd>
                </div>
                <div>
                  <dt>Gender</dt>
                  <dd>{item.gender}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{item.size}</dd>
                </div>
                <div>
                  <dt>Energy</dt>
                  <dd>{energyLevel}</dd>
                </div>
                <div>
                  <dt>Vaccinated</dt>
                  <dd>{vaccinatedLabel}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{item.adoptionStatus}</dd>
                </div>
              </dl>

            <section className="detail-section">
              <h4>Good fit for</h4>
              {goodWith.length > 0 ? (
                <div className="tag-list">
                  {goodWith.map((entry) => (
                    <span className="tag-chip" key={entry}>
                      {entry}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No compatibility notes available.</p>
              )}
            </section>

              <section className="detail-section">
                <h4>Care notes</h4>
                <p>{item.medicalNotes || 'No additional care notes provided.'}</p>
              </section>

              <div className="details-actions">
                <div>
                  <p className="panel-label">Next Step</p>
                  <p>
                    {currentUser
                      ? 'Send an adoption request from here. You will see updates in your dashboard.'
                      : 'Sign in first to submit an adoption request for this pet.'}
                  </p>
                </div>
                <button
                  className="primary-button"
                  type="button"
                  onClick={onApply}
                  disabled={adoptionState.loading}
                >
                  {adoptionState.loading
                    ? 'Submitting...'
                    : currentUser
                      ? 'Apply to adopt'
                      : 'Login to apply'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

PetDetailsPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  detailState: PropTypes.shape({
    item: PropTypes.shape({
      name: PropTypes.string,
      species: PropTypes.string,
      breed: PropTypes.string,
      age: PropTypes.number,
      gender: PropTypes.string,
      size: PropTypes.string,
      location: PropTypes.string,
      imageUrl: PropTypes.string,
      description: PropTypes.string,
      energyLevel: PropTypes.string,
      goodWith: PropTypes.arrayOf(PropTypes.string),
      vaccinated: PropTypes.bool,
      medicalNotes: PropTypes.string,
      adoptionStatus: PropTypes.string,
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  adoptionState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

PetDetailsPanel.defaultProps = {
  currentUser: null,
};

export default PetDetailsPanel;
