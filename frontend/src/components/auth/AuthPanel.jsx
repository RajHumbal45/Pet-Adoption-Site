import PropTypes from 'prop-types';

function AuthPanel({
  mode,
  onModeChange,
  formState,
  authState,
  onFieldChange,
  onSubmit,
  onLogout,
  applications,
}) {
  return (
    <aside className="auth-panel">
      <section className="auth-card">
        {authState.user ? (
          <>
            <p className="panel-label">Current Session</p>
            <h2>{authState.user.name}</h2>
            <p className="session-detail">{authState.user.email}</p>
            <p className="role-pill">{authState.user.role}</p>
            <div className="session-stack">
              <div>
                <span>Status</span>
                <strong>Authenticated</strong>
              </div>
              <div>
                <span>Ready for</span>
                <strong>Adoption applications</strong>
              </div>
            </div>
            {authState.success ? <p className="notice success">{authState.success}</p> : null}
            <button className="primary-button" type="button" onClick={onLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className="mode-switch" role="tablist" aria-label="Authentication mode">
              <button
                className={mode === 'login' ? 'active' : ''}
                type="button"
                onClick={() => onModeChange('login')}
              >
                Login
              </button>
              <button
                className={mode === 'register' ? 'active' : ''}
                type="button"
                onClick={() => onModeChange('register')}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={onSubmit}>
              {mode === 'register' ? (
                <label>
                  Full name
                  <input
                    name="name"
                    value={formState.name}
                    onChange={onFieldChange}
                    placeholder="Jane Foster"
                    required
                  />
                </label>
              ) : null}

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={onFieldChange}
                  placeholder="jane@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={onFieldChange}
                  placeholder="Minimum 8 characters"
                  required
                />
              </label>

              {mode === 'register' ? (
                <label>
                  Admin setup key
                  <input
                    name="adminSetupKey"
                    type="password"
                    value={formState.adminSetupKey}
                    onChange={onFieldChange}
                    placeholder="Optional"
                  />
                </label>
              ) : null}

              {authState.error ? <p className="notice error">{authState.error}</p> : null}
              {authState.success ? <p className="notice success">{authState.success}</p> : null}

              <button className="primary-button" type="submit" disabled={authState.loading}>
                {authState.loading
                  ? 'Please wait...'
                  : mode === 'register'
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>
          </>
        )}
      </section>

      <section className="application-card">
        <p className="panel-label">My Applications</p>
        {applications.loading ? <p className="application-copy">Loading applications...</p> : null}
        {applications.error ? <p className="notice error">{applications.error}</p> : null}
        {!authState.user ? (
          <p className="application-copy">Sign in to track your adoption requests.</p>
        ) : null}
        {authState.user && !applications.loading && applications.items.length === 0 ? (
          <p className="application-copy">No applications yet. Open a pet profile and apply.</p>
        ) : null}
        {applications.items.length > 0 ? (
          <div className="application-list">
            {applications.items.map((application) => (
              <article className="application-item" key={application._id}>
                <div>
                  <h3>{application.pet.name}</h3>
                  <p>
                    {application.pet.breed} · {application.pet.location}
                  </p>
                </div>
                <span className={`status-pill ${application.status}`}>{application.status}</span>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}

AuthPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    adminSetupKey: PropTypes.string.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  applications: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
};

export default AuthPanel;

