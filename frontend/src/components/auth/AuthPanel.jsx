import PropTypes from 'prop-types';
import GuestAuthPanel from './GuestAuthPanel';

function AuthPanel(props) {
  if (!props.authState.user) {
    return <GuestAuthPanel {...props} />;
  }

  return null;
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

