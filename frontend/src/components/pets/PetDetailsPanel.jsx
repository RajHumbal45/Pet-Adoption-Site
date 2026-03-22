import PropTypes from 'prop-types';

function PetDetailsPanel({ detailState, currentUser, adoptionState, onApply, onClose }) {
  const { item, loading, error } = detailState;

  return (
    <aside className="details-panel" aria-live="polite">
      <div className="details-header">
        <div>
          <p className="eyebrow panel-eyebrow">Pet Details</p>
          <h2>Meet your next companion</h2>
        </div>
        {item || error ? (
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close details">
            Close
          </button>
        ) : null}
      </div>

      {!item && !loading && !error ? (
        <div className="details-empty">
          <p>Select any pet card to view a richer profile and adoption-ready information.</p>
        </div>
      ) : null}

      {loading ? (
        <div className="details-loading">
          <div className="skeleton-media" />
          <div className="skeleton-line long" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ) : null}

      {error ? <p className="state-banner error details-error">{error}</p> : null}

      {item ? (
        <div className="details-content">
          <img className="details-image" src={item.imageUrl} alt={`${item.name} the ${item.breed}`} />
          <div className="details-copy">
            <div className="details-title">
              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.breed} · {item.species}
                </p>
              </div>
              <span className="pet-badge">{item.age} yrs</span>
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
                <dd>{item.energyLevel}</dd>
              </div>
              <div>
                <dt>Vaccinated</dt>
                <dd>{item.vaccinated ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{item.adoptionStatus}</dd>
              </div>
            </dl>

            <section className="detail-section">
              <h4>Good Match For</h4>
              <div className="tag-list">
                {item.goodWith.map((entry) => (
                  <span className="tag-chip" key={entry}>
                    {entry}
                  </span>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h4>Care Notes</h4>
              <p>{item.medicalNotes || 'No additional care notes provided.'}</p>
            </section>

            <div className="details-actions">
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
              <p>
                {currentUser
                  ? 'Your application will appear in the dashboard after submission.'
                  : 'Sign in first to submit an adoption request.'}
              </p>
            </div>
            {adoptionState.error ? <p className="notice error">{adoptionState.error}</p> : null}
            {adoptionState.success ? (
              <p className="notice success">{adoptionState.success}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

PetDetailsPanel.propTypes = {
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
