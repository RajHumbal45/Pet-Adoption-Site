import PropTypes from 'prop-types';

function AdminApplicationsPanel({ applicationState, onReview }) {
  return (
    <section className="admin-card">
      <div className="section-head">
        <div>
          <p className="panel-label">Admin Applications</p>
          <h2>Review applications</h2>
        </div>
      </div>

      {applicationState.loading ? <p className="application-copy">Loading applications...</p> : null}

      <div className="admin-list">
        {applicationState.items.map((application) => (
          <article className="admin-item application-review-item" key={application._id}>
            <div className="admin-item-copy">
              <div className="admin-item-head">
                <h3>{application.pet.name}</h3>
                <span className={`status-pill ${application.status}`}>{application.status}</span>
              </div>
              <p>{application.pet.breed} - {application.applicant.name}</p>
              <p className="admin-subtle">{application.applicant.email}</p>
              <p className="review-note">
                {application.message || 'No applicant note provided.'}
              </p>
            </div>
            <div className="admin-actions stacked-actions">
              {application.status === 'pending' ? (
                <>
                  <button
                    className="secondary-button admin-action-button"
                    type="button"
                    onClick={() => onReview(application._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="secondary-button danger-button admin-action-button"
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
