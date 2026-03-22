import PropTypes from 'prop-types';

function AdminApplicationsPanel({ applicationState, onReview }) {
  return (
    <section className="admin-card">
      <div className="admin-header">
        <div>
          <p className="panel-label">Admin Applications</p>
          <h2>Review applications</h2>
        </div>
      </div>

      {applicationState.loading ? <p className="application-copy">Loading applications...</p> : null}
      {applicationState.error ? <p className="notice error">{applicationState.error}</p> : null}
      {applicationState.success ? <p className="notice success">{applicationState.success}</p> : null}

      <div className="admin-list">
        {applicationState.items.map((application) => (
          <article className="admin-item application-review-item" key={application._id}>
            <div>
              <h3>{application.pet.name}</h3>
              <p>
                {application.pet.breed} - {application.applicant.name} - {application.applicant.email}
              </p>
              <p className="review-note">
                {application.message || 'No applicant note provided.'}
              </p>
            </div>
            <div className="admin-actions stacked-actions">
              <span className={`status-pill ${application.status}`}>{application.status}</span>
              {application.status === 'pending' ? (
                <>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => onReview(application._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="secondary-button danger-button"
                    type="button"
                    onClick={() => onReview(application._id, 'rejected')}
                  >
                    Reject
                  </button>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

AdminApplicationsPanel.propTypes = {
  applicationState: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
  }).isRequired,
  onReview: PropTypes.func.isRequired,
};

export default AdminApplicationsPanel;

