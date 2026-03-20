import PropTypes from 'prop-types';

function PetPagination({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={!pagination.hasPreviousPage}
      >
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.hasNextPage}
      >
        Next
      </button>
    </nav>
  );
}

PetPagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    hasPreviousPage: PropTypes.bool.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
  }),
  onPageChange: PropTypes.func.isRequired,
};

PetPagination.defaultProps = {
  pagination: null,
};

export default PetPagination;
