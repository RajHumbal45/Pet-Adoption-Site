import PropTypes from 'prop-types';

function UserDashboard({ user, applications, onLogout }) {
  const pendingCount = applications.items.filter((item) => item.status === 'pending').length;
  const approvedCount = applications.items.filter((item) => item.status === 'approved').length;
  const rejectedCount = applications.items.filter((item) => item.status === 'rejected').length;

  return (
    <section className="dashboard-shell">
      <section className="hero dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">User Dashboard</p>
          <h1>{user.name}, manage your adoption journey in one place.</h1>
          <p className="intro">
            Track every application, review current statuses, and continue browsing pets
            without losing your place.
          </p>
        </div>
        <div className="hero-accent">
          <span>Account</span>
          <strong>{user.role}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <p className="panel-label">Profile</p>
          <h2>{user.name}</h2>
          <p className="session-detail">{user.email}</p>
          <p className="role-pill">{user.role}</p>
          <button className="primary-button" type="button" onClick={onLogout}>
            Sign out
          </button>
        </article>

        <article className="dashboard-card stats-card">
          <p className="panel-label">Application Snapshot</p>
          <div className="stats-grid">
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div>
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </div>
            <div>
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-section-header">
          <div>
            <p className="panel-label">My Applications</p>
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
                <div>
                  <h3>{application.pet.name}</h3>
                  <p>
                    {application.pet.breed} · {application.pet.location}
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
  onLogout: PropTypes.func.isRequired,
};

export default UserDashboard;

