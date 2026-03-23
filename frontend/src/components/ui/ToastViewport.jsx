import PropTypes from 'prop-types';

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <article className={`toast-card ${toast.type}`} key={toast.id}>
          <span className={`toast-indicator ${toast.type}`} aria-hidden="true" />
          <div className="toast-copy">
            <strong>{toast.type === 'error' ? 'Something went wrong' : 'Success'}</strong>
            <p>{toast.message}</p>
          </div>
          <button
            className="toast-close"
            type="button"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            Dismiss
          </button>
        </article>
      ))}
    </div>
  );
}

ToastViewport.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default ToastViewport;
