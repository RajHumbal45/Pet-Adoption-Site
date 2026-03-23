import PropTypes from 'prop-types';

function GuestAuthPanel({
  mode,
  onModeChange,
  formState,
  authState,
  onFieldChange,
  onSubmit,
}) {
  return (
    <aside className="auth-panel">
      <section className="auth-card">
        <div className="section-head">
          <div>
            <p className="panel-label">Account</p>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          </div>
        </div>
        <p className="application-copy">
          {mode === 'login'
            ? 'Sign in to apply for pets and check your application status.'
            : 'Create an account to apply for pets and track updates.'}
        </p>

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

          <button className="primary-button" type="submit" disabled={authState.loading}>
            {authState.loading
              ? 'Please wait...'
              : mode === 'register'
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <p className="auth-footnote">
          {mode === 'login'
            ? 'You can still browse pets without signing in.'
            : 'Create a normal account to apply for pets and track updates.'}
        </p>
      </section>
    </aside>
  );
}

GuestAuthPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    adminSetupKey: PropTypes.string.isRequired,
  }).isRequired,
  authState: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default GuestAuthPanel;

