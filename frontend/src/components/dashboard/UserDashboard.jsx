import PropTypes from 'prop-types';

function UserDashboard({ user, applications }) {
  const pendingCount = applications.items.filter((item) => item.status === 'pending').length;
  const approvedCount = applications.items.filter((item) => item.status === 'approved').length;
  const rejectedCount = applications.items.filter((item) => item.status === 'rejected').length;

  return (
    <section className="dashboard-shell">
      <section className="dashboard-overview">
        <div className="dashboard-intro-card">
          <p className="panel-label">My Dashboard</p>
          <h2>Welcome back, {user.name}</h2>
          <p className="application-copy">
            Track your adoption requests and keep browsing pets that fit your home.
          </p>
        </div>

        <div className="dashboard-summary-grid">
          <article className="dashboard-summary-card">
            <span>Total</span>
            <strong>{applications.items.length}</strong>
          </article>
          <article className="dashboard-summary-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className="dashboard-summary-card">
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </article>
          <article className="dashboard-summary-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <p className="panel-label">Applications</p>
            <h2>Application history</h2>
          </div>
        </div>

        {applications.loading ? <p className="application-copy">Loading applications...</p> : null}
        {applications.error ? <p className="notice error">{applications.error}</p> : null}
        {!applications.loading && applications.items.length === 0 ? (
          <p className="application-copy">No applications yet. Open a pet profile and apply.</p>
        ) : null}

        {applications.items.length > 0 ? (
          <div className="dashboard-application-list">
            {applications.items.map((application) => (
              <article className="dashboard-application-item" key={application._id}>
                <div className="dashboard-application-copy">
                  <h3>{application.pet.name}</h3>
                  <p>
                    {application.pet.breed} - {application.pet.location}
                  </p>
                  <p className="review-note">
                    {application.message || 'No application note was submitted.'}
                  </p>
                </div>
                <div className="dashboard-application-meta">
                  <span className={`status-pill ${application.status}`}>{application.status}</span>
                  <small>
                    {new Date(application.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </small>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}

UserDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  applications: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserDashboard;

